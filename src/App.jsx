import React, { useState } from 'react';

// Standardized dual-coding dataset representing NAMASTE & ICD-11 Traditional Medicine Module 2
const SAMPLE_MAPPINGS = [
  { id: 1, system: "Ayurveda", term: "Jwara", code: "AYU-102", icd11: "SF50", title: "Fever / Pyrexia", confidence: "98%", status: "Exact Match" },
  { id: 2, system: "Ayurveda", term: "Kamala", code: "AYU-341", icd11: "SF81", title: "Jaundice / Disorders of Hepatobiliary System", confidence: "95%", status: "Exact Match" },
  { id: 3, system: "Unani", term: "Humma", code: "UNI-512", icd11: "SF50", title: "Fever / Pyrexia", confidence: "94%", status: "Exact Match" },
  { id: 4, system: "Siddha", term: "Vatha Soolai", code: "SID-809", icd11: "SF12", title: "Arthritic disorders / Rheumatism", confidence: "87%", status: "Approximated" }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSystem, setSelectedSystem] = useState("All");
  const [records, setRecords] = useState([]);

  const filteredResults = SAMPLE_MAPPINGS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSystem = selectedSystem === "All" || item.system === selectedSystem;
    return matchesSearch && matchesSystem;
  });

  const handleCommitToEHR = (item) => {
    if (!records.some(r => r.id === item.id)) {
      setRecords([...records, { ...item, timestamp: new Date().toLocaleTimeString() }]);
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f1f5f9', minHeight: '100vh', padding: '24px' }}>
      {/* Header Panel */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '22px', color: '#0f172a' }}>SIH25026: Dual-Coding Integration Portal</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '13px' }}>NAMASTE Standardized AYUSH Terminologies ⇆ WHO ICD-11 (TM2 Module)</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>ABDM Enabled</span>
          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>FHIR JSON Ready</span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        
        {/* Left Section: Interactive Mapping Engine */}
        <section style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '16px', marginTop: '0' }}>Traditional Diagnostic Coding Interface</h2>
          
          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <select 
              value={selectedSystem} 
              onChange={(e) => setSelectedSystem(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All AYUSH Systems</option>
              <option value="Ayurveda">Ayurveda</option>
              <option value="Unani">Unani</option>
              <option value="Siddha">Siddha</option>
            </select>
            <input 
              type="text" 
              placeholder="Search diagnostic terms (e.g., Jwara, Kamala, Humma)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>

          {/* Core Mapping Visualizer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredResults.length > 0 ? (
              filteredResults.map(item => (
                <div key={item.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', backgroundColor: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0369a1' }}>
                      {item.system}
                    </span>
                    <span style={{ fontSize: '12px', color: '#475569' }}>
                      AI-Mapping Confidence: <strong style={{ color: '#15803d' }}>{item.confidence}</strong>
                    </span>
                  </div>

                  {/* Horizontal Bridge Graphic */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>NAMASTE Standard Term</p>
                      <h3 style={{ margin: '4px 0 2px 0', fontSize: '18px', color: '#0f172a' }}>{item.term}</h3>
                      <code style={{ fontSize: '11px', color: '#0284c7' }}>Code: {item.code}</code>
                    </div>

                    <div style={{ fontSize: '20px', color: '#cbd5e1', fontWeight: 'bold' }}>⇆</div>

                    <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>WHO ICD-11 (TM Module 2)</p>
                      <h3 style={{ margin: '4px 0 2px 0', fontSize: '18px', color: '#0f172a' }}>{item.title}</h3>
                      <code style={{ fontSize: '11px', color: '#16a34a' }}>ICD-11: {item.icd11}</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Precision Category: <strong>{item.status}</strong></span>
                    <button 
                      onClick={() => handleCommitToEHR(item)}
                      style={{ padding: '8px 16px', backgroundColor: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
                    >
                      Commit to EHR Session
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No direct dual-codified mappings found.</p>
            )}
          </div>
        </section>

        {/* Right Section: Active Clinician EHR Queue */}
        <aside style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '4px', marginTop: '0' }}>Active EHR Session</h2>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '20px', marginTop: '0' }}>Real-time queue mapping directly to regional repository schemas.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {records.length > 0 ? (
              records.map((rec, index) => (
                <div key={index} style={{ borderLeft: '4px solid #16a34a', padding: '10px 12px', backgroundColor: '#f0fdf4', borderRadius: '0 8px 8px 0', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1e293b' }}>
                    <span>{rec.term} ({rec.system})</span>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>{rec.timestamp}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                    Dual-Coded: <strong style={{ color: '#15803d' }}>{rec.icd11}</strong> ({rec.title})
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 0', border: '2px dashed #e2e8f0', borderRadius: '8px', fontSize: '13px' }}>
                No active records committed to EHR yet.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}