// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  mockPatients, 
  namasteToIcdMatches, 
  icdToNamasteMatches, 
  globalHistoryLog 
} from './data';
import { getPatients, commitLedger } from './api';

import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  History, 
  FileDown, 
  Terminal,
  Activity,
  AlertCircle,
  Clock,
  HeartPulse,
  Bed,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Copy,
  Download,
  Menu,
  X
} from 'lucide-react';

export default function Dashboard() {
  // Navigation & Responsiveness State
  const [patients, setPatients] = useState([]); 
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Drawer Controller
  const [selectedPatientId, setSelectedPatientId] = useState('PAT-2026-001');
  
  // Workstation Interactive Session States
  const [mappingMode, setMappingMode] = useState('NAMASTE_TO_ICD');
  const [mappingQuery, setMappingQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isValidationStamped, setIsValidationStamped] = useState(false);
  const [localLogs, setLocalLogs] = useState(globalHistoryLog);
  const [liveSuggestions, setLiveSuggestions] = useState([]); 
  
  // Real-Time Simulation State
  const [liveVitals, setLiveVitals] = useState({ activeEmergencies: 2, mappedToday: 42, systemLoad: "14%" });
  const [exportFormat, setExportFormat] = useState('FHIR');
  const [customApiNode, setCustomApiNode] = useState('iem-saltlake-core');
  const [customApiPath, setCustomApiPath] = useState('/api/v1/crosswalk-stream');
  const [generatedToken, setGeneratedToken] = useState('');

  const activePatient = (patients && patients.length >0)
  ? (patients.find(p => p.id === selectedPatientId) || patients[0])
  : {id: 'TEMP', name: 'Loading...', clinicalNotes: 'Fetching from database...'};


  // Simulating real-time telemetry fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVitals(prev => ({
        activeEmergencies: Math.max(1, prev.activeEmergencies + (Math.random() > 0.7 ? 1 : Math.random() > 0.7 ? -1 : 0)),
        mappedToday: prev.mappedToday + (Math.random() > 0.85 ? 1 : 0),
        systemLoad: `${Math.floor(12 + Math.random() * 8)}%`
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Adrija's Step 5: Load real patients from backend gateway
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data.data || data);
    } catch (err) {
      console.error("Failed to load backend patients:", err);
    }
  };
 // ➔ NEW: API Call Hook (Telemetry ke theek baad)
  useEffect(() => {
    const fetchLiveCodes = async () => {
      if (mappingQuery.trim().length > 2) {
        try {
  const data = await getICDBySymptom(mappingQuery);
  console.log("Backend se aaya raw data:", data); // Isse terminal/console me data dikhega
  
  // CRASH-PROOF LOGIC: Check karo ki data array hai ya nahi
  if (Array.isArray(data)) {
    setLiveSuggestions(data);
  } else if (data && Array.isArray(data.matches)) {
    setLiveSuggestions(data.matches);
  } else if (data && Array.isArray(data.data)) {
    setLiveSuggestions(data.data);
  } else {
    setLiveSuggestions([]); // Agar kuch samajh na aaye toh khali rakho, crash mat karo
  }
}
 catch (err) {
  console.error("Database query failed:", err);
  setLiveSuggestions([]);
}
 } else {
        setLiveSuggestions([]);
      }
    };
    fetchLiveCodes();
  }, [mappingQuery]);

  const activeSuggestions = liveSuggestions;

  const handleCommitMapping = async() => {
    if (!isValidationStamped) return alert("Attestation warning: Apply a clinical stamp before ledger commitment.");
    
    const logEntry = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operator: "Dr. A. Upadhyay",
      action: "Validated Mapping",
      details: `${mappingQuery} ➔ ${selectedMatch.icdCode || selectedMatch.term} (${activePatient.id})`,
      status: "SUCCESS"
    };
    try
    {
      await commitLedger({
        patient_id:activePatient.id,
        action:"Validated Mapping",
        details:logEntry.details,
        status:"SUCCESS"
      });
    setLocalLogs([logEntry, ...localLogs]);
    alert("System Lock: Committed to real database ledger.");
    setActiveTab('HISTORY');
  } catch (err) {
    console.error("Ledger commit failed:", err.message);
    alert("Ledger error:Could not secure logs on backend server.");
  }
};
// Nav items configuration array
  const navigationItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'MAPPING_CONSOLE', label: 'NAMASTE ↔ ICD-11 Mapper', icon: ArrowLeftRight },
    { id: 'MAPPING_WORKSPACE', label: 'Mapping Workspace', icon: Terminal},
    { id: 'PATIENT_TRIAGE', label: 'Patient Clinical Workspace', icon: Users },
    { id: 'HISTORY', label: 'Patient Ledger History', icon: History },
    { id: 'EXPORT', label: 'Data Export Engine', icon: FileDown },
    { id: 'CUSTOM_API', label: 'Create Custom API', icon: Terminal },
  ];

  return (
    <div className="flex h-screen w-screen bg-slate-950 font-sans text-slate-100 overflow-hidden relative">
      
      {/* BACKGROUND SIDEBAR OVERLAY FOR MOBILE CLOSURE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* RESPONSIVE LEFT SIDEBAR PANEL */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 z-50 transition-transform duration-200 ease-in-out
      `}>
        <div>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-teal-500 text-slate-950 rounded-lg flex items-center justify-center font-black text-lg">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-wide text-white uppercase">Med-Center</h1>
                <p className="text-[10px] text-teal-400 font-mono tracking-wider font-bold">WORKSTATION OS</p>
              </div>
            </div>
            {/* Close sidebar button for mobile viewports */}
            <button className="lg:hidden p-1 text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1">
            {navigationItems.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setIsValidationStamped(false); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${isSelected ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>LIVE EHR INTERFACE: ONLINE</span>
        </div>
      </aside>

      {/* CORE FRAME CONTENT LAYER */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-hidden">
        
        {/* GLOBAL RESPONSIVE TOP NAV BAR HEAD FOR MOBILE WORKFLOWS */}
        <header className="lg:hidden h-14 bg-slate-900 border-b border-slate-800 flex items-center px-4 shrink-0 justify-between">
          <button className="p-1.5 bg-slate-850 border border-slate-700 rounded-md text-slate-300" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-xs font-black tracking-wider text-teal-400 uppercase font-mono">
            {navigationItems.find(item => item.id === activeTab)?.label}
          </span>
          <div className="w-8"></div> {/* Visual spacer balance */}
        </header>

        {/* VIEW 1: REFACTORED WORKSTATION DASHBOARD */}
        {activeTab === 'DASHBOARD' && (
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-3">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <Activity className="h-5 w-5 text-teal-400 animate-pulse" /> Dashboard Overview
                </h2>
                <p className="text-xs text-slate-400">Real-time telemetry, traditional-to-global terminology maps, and ward metrics.</p>
              </div>
              <div className="bg-slate-850 border border-slate-800 rounded-lg p-2 text-left self-start sm:self-auto">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Gateway Load</span>
                <span className="text-xs font-mono font-bold text-teal-400">{liveVitals.systemLoad} stable</span>
              </div>
            </div>

            {/* RESPONSIVE CONTAINER CARDS MATRIX */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-red-500/20"><AlertCircle className="h-12 w-12" /></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Triage Cases</span>
                <p className="text-3xl font-black text-white mt-1">{patients.length}</p>
                <span className="text-[10px] text-red-400 font-medium mt-1 inline-flex items-center gap-1">
                  ● {liveVitals.activeEmergencies} Unmapped Critical
                </span>
              </div>

              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-teal-500/20"><ShieldCheck className="h-12 w-12" /></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Crosswalks Synced Today</span>
                <p className="text-3xl font-black text-teal-400 mt-1">{liveVitals.mappedToday}</p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 block">98.4% Interop Accuracy</span>
              </div>

              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-amber-500/20"><Clock className="h-12 w-12" /></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg. Validation Turnaround</span>
                <p className="text-3xl font-black text-amber-500 mt-1">1.8 <span className="text-xs font-normal text-slate-400">m</span></p>
                <span className="text-[10px] text-slate-400 font-medium mt-1 block">Automated AI matching assisted</span>
              </div>

              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute right-3 top-3 text-indigo-500/20"><Bed className="h-12 w-12" /></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ward Code Sync Status</span>
                <p className="text-3xl font-black text-indigo-400 mt-1">8 / 8</p>
                <span className="text-[10px] text-emerald-400 font-medium mt-1 block">All electronic systems green</span>
              </div>
            </div>

            {/* SPLIT LAYOUT BREAKDOWN FOR PATIENT FEEDS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-850 rounded-xl border border-slate-800 overflow-hidden">
                <div className="p-4 bg-slate-800 border-b border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Incoming Patient Clinical Triage Feed</span>
                  <span className="text-[10px] bg-indigo-950 border border-indigo-800 text-indigo-400 px-2 py-0.5 rounded font-mono font-bold w-fit">Auto-Polling Active</span>
                </div>
                <div className="p-2 divide-y divide-slate-800/60">
                  {patients.map(p => (
                    <div key={p.id} className="p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-800/40 rounded-lg transition-colors gap-3">
                      <div className="space-y-1 min-w-0 w-full">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                          <span className="text-[9px] font-mono bg-slate-900 border border-slate-700 text-slate-400 px-1.5 py-0.2 rounded shrink-0">{p.id}</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate italic">"{p.clinicalNotes}"</p>
                      </div>
                      <button 
                        onClick={() => { setSelectedPatientId(p.id); setActiveTab('MAPPING_CONSOLE'); }}
                        className="text-[11px] font-bold bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-300 px-2.5 py-1.5 rounded-md border border-slate-700 transition-all shrink-0 w-full sm:w-auto text-center"
                      >
                        Process Crosswalk
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* TARGET REGISTRIES RADIAL REPLACEMENT */}
              <div className="bg-slate-850 rounded-xl border border-slate-800 p-4 space-y-4">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">Global Crosswalk Targets</span>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">NAMASTE (AYUSH Gov)</span>
                      <span className="text-emerald-400 font-mono">100% Core</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-full"></div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-white">ICD-11 Chapter 26 (WHO)</span>
                      <span className="text-teal-400 font-mono">94.5% Synced</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-teal-500 h-full w-[94.5%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: MAPPING CONSOLE REFACTORED FOR FLEX OVERFLOWS */}
        {activeTab === 'MAPPING_CONSOLE' && (
          <div className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden">
            <div className="bg-slate-850 border-b border-slate-800 p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">Active Target Frame</span>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="text-base font-bold text-white">{activePatient.name}</h3>
                  <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-400">{activePatient.id}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 border-b border-slate-800">
              <div className="flex bg-slate-850 p-1 rounded-lg border border-slate-800 w-fit">
                <button 
                  onClick={() => { setMappingMode('NAMASTE_TO_ICD'); setMappingQuery(''); setSelectedMatch(null); setIsValidationStamped(false); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded ${mappingMode === 'NAMASTE_TO_ICD' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  NAMASTE ➔ ICD-11
                </button>
                <button 
                  onClick={() => { setMappingMode('ICD_TO_NAMASTE'); setMappingQuery(''); setSelectedMatch(null); setIsValidationStamped(false); }}
                  className={`px-3 py-1.5 text-xs font-bold rounded ${mappingMode === 'ICD_TO_NAMASTE' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  ICD-11 ➔ NAMASTE
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-y-auto lg:overflow-hidden">
              <div className="p-4 lg:p-5 flex flex-col bg-slate-900 overflow-y-auto shrink-0 lg:shrink">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">1. Input Diagnosis Term</h4>
                <input 
                  type="text"
                  value={mappingQuery}
                  onChange={(e) => { setMappingQuery(e.target.value); setSelectedMatch(null); setIsValidationStamped(false); }}
                  placeholder={mappingMode === 'NAMASTE_TO_ICD' ? "Enter phrase (e.g. Vataja Shirashoola)" : "Enter code (e.g. TM12.1)"}
                  className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-teal-500 transition-colors font-mono"
                />
                <div className="mt-4 space-y-1">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Index Shortcuts</span>
                  {mappingMode === 'NAMASTE_TO_ICD' ? (
                    ['Vataja Shirashoola', 'Sandhigata Vata'].map(term => (
                      <button key={term} onClick={() => { setMappingQuery(term); setSelectedMatch(null); setIsValidationStamped(false); }} className="w-full text-left font-mono text-xs text-teal-400 bg-slate-850 border border-slate-800 rounded px-2.5 py-1.5 hover:bg-slate-800 block">{term}</button>
                    ))
                  ) : (
                    ['TM12.1'].map(code => (
                      <button key={code} onClick={() => { setMappingQuery(code); setSelectedMatch(null); setIsValidationStamped(false); }} className="w-full text-left font-mono text-xs text-teal-400 bg-slate-850 border border-slate-800 rounded px-2.5 py-1.5 hover:bg-slate-800 block">{code}</button>
                    ))
                  )}
                </div>
              </div>

              <div className="p-4 lg:p-5 flex flex-col bg-slate-850/30 overflow-y-auto shrink-0 lg:shrink">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">2. Terminology Matching Ranks</h4>
                {activeSuggestions.length === 0 ? (
                  <div className="py-12 lg:my-auto text-center border border-dashed border-slate-800 p-6 text-slate-500 text-xs rounded-xl">
                    Select a shortcut term to populate code match computations.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeSuggestions.map((item, index) => (
                      <div 
                        key={index}
                        onClick={() => { setSelectedMatch(item); setIsValidationStamped(false); }}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedMatch === item ? 'bg-slate-850 border-teal-500' : 'bg-slate-900 border-slate-800'}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded">{item.icdCode || item.term}</span>
                          <span className="text-[10px] font-bold text-emerald-400">{(item.confidence * 100).toFixed(0)}% Match</span>
                        </div>
                        <p className="text-xs font-bold text-slate-200 mt-2">{item.title || `Target: ${item.term}`}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 lg:p-5 flex flex-col bg-slate-900 overflow-y-auto justify-between shrink-0 lg:shrink gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">3. Workspace Validation</h4>
                  {selectedMatch ? (
                    <div className="bg-slate-850 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div><span className="text-[9px] text-slate-500 uppercase block font-bold">Source</span><p className="text-xs font-mono text-white">{mappingQuery}</p></div>
                      <div><span className="text-[9px] text-slate-500 uppercase block font-bold">Target Structural Resolution</span><p className="text-xs font-bold text-teal-400">{selectedMatch.title || selectedMatch.term} ({selectedMatch.icdCode || 'Mapped'})</p></div>
                      <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${isValidationStamped ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' : 'bg-amber-950/40 border-amber-800 text-amber-400'}`}>
                        <span>{isValidationStamped ? "Clinical Authenticated Stamp Applied" : "Awaiting Clinician Stamp Verification"}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
                      Awaiting operational mappings to initialize signatures.
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800">
                  <button disabled={!selectedMatch} onClick={() => setIsValidationStamped(true)} className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 rounded-lg text-xs disabled:opacity-40">Validate Map</button>
                  <button disabled={!isValidationStamped} onClick={handleCommitMapping} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg text-xs disabled:opacity-40">Save &amp; Commit</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERSISTED COMPLIANT ROUTED TABS - FULLY CLEANED & RESPONSIVE */}
        {activeTab === 'PATIENT_TRIAGE' && (
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4">
            <h2 className="text-xl font-black text-white">Patient Clinical Workspace</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patients.map(patient => (
                <div key={patient.id} className={`p-4 bg-slate-850 rounded-xl border ${selectedPatientId === patient.id ? 'border-teal-500' : 'border-slate-800'}`}>
                  <h4 className="text-sm font-bold text-white">{patient.name} (ID: {patient.id})</h4>
                  <p className="text-xs text-slate-400 italic bg-slate-900 p-2 rounded mt-2">"{patient.clinicalNotes}"</p>
                  <button onClick={() => { setSelectedPatientId(patient.id); setActiveTab('MAPPING_CONSOLE'); }} className="mt-3 bg-teal-600 hover:bg-teal-700 text-white font-bold px-3 py-1.5 rounded text-xs w-full sm:w-auto text-center">Initialize Mapping Console</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'HISTORY' && (
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4">
            <h2 className="text-xl font-black text-white">Patient Ledger History</h2>
            <div className="space-y-2 max-w-4xl">
              {localLogs.map((log) => (
                <div key={log.id} className="p-4 bg-slate-850 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center font-mono text-xs gap-3">
                  <div>
                    <span className="text-white font-bold">[{log.action}]</span>
                    <p className="text-slate-300 font-sans mt-1">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 shrink-0 w-fit">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'EXPORT' && (
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
            <h2 className="text-xl font-black text-white">Interoperability Data Export Pipeline</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                {['FHIR ConceptMap Resource', 'JSON Payload Array', 'Plain Text Summary Card'].map((label, i) => {
                  const codes = ['FHIR', 'JSON', 'TXT'];
                  return (
                    <button key={codes[i]} onClick={() => setExportFormat(codes[i])} className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-bold ${exportFormat === codes[i] ? 'bg-teal-600 text-white border-teal-500' : 'bg-slate-850 border-slate-800 text-slate-400'}`}>{label}</button>
                  );
                })}
              </div>
              <div className="lg:col-span-2 flex flex-col bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 justify-between h-64 min-w-0">
                <div className="overflow-y-auto">
                  {exportFormat === 'FHIR' && <pre>{`{\n  "resourceType": "ConceptMap",\n  "id": "namaste-icd11-conceptmap",\n  "status": "active"\n}`}</pre>}
                  {exportFormat === 'JSON' && <pre>{`[\n  { "source_system": "NAMASTE", "target_system": "ICD-11-TM-26" }\n]`}</pre>}
                  {exportFormat === 'TXT' && <pre className="text-slate-300">{`PATIENT SUMMARY: ${activePatient.name}\nDIAGNOSTIC ALIGNMENT COMPLETE.`}</pre>}
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2 shrink-0">
                  <button onClick={() => alert("Copied to clipboard context.")} className="px-3 py-1 bg-slate-800 text-xs rounded font-bold text-slate-300 flex items-center gap-1"><Copy className="h-3 w-3" /> Copy</button>
                  <button onClick={() => alert("Downloading stream package file...")} className="px-3 py-1 bg-teal-600 text-xs text-white rounded font-bold flex items-center gap-1"><Download className="h-3 w-3" /> Download</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'CUSTOM_API' && (
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
            <h2 className="text-xl font-black text-white">API Provision Factory Gateway</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-slate-850 p-4 lg:p-5 rounded-xl border border-slate-800 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Service Node Name</label>
                  <input type="text" value={customApiNode} onChange={(e) => setCustomApiNode(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Route Access Path</label>
                  <input type="text" value={customApiPath} onChange={(e) => setCustomApiPath(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-xs text-white font-mono" />
                </div>
                <button onClick={() => setGeneratedToken(`sk_live_${Math.random().toString(36).substring(7)}`)} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded text-xs">Deploy Endpoint</button>
              </div>
              <div className="lg:col-span-2 space-y-4 font-mono text-xs text-slate-400 min-w-0">
                {generatedToken && <div className="p-4 bg-slate-850 border border-teal-800 rounded-xl text-white break-all">Bearer Token: <code>{generatedToken}</code></div>}
                <div className="bg-slate-850 rounded-xl border border-slate-800 p-4 overflow-x-auto">
                  <span className="text-white block font-sans font-bold mb-2">Active Managed Endpoints</span>
                  <div className="flex justify-between gap-4"><span>{customApiNode} ({customApiPath})</span><span className="text-emerald-400 shrink-0">● Active</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}