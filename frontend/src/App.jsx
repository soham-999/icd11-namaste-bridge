import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>NAMASTE-ICD Frontend</h1>
      <p>Welcome to the Medical Coding & Mapping Interface.</p>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is: {count}
        </button>
      </div>
      
      <p className="read-the-docs">
        Frontend server is running successfully!
      </p>
    </div>
  );
}

export default App;