import React, { useState } from "react";
import { getICDBySymptom } from "./api";

const initialLogs = [
  { id: "LOG-001", timestamp: "10:14:22", sourceTerm: "Acute appendicitis", targetICD11: "BD31.0", status: "Success", confidence: "98%" },
  { id: "LOG-002", timestamp: "10:15:05", sourceTerm: "Type 2 diabetes mellitus", targetICD11: "5A11", status: "Success", confidence: "95%" },
  { id: "LOG-003", timestamp: "10:16:11", sourceTerm: "Unknown chest pain fracture", targetICD11: "Mapping Failed", status: "Failed", confidence: "0%" },
  { id: "LOG-004", timestamp: "10:18:40", sourceTerm: "Essential hypertension", targetICD11: "BA00", status: "Success", confidence: "92%" },
  { id: "LOG-005", timestamp: "10:20:15", sourceTerm: "Hypercholesterolemia", targetICD11: "5C80.0", status: "Pending", confidence: "45%" },
];

export default function Dashboard({ onBack }) {
  const [logs, setLogs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [icdResult, setIcdResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleICDTest = async () => {
    try {
      const result = await getICDBySymptom("fever");
      console.log("ICD API Result:", result);
      alert("ICD API working. Check browser console (F12).");
    } catch (err) {
      console.error(err);
      alert("API Error");
    }
  };

  const handleSearch = async (value) => {
    try {
      setLoading(true);

      const result = await getICDBySymptom(value);

      console.log("Backend Response:", result);

      if (result.success) {
        setIcdResult(result.data);
      } else {
        setIcdResult(null);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setIcdResult(null);
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.sourceTerm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-section">
          <h2>NAMASTE-ICD</h2>
          <span className="badge">v1.0 Map Engine</span>
        </div>

        <ul className="nav-links">
          <li className="active">📊 Dashboard</li>

          <li
            onClick={onBack}
            style={{
              cursor: "pointer",
              color: "#ff6b6b",
              fontWeight: "bold",
            }}
          >
            ⬅️ Back to Main
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <header className="navbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search symptom (fever, cough, etc.)..."
              value={searchTerm}
              onChange={(e) => {
                const value = e.target.value;

                setSearchTerm(value);

                if (value.length > 2) {
                  handleSearch(value);
                }
              }}
            />
          </div>

          <button
            onClick={handleICDTest}
            style={{
              marginLeft: "10px",
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            Test ICD API
          </button>

          <div className="user-profile">
            <span className="user-status-dot"></span>
            Malini Singh
          </div>
        </header>

        <div className="content-body">
          <div className="welcome-header">
            <h3>Mapping Logs & Analytics</h3>
            <p>
              Monitor real-time EHR integration and ICD-11 terminology alignment
              status.
            </p>
          </div>

          {loading && (
            <div style={{ marginBottom: "15px" }}>
              Searching ICD...
            </div>
          )}

          {icdResult && (
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                background: "#f8f9fa",
              }}
            >
              <h4>Live ICD Result</h4>

              <p>
                <strong>Symptom:</strong> {icdResult.symptom}
              </p>

              <p>
                <strong>ICD Code:</strong> {icdResult.icdCode}
              </p>

              <p>
                <strong>Description:</strong> {icdResult.description}
              </p>
            </div>
          )}

          <div className="card-grid">
            <div className="card success-card">
              <h4>Total Processed</h4>
              <p className="stat-number">1,245</p>
            </div>

            <div className="card progress-card">
              <h4>Success Rate</h4>
              <p className="stat-number">94.2%</p>
            </div>

            <div className="card alert-card">
              <h4>Failed Mappings</h4>
              <p
                className="stat-number"
                style={{ color: "#ef4444" }}
              >
                12
              </p>
            </div>
          </div>

          <div className="table-section">
            <div className="table-header">
              <h4>Recent Mapping Activity</h4>

              <button
                className="refresh-btn"
                onClick={() => setLogs(initialLogs)}
              >
                🔄 Refresh
              </button>
            </div>

            <div className="table-wrapper">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Log ID</th>
                    <th>Time</th>
                    <th>Source Term (EHR)</th>
                    <th>Target ICD-11 Code</th>
                    <th>Status</th>
                    <th>Confidence</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <code>{log.id}</code>
                      </td>

                      <td>{log.timestamp}</td>

                      <td className="bold-text">
                        {log.sourceTerm}
                      </td>

                      <td>
                        <span className="code-badge">
                          {log.targetICD11}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-pill ${log.status.toLowerCase()}`}
                        >
                          {log.status}
                        </span>
                      </td>

                      <td>{log.confidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}