const express = require('express');
const cors = require('cors');
const app = express();
const client = require('./db'); // Database connection client
const axios = require('axios');

app.use(cors());
app.use(express.json());

// 1. Health check
app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

// 2. Real patient route (Symptom mapping)
app.get('/patients', async (req, res) => {
    try {
        const queryText = `
            SELECT 
                p.symptom AS "DISEASES / CONDITION", 
                CONCAT('TM-', 500 + p.id) AS "SYSTEM ID", 
                COALESCE(m.icd_code, 'Pending') AS "ICD CODE DESIGNATION", 
                COALESCE(m.diagnosis, 'Clinical presentation evaluated') AS "STANDARDIZED STRUCTURAL DIAGNOSIS"
            FROM patients p
            LEFT JOIN icd_mappings m ON LOWER(p.symptom) = LOWER(m.disease_name);
        `;
        
        const result = await client.query(queryText);
        res.json(result.rows);
    } catch (err) {
        console.error("Error in /patients route:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. NEW FEATURE: Create API Route (Saves new ICD configs directly to DB)
app.post('/api/create-mapping', async (req, res) => {
    const { disease_name, icd_code, diagnosis } = req.body;
    
    if (!disease_name || !icd_code || !diagnosis) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const insertQuery = `
            INSERT INTO icd_mappings (disease_name, icd_code, diagnosis)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const result = await client.query(insertQuery, [disease_name.trim(), icd_code.trim(), diagnosis.trim()]);
        res.status(201).json({ message: "API Configuration Created Successfully!", data: result.rows[0] });
    } catch (err) {
        console.error("Error creating mapping:", err);
        res.status(500).json({ error: err.message });
    }
});

// 4. Live Dashboard Stats Route (Purane saare counts ke sath)
app.get('/dashboard/stats', async (req, res) => {
    try {
        const totalPatientsRes = await client.query("SELECT COUNT(*) FROM patients");
        const totalPatients = parseInt(totalPatientsRes.rows[0].count, 10);

        const pendingMappingsRes = await client.query(`
            SELECT COUNT(*) FROM patients p
            LEFT JOIN icd_mappings m ON LOWER(p.symptom) = LOWER(m.disease_name)
            WHERE m.id IS NULL
        `);
        const pendingMappings = parseInt(pendingMappingsRes.rows[0].count, 10);

        // API Searches aur Gateway ko represent karne ke liye live DB counts
        const telemetryRes = await client.query("SELECT COUNT(*) FROM api_telemetry");
        const icdSearches = parseInt(telemetryRes.rows[0].count, 10);

        const mappedPatients = totalPatients - pendingMappings;
        const mappingAccuracy = totalPatients > 0 
            ? parseFloat(((mappedPatients / totalPatients) * 100).toFixed(1)) 
            : 100.0;

        res.json({
            totalPatients,
            pendingMappings,
            icdSearches, // API Searches (Purana feature intact)
            mappingAccuracy
        });
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 5. Telemetry Chart Data Route (Graph analytics intact)
app.get('/api/analytics', async (req, res) => {
    try {
        const queryText = `
            SELECT TO_CHAR(d, 'YYYY-MM-DD') as day, COALESCE(COUNT(t.id), 0) as count
            FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day') d
            LEFT JOIN api_telemetry t ON DATE(t.timestamp) = DATE(d)
            GROUP BY d
            ORDER BY d ASC;
        `;
        const result = await client.query(queryText);
        res.json(result.rows);
    } catch (err) {
        console.error("Analytics chart error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});