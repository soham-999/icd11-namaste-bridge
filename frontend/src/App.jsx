import React, { useState } from 'react';
import './App.css';
import Dashboard from'./Dashboard'; // Naye dashboard ko sahi se import kiya

export default function App() {
  const [count, setCount] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false); // Toggle state

  // Agar button click hua hai, toh dashboard dikhao
  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} />;
  }

  // Aapka puraana core code
  return (
    <div className="App">
      <h1>NAMASTE-ICD Frontend</h1>
      <p>Welcome to the Medical Coding & Mapping Interface.</p>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is: {count}
        </button>
        <p>Frontend server is running successfully!</p>
      </div>

      {/* Dashboard par jaane ka button */}
      <button className="view-dash-btn" onClick={() => setShowDashboard(true)}>
        📊 Open Mapping Logs Dashboard
      </button>
    </div>
  );
}