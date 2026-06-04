const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db'); // Ensure your db.js exists

app.use(cors());
app.use(express.json());

// 1. Health check (Isse confirm hoga ki backend zinda hai)
app.get('/health', (req, res) => res.json({ status: "ok" }));

// 2. Real patient route (Isse confirm hoga ki table se data aa raha hai)
app.get('/patients', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM patients");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(5000, '0.0.0.0',() =>{
  console.log("Server running on port 5000");
});