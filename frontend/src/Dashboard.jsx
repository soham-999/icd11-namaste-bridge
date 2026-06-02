// src/Dashboard.jsx
import React, { useState } from 'react';
import { Search, Bell, History, Menu, Info, AlertTriangle } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import MetricCard from './MetricCard.jsx';
import { 
  interoperabilityMetrics, mappingActivityData, 
  terminologyDistribution, recentMappings, systemAuditLogs 
} from './data';

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // <-- Dynamic state manager
  const [searchInput, setSearchInput] = useState('');
  const [systemOutput, setSystemOutput] = useState(null);

  const handleTestMapping = (e) => {
    e.preventDefault();
    if (!searchInput) return;
    setSystemOutput({
      status: "200 OK",
      sourceTerminology: "NAMASTE (Ayurveda)",
      sourceTerm: searchInput,
      targetClassification: "ICD-11 TM (Chapter 26)",
      mappedCode: "1B10.2 / TM12",
      fhirCompatibleJson: JSON.stringify({
        resourceType: "ConceptMap",
        status: "active",
        source: "NAMASTE-TM-V1",
        target: "ICD-11-MMS",
        group: [{ element: [{ code: "Ayu-041", display: searchInput, target: [{ code: "1B10.2", relationship: "equivalent" }] }] }]
      }, null, 2)
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex">
      
      {/* Connect the state controller variables directly onto your Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <main className="flex-1 min-w-0 overflow-y-auto p-4 lg:p-8">
        
        {/* Header bar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 text-slate-600 bg-white rounded-lg shadow-sm border" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
                {activeTab === 'overview' && "Interoperability Console"}
                {activeTab === 'mapper' && "Terminology Mapper Subsystem"}
                {activeTab === 'ehr' && "EHR Endpoints Network Configuration"}
                {activeTab === 'records' && "Structured Clinical Records Vault"}
                {activeTab === 'fhir' && "FHIR / HL7 Data Output Engine"}
                {activeTab === 'history' && "Operational Audit Mapping History"}
                {activeTab === 'validation' && "Active Medical Validation Rulebook"}
                {activeTab === 'logs' && "Real-time Node Activity Logs"}
                {activeTab === 'alerts' && "Active Trigger System Alert Rules"}
                {activeTab === 'settings' && "Core System Gateway Settings"}
              </h2>
              <p className="text-sm text-slate-500">Traditional Medicine Terminology Mapping Engine Platform status.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 justify-between sm:justify-end">
            <div className="bg-white border rounded-xl px-4 py-2 text-sm font-medium shadow-sm text-slate-600 flex items-center gap-2">
              <History size={16} />
              <span>System Live Instance</span>
            </div>
            <button className="relative bg-white border p-2.5 rounded-xl text-slate-600 shadow-sm hover:bg-slate-50">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
            </button>
            <div className="flex items-center gap-2 border-l pl-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">A</div>
              <span className="text-sm font-semibold hidden md:inline text-slate-700">Practitioner Console</span>
            </div>
          </div>
        </header>

        {/* VIEW 1: OVERVIEW PANEL (Show only when activeTab is 'overview') */}
        {activeTab === 'overview' && (
          <>
            {/* Metrics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              {interoperabilityMetrics.map((card, idx) => (
                <MetricCard key={idx} index={idx} {...card} />
              ))}
            </section>

            {/* Search Input Mapping Workstation */}
            <section className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-6">
              <h4 className="font-bold text-slate-800 text-base mb-2">Live Terminology Input Verification Workflow</h4>
              <p className="text-xs text-slate-400 mb-4">Input localized Traditional Medicine terms to map across global database standards immediately.</p>
              <form onSubmit={handleTestMapping} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="e.g., Amavata, Tamaka Shwasa, Zeequn Nafas..." 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl text-sm shadow-sm hover:bg-blue-700 transition-colors">
                  Execute Interoperability Mapping
                </button>
              </form>

              {systemOutput && (
                <div className="mt-4 p-4 bg-slate-900 rounded-xl text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                  <div className="flex justify-between border-b border-slate-800 pb-2 mb-2 text-slate-400">
                    <span>[MAPPING_NODE_RESPONSE]: {systemOutput.status}</span>
                    <button type="button" onClick={() => setSystemOutput(null)} className="text-rose-400 hover:underline">Clear Output</button>
                  </div>
                  <p><span className="text-slate-500">Source:</span> {systemOutput.sourceTerminology} → "{systemOutput.sourceTerm}"</p>
                  <p><span className="text-slate-500">Mapped:</span> {systemOutput.targetClassification} → <span className="bg-slate-800 text-white px-1.5 py-0.5 rounded font-bold">{systemOutput.mappedCode}</span></p>
                  <pre className="mt-3 text-sky-400 text-[11px] leading-relaxed max-h-40 overflow-y-auto">{systemOutput.fhirCompatibleJson}</pre>
                </div>
              )}
            </section>

            {/* Analytics Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-slate-800 text-base">Mapping API Volume</h4>
                  <span className="text-slate-400 text-xs font-medium">Daily Queries</span>
                </div>
                <div className="flex items-end justify-between h-48 pt-4 border-b border-slate-100 relative">
                  {mappingActivityData.map((bar, i) => (
                    <div key={i} className="flex flex-col items-center w-full group relative">
                      <span className="absolute -top-6 text-[10px] bg-slate-800 text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">{bar.val}</span>
                      <div style={{ height: bar.pct }} className={`w-6 sm:w-8 rounded-t-md transition-all ${i === 6 ? 'bg-blue-600' : 'bg-blue-300 group-hover:bg-blue-400'}`}></div>
                      <span className="text-[10px] text-slate-400 mt-2 whitespace-nowrap">{bar.day.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-800 text-base mb-6">Terminology Distribution</h4>
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                      {terminologyDistribution.map((dept, i) => (
                        <circle key={i} cx="18" cy="18" r="15.915" fill="none" 
                          stroke={i === 0 ? '#10b981' : i === 1 ? '#2563eb' : i === 2 ? '#6366f1' : i === 3 ? '#f59e0b' : '#0ea5e9'} 
                          strokeWidth="3.5" strokeDasharray={dept.strokeDash} strokeDashoffset={dept.strokeOffset} />
                      ))}
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-lg font-bold text-slate-800">100%</span>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider">Classification</p>
                    </div>
                  </div>
                  <div className="text-xs space-y-1.5 w-full">
                    {terminologyDistribution.map((dept, i) => (
                      <div key={i} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full inline-block shrink-0 ${dept.color}`}></span>
                          <span className="truncate text-slate-600">{dept.name}</span>
                        </div>
                        <span className="text-slate-500 font-medium text-right shrink-0">{dept.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-slate-800 text-base mb-6">EHR Schema Compatibility</h4>
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-44 h-24 overflow-hidden flex items-end justify-center">
                    <div className="absolute top-0 w-40 h-40 rounded-full border-[14px] border-slate-100"></div>
                    <div className="absolute top-0 w-40 h-40 rounded-full border-[14px] border-emerald-500 border-b-transparent border-r-transparent transform rotate-[58deg]"></div>
                    <div className="z-10 text-center mb-1">
                      <span className="text-3xl font-extrabold text-slate-800">94%</span>
                      <p className="text-xs font-semibold text-slate-500 tracking-wide">FHIR Bound</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 w-full border-t border-slate-50 pt-4 mt-2 text-center text-xs">
                    <div>
                      <p className="text-slate-400 mb-0.5">Compliant Nodes</p>
                      <span className="text-base font-bold text-slate-800">17 / 18</span>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5">Integration Type</p>
                      <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-semibold inline-block mt-0.5">HL7 JSON</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Tables & Audits */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-800 text-base">Request Latency Trend</h4>
                  <span className="text-emerald-600 bg-emerald-50 text-xs px-2 py-0.5 rounded-md font-medium">Optimal</span>
                </div>
                <div className="h-40 w-full mt-6">
                  <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                    <path d="M0,40 L50,45 L100,35 L150,20 L200,28 L250,15 L300,12" fill="none" stroke="#2563eb" strokeWidth="3" />
                    <path d="M0,40 L50,45 L100,35 L150,20 L200,28 L250,15 L300,12 L300,100 L0,100 Z" fill="url(#grad)" opacity="0.1" />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                    <span>00:00 UTC</span>
                    <span>12:00 UTC</span>
                    <span>Current</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-base mb-4">Core Terminology Logs</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                          <th className="pb-2 font-medium">Source Concept</th>
                          <th className="pb-2 text-right font-medium">Target Code</th>
                          <th className="pb-2 text-right font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {recentMappings.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-medium truncate max-w-[120px]">{item.source}</td>
                            <td className="py-2.5 text-right font-mono font-semibold text-slate-600">{item.target}</td>
                            <td className="py-2.5 text-right">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                item.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              }`}>{item.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <button type="button" className="text-center text-xs font-semibold text-blue-600 mt-4 hover:underline">Download Standard Mapping Audit Report</button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-800 text-base">Security Audits ({systemAuditLogs.length})</h4>
                  <span className="text-xs text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded">Real-time</span>
                </div>
                <div className="space-y-3">
                  {systemAuditLogs.map((alert) => (
                    <div key={alert.id} className={`flex items-start gap-3 p-3.5 border rounded-xl ${
                      alert.type === 'high' ? 'bg-rose-50 border-rose-100' :
                      alert.type === 'low' ? 'bg-amber-50 border-amber-100' : 'bg-sky-50 border-sky-100'
                    }`}>
                      {alert.type === 'info' ? <Info className="text-sky-500 shrink-0 mt-0.5" size={16} /> : <AlertTriangle className={`shrink-0 mt-0.5 ${alert.type === 'high' ? 'text-rose-500' : 'text-amber-500'}`} size={16} />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className={`text-xs font-bold ${alert.type === 'high' ? 'text-rose-800' : alert.type === 'low' ? 'text-amber-800' : 'text-sky-800'}`}>{alert.title}</span>
                          <span className={`text-[10px] font-medium ${alert.type === 'high' ? 'text-rose-500' : alert.type === 'low' ? 'text-amber-500' : 'text-sky-500'}`}>{alert.time}</span>
                        </div>
                        <p className={`text-xs line-clamp-1 ${alert.type === 'high' ? 'text-rose-700' : alert.type === 'low' ? 'text-amber-700' : 'text-sky-700'}`}>{alert.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: GENERIC SUB-PAGE PLACEHOLDER WORKBENCH (Show for all other tabs) */}
        {activeTab !== 'overview' && (
          <div className="bg-white border rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 text-xl font-bold animate-pulse">
              ⚙️
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Subsystem Node Isolated</h3>
            <p className="text-sm text-slate-400 max-w-md">
              The layout container module is listening successfully. Ready to bind custom UI views or external API streams for this component view.
            </p>
          </div>
        )}

      </main>
    </div>
  );
}