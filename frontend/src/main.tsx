import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
/// @ts-ignore
import './index.css';

import { INTEGRATION_API, PatientRecord } from './api';
import AdminDashboard from './AdminDashboard';
import PatientRegistry from './PatientRegistryView';
import MappingConsole from './MappingConsoleView';
import ClinicalOperations from './ClinicalOperations';
import AncillaryFacilities from './AncillaryFacilities';
import PatientReports from './PatientReportsView';

function RootAppShell() {
  const [view, setView] = useState<string>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Search Engine Pipeline Hooks
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [allPatients, setAllPatients] = useState<PatientRecord[]>([]);
  const [filteredResults, setFilteredResults] = useState<PatientRecord[]>([]);

  // Real-time synchronization layer trigger
  useEffect(() => {
    INTEGRATION_API.fetchPatients().then(setAllPatients);
  }, [view]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResults([]);
    } else {
      const matched = allPatients.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResults(matched);
    }
  }, [searchQuery, allPatients]);

  const handlePatientSelect = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setView('details');
    setSearchQuery('');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'registry', label: 'Patient Registry', icon: '👥' },
    { id: 'console', label: 'Translation Console', icon: '🔄' },
    { id: 'ops', label: 'Clinical Operations', icon: '🩺' },
    { id: 'ancillary', label: 'Specialist Roster', icon: '🧬' }
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] text-slate-800">
      
      {/* 📱 Mobile Sticky Header */}
      <div className="lg:hidden w-full bg-[#0b1f3a] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2" onClick={() => setView('dashboard')}>
          <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-xs">D</div>
          <span className="font-bold text-xs tracking-wide">Dreams AYUSH</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-xl">
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 🌌 Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] bg-[#0b1f3a]/95 text-white z-40 p-4 space-y-4">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${view === item.id ? 'bg-sky-600' : 'hover:bg-slate-800'}`}
              >
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* 💻 Desktop Fixed Left Menu Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#0b1f3a] text-white flex-col justify-between p-4 shadow-xl sticky top-0 h-screen">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-700 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold">D</div>
            <span className="font-bold text-sm tracking-wide">Dreams EMR Suite</span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  view === item.id || (item.id === 'dashboard' && view === 'details') ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800/50'
                }`}
              >
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-2 text-[10px] text-slate-500 text-center border-t border-slate-800">AYUSH Interop v1.0.0</div>
      </div>

      {/* 🚀 Main Workspace Area (Omnibox Integration + Content Board) */}
      <div className="flex-1 min-w-0 w-full flex flex-col">
        
        {/* 🔍 Global Interactive Clinical Search Bar Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 lg:top-0 z-30 flex items-center justify-between gap-4 shadow-sm">
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">🕵️‍♂️</div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search active patient history logs by name or PT-ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-sky-500 transition-all outline-none"
            />
            
            {/* 🎯 Real-time Suggestion Dropdown overlay */}
            {filteredResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 divide-y max-h-60 overflow-y-auto">
                {filteredResults.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => handlePatientSelect(p)}
                    className="p-3 hover:bg-sky-50/50 cursor-pointer flex justify-between items-center transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{p.name}</h4>
                      <p className="text-[10px] text-slate-400">{p.id} • {p.diseaseCaused}</p>
                    </div>
                    <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md">{p.department}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-slate-500 hidden sm:inline">National Health Node Connected</span>
          </div>
        </div>

        {/* Dynamic Route Board Rendering Engine */}
        <div className="flex-1 overflow-x-hidden">
          {view === 'dashboard' && <AdminDashboard setView={setView} setSelectedPatient={setSelectedPatient} />}
          {view === 'registry' && <PatientRegistry setView={setView} />}
          {view === 'console' && <MappingConsole />}
          {view === 'ops' && <ClinicalOperations />}
          {view === 'ancillary' && <AncillaryFacilities />}
          {view === 'details' && selectedPatient && <PatientReports setView={setView} selectedPatient={selectedPatient} />}
        </div>

      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootAppShell />
  </React.StrictMode>
);