import React, { useState, useEffect } from 'react';
import { INTEGRATION_API } from './api';

// Safe catalog for local lookup and translation demo
const localCatalog = [
  { disease: "Amavata", western: "Rheumatoid Arthritis", icd: "1B10.0", namaste: "A-AM-01" },
  { disease: "Waja-ul-mafasil", western: "Osteoarthritis Matrix", icd: "FA00.Z", namaste: "U-WM-04" },
  { disease: "Jwar", western: "Fever / Pyrexia", icd: "MG46", namaste: "A-JV-01" },
  { disease: "Tamaka Shwasa", western: "Asthma", icd: "CA40.0", namaste: "A-TS-09" }
];

interface CustomAPI {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  targetFormat: string;
  status: string;
}

export default function MappingConsole() {
  // --- Translation Engine Hooks ---
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>(localCatalog);

  // --- Custom API Generator Hooks ---
  const [apis, setApis] = useState<CustomAPI[]>([
    { id: "API-901", name: "Apollo Hospital Sync Node", endpoint: "/api/v1/ayush/sync", method: "POST", targetFormat: "FHIR v4 / NAMASTE", status: "Active" }
  ]);
  const [apiName, setApiName] = useState('');
  const [method, setMethod] = useState('POST');
  const [format, setFormat] = useState('NAMASTE Framework (ABDM)');

  // 🔄 Real-time Translation Lookup Logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const apiEngine = (INTEGRATION_API as any).queryTranslationEngine;
      
      if (typeof apiEngine === 'function') {
        apiEngine(query).then(setResults);
      } else {
        const clean = query.toLowerCase().trim();
        if (!clean) {
          setResults(localCatalog);
        } else {
          const filtered = localCatalog.filter(item => 
            item.disease.toLowerCase().includes(clean) || 
            item.western.toLowerCase().includes(clean) ||
            item.icd.toLowerCase().includes(clean) ||
            item.namaste.toLowerCase().includes(clean)
          );
          setResults(filtered);
        }
      }
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // 🚀 Custom API Generation Handler
  const handleCreateAPI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiName) return alert("Please specify an API Name");

    const newAPI: CustomAPI = {
      id: `API-${Math.floor(100 + Math.random() * 900)}`,
      name: apiName,
      endpoint: `/api/v1/custom/${apiName.toLowerCase().replace(/\s+/g, '-')}`,
      method: method,
      targetFormat: format,
      status: "Active"
    };

    setApis([newAPI, ...apis]);
    setApiName('');
    alert("Enterprise Webhook & Custom API Pipeline Generated successfully!");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f8fafc] min-h-screen space-y-8 text-slate-800">
      
      {/* ---------------- SECTION 1: CORE TRANSLATION ENGINE ---------------- */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Interop Engine Terminal</span>
          <h2 className="text-lg sm:text-2xl font-black text-[#0f172a] mt-0.5">ICD11 ↔ NAMASTE Live Translation</h2>
        </div>
        
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search diagnostic terms across Ayurveda, Unani, or Allopathy (e.g., Amavata)..."
            className="w-full p-3 pl-10 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs font-medium bg-white"
          />
        </div>

        {/* Responsive Table Container with overflow scroll protection */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="bg-[#0b1f3a] text-white font-semibold text-[11px]">
                  <th className="p-4">Traditional Taxonomy</th>
                  <th className="p-4">Western Equivalent Title</th>
                  <th className="p-4">ICD-11 Code</th>
                  <th className="p-4">NAMASTE Code Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-400 font-bold">
                      No matching interoperability records located.
                    </td>
                  </tr>
                ) : (
                  results.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-all">
                      <td className="p-4 text-slate-900 font-bold">{item.disease}</td>
                      <td className="p-4 text-slate-600">{item.western || 'N/A'}</td>
                      <td className="p-4 font-mono text-rose-600 font-bold">{item.icd}</td>
                      <td className="p-4 font-mono text-sky-600 font-bold">{item.namaste}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* ---------------- SECTION 2: CUSTOM B2B API GENERATOR ---------------- */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">B2B Gateway Studio</span>
          <h3 className="text-base sm:text-xl font-black text-[#0f172a] mt-0.5">Enterprise Custom API Provisioner</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* API Generator Input Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <span>🔌</span> Provision New Endpoint Node
            </h4>
            <form onSubmit={handleCreateAPI} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 mb-1">API Client/System Name</label>
                <input 
                  type="text" 
                  value={apiName} 
                  onChange={e => setApiName(e.target.value)} 
                  placeholder="e.g., Max Healthcare Sync" 
                  className="w-full p-2.5 border rounded-xl bg-slate-50 focus:bg-white transition-colors outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 mb-1">HTTP Method</label>
                <select value={method} onChange={e => setMethod(e.target.value)} className="w-full p-2.5 border rounded-xl bg-white outline-none">
                  <option>POST</option><option>GET</option><option>PUT</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-500 mb-1">Target Interoperability Standard</label>
                <select value={format} onChange={e => setFormat(e.target.value)} className="w-full p-2.5 border rounded-xl bg-white outline-none">
                  <option>NAMASTE Framework (ABDM)</option>
                  <option>FHIR JSON v4.0.1</option>
                  <option>ICD-11 Standard Stream</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#0b1f3a] text-white p-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-sm">
                🚀 Deploy Custom Gateway Node
              </button>
            </form>
          </div>

          {/* Active Generated Endpoints Monitor */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <span>🌐</span> Active B2B Gateway Pipelines
            </h4>
            
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 border-b text-slate-400 font-bold">
                      <th className="p-3">ID</th>
                      <th className="p-3">Client System</th>
                      <th className="p-3">Live Endpoint Route</th>
                      <th className="p-3">Compliance Standard</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y font-medium text-slate-700">
                    {apis.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-sky-600">{item.id}</td>
                        <td className="p-3 font-bold text-slate-900">{item.name}</td>
                        <td className="p-3 font-mono text-slate-500 bg-slate-50/40 px-2 py-0.5 rounded text-[11px] truncate max-w-[160px]">{item.endpoint}</td>
                        <td className="p-3"><span className="bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded text-[10px]">{item.targetFormat}</span></td>
                        <td className="p-3"><span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded text-[10px]">{item.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}