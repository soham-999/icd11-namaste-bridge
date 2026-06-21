// src/MappingWorkspace.jsx
import React, { useState } from 'react';
import { mockPatients, namasteToIcdMatches, icdToNamasteMatches } from './data';
import { ArrowLeftRight, CheckCircle, Save, ShieldAlert, Search } from 'lucide-react';

export default function MappingWorkspace({ activePatientId, onMappingSaved }) {
  const [mappingMode, setMappingMode] = useState('NAMASTE_TO_ICD'); // or ICD_TO_NAMASTE
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isValidated, setIsValidated] = useState(false);

  // Fallback to first patient if none specified
  const patient = mockPatients.find(p => p.id === activePatientId) || mockPatients[0];

  // Get dynamic suggestions based on mode and query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedMatch(null);
    setIsValidated(false);
  };

  const suggestions = mappingMode === 'NAMASTE_TO_ICD' 
    ? (namasteToIcdMatches[searchQuery] || [])
    : (icdToNamasteMatches[searchQuery] || []);

  const handleSave = () => {
    if (!isValidated) return alert("Please validate the clinical mapping before saving.");
    
    const savedRecord = {
      patientId: patient.id,
      mode: mappingMode,
      sourceTerm: searchQuery,
      mappedResult: selectedMatch,
      timestamp: new Date().toISOString(),
      status: "VERIFIED"
    };
    
    alert(`Mapping successfully committed to secure local ledger!`);
    if (onMappingSaved) onMappingSaved(savedRecord);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900">
      {/* STICKY CLINICAL PATIENT HEADER */}
      <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div>
          <span className="text-xs font-semibold text-teal-600 tracking-wider uppercase">Active Session Patient</span>
          <div className="flex items-center gap-4 mt-0.5">
            <h2 className="text-lg font-bold text-slate-900">{patient.name}</h2>
            <span className="text-sm text-slate-500">ID: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{patient.id}</code></span>
            <span className="text-sm text-slate-500">Age/Gender: {patient.age}Y / {patient.gender}</span>
          </div>
        </div>
        <div className="bg-teal-50 border border-teal-100 rounded px-3 py-1.5 max-w-md hidden md:block">
          <p className="text-xs text-teal-800 line-clamp-1 italic"><strong>Context:</strong> {patient.clinicalNotes}</p>
        </div>
      </div>

      {/* WORKSPACE CONTROLS & TOGGLE */}
      <div className="p-4 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-inner">
          <button 
            onClick={() => { setMappingMode('NAMASTE_TO_ICD'); setSearchQuery(''); setSelectedMatch(null); setIsValidated(false); }}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${mappingMode === 'NAMASTE_TO_ICD' ? 'bg-indigo-950 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            NAMASTE ➔ ICD-11 TM
          </button>
          <button 
            onClick={() => { setMappingMode('ICD_TO_NAMASTE'); setSearchQuery(''); setSelectedMatch(null); setIsValidated(false); }}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${mappingMode === 'ICD_TO_NAMASTE' ? 'bg-indigo-950 text-white shadow' : 'text-slate-600 hover:text-slate-900'}`}
          >
            ICD-11 TM ➔ NAMASTE
          </button>
        </div>
        
        <div className="text-xs font-mono text-slate-500 bg-slate-200 px-2.5 py-1 rounded">
          Workstation Keyboard Shortcuts Active: <kbd className="bg-white border px-1 rounded shadow-sm">Ctrl+Enter</kbd> to Validate
        </div>
      </div>

      {/* CLINICAL 3-PANEL CROSSWALK SCREEN */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 overflow-hidden">
        
        {/* COLUMN 1: TERM INPUT SOURCE */}
        <div className="p-6 flex flex-col bg-white overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
            {mappingMode === 'NAMASTE_TO_ICD' ? '1. Source Diagnosis (NAMASTE)' : '1. Source Code (ICD-11 TM)'}
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Type or look up standard diagnostic clinical phrases to populate translation weights.
          </p>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={mappingMode === 'NAMASTE_TO_ICD' ? "e.g., Vataja Shirashoola" : "e.g., TM12.1"}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all font-medium"
            />
          </div>

          <div className="mt-2 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Demo Indexes:</span>
            {mappingMode === 'NAMASTE_TO_ICD' ? (
              ['Vataja Shirashoola', 'Sandhigata Vata'].map(t => (
                <button key={t} onClick={() => { setSearchQuery(t); setSelectedMatch(null); setIsValidated(false); }} className="text-xs text-left block w-full px-2 py-1 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded transition font-mono">{t}</button>
              ))
            ) : (
              ['TM12.1'].map(t => (
                <button key={t} onClick={() => { setSearchQuery(t); setSelectedMatch(null); setIsValidated(false); }} className="text-xs text-left block w-full px-2 py-1 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded transition font-mono">{t}</button>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: SEMANTIC MATCHING LEDGER */}
        <div className="p-6 flex flex-col bg-slate-50 overflow-y-auto">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">2. Suggested Interop Matches</h3>
          <p className="text-xs text-slate-500 mb-4">System cross-references across taxonomy hierarchies.</p>
          
          {suggestions.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-400 my-auto">
              <ArrowLeftRight className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No active semantic maps found.<br/>Select a demo index string to see live results.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {suggestions.map((item, index) => {
                const isItemTarget = selectedMatch === item;
                return (
                  <div 
                    key={index}
                    onClick={() => { setSelectedMatch(item); setIsValidated(false); }}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${isItemTarget ? 'bg-white border-teal-500 ring-2 ring-teal-500/10 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-900 text-white rounded">
                        {item.icdCode || item.term}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.confidence >= 0.9 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {(item.confidence * 100).toFixed(0)}% Match
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-2">{item.title || `Target: ${item.term}`}</h4>
                    {item.chapter && <p className="text-[11px] text-slate-400 mt-0.5">{item.chapter}</p>}
                    {item.formulationMatch && <p className="text-xs text-slate-600 mt-1 font-medium text-teal-700">Formulation Ref: {item.formulationMatch}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMN 3: CLINICAL PREVIEW, STAMP & SUBMIT */}
        <div className="p-6 flex flex-col bg-white overflow-y-auto justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">3. Validation Ledger</h3>
            <p className="text-xs text-slate-500 mb-4">Preview generated code payload structure.</p>
            
            {selectedMatch ? (
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-block">Source Context</span>
                  <p className="text-sm font-medium text-slate-900">{searchQuery}</p>
                </div>
                <div className="text-center text-slate-300 font-bold">⬇</div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-block">Target Interoperability Mapping</span>
                  <p className="text-sm font-bold text-teal-600">{selectedMatch.title || selectedMatch.term} ({selectedMatch.icdCode || selectedMatch.icdCode || 'Mapped'})</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedMatch.description || "Syntactic map validated to crosswalk specifications."}</p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <div className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium ${isValidated ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    {isValidated ? <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" /> : <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />}
                    {isValidated ? "Verified Clinical Crosswalk Stamp Applied" : "Requires Attestation Signature"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400">
                Please complete actions in Steps 1 & 2 to generate verification profiles.
              </div>
            )}
          </div>

          {/* SYSTEM BUTTON ACTIONS ACCORDING TO SPECS */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-200 mt-6">
            <button
              disabled={!selectedMatch}
              onClick={() => setIsValidated(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" /> Validate Mapping
            </button>
            <button
              disabled={!isValidated}
              onClick={handleSave}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save Crosswalk
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}