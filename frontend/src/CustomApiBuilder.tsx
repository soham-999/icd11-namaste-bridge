import React, { useState } from 'react';

export default function CustomApiBuilder() {
  const [apiName, setApiName] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('GET');
  const [responseTemplate, setResponseTemplate] = useState('{\n  "status": "success",\n  "data": []\n}');

  const handleBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiName || !endpoint) return alert("Please fill in all basic fields.");
    
    alert(`Custom Interoperability Endpoint '${apiName}' successfully registered in system ledger!`);
    setApiName('');
    setEndpoint('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f8fafc] min-h-screen space-y-6">
      <div className="border-b pb-2">
        <h2 className="text-lg sm:text-xl font-bold text-[#0b1f3a]">Custom API Integration Builder</h2>
        <p className="text-xs text-slate-500">Bridge external AYUSH or Western EMR streams by mapping real-time custom endpoints.</p>
      </div>

      <form onSubmit={handleBuild} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">API Integration Name</label>
          <input 
            type="text" 
            value={apiName} 
            onChange={e => setApiName(e.target.value)} 
            className="w-full p-2.5 border rounded-xl text-xs sm:text-sm" 
            placeholder="e.g., AIIMS Webhook Sync" 
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label className="text-xs font-bold text-slate-500 block mb-1">Method</label>
            <select 
              value={method} 
              onChange={e => setMethod(e.target.value)} 
              className="w-full p-2.5 border rounded-xl text-xs sm:text-sm bg-white"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold text-slate-500 block mb-1">Endpoint URI</label>
            <input 
              type="text" 
              value={endpoint} 
              onChange={e => setEndpoint(e.target.value)} 
              className="w-full p-2.5 border rounded-xl text-xs sm:text-sm" 
              placeholder="/api/v1/interop/sync" 
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 block mb-1">JSON Response Schema / Payload Template</label>
          <textarea 
            rows={5} 
            value={responseTemplate} 
            onChange={e => setResponseTemplate(e.target.value)} 
            className="w-full p-2.5 border rounded-xl text-xs sm:text-sm font-mono text-slate-700 bg-slate-50"
          />
        </div>

        <button type="submit" className="w-full bg-sky-600 text-white p-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-sky-700 transition-colors">
          Initialize & Deploy Custom API Route
        </button>
      </form>
    </div>
  );
}