import React, { useState } from 'react';
import { PatientRecord } from './api';

interface ReportsProps {
  setView: (view: string) => void;
  selectedPatient: PatientRecord | null;
}

export default function PatientReports({ setView, selectedPatient }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<string>('profile');

  if (!selectedPatient) {
    return (
      <div className="p-8 text-center text-slate-400 font-medium">
        ⚠️ No clinical records compiled. Please select an active file stream from the central console.
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Patient Profile' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'vitals', label: 'Vital Signs' },
    { id: 'prescriptions', label: 'Prescription Records' }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f8fafc] min-h-screen space-y-6 text-slate-800">
      
      {/* Dynamic Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Electronic Medical Record</span>
          <h2 className="text-lg sm:text-2xl font-black text-[#0f172a] mt-0.5">Clinical File Dashboard</h2>
        </div>
        <button 
          onClick={() => setView('dashboard')}
          className="text-xs font-bold border border-slate-300 hover:bg-slate-100 bg-white px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          ← Back to Registry Board
        </button>
      </div>

      {/* 🎚️ Navigation sub tabs segment layout matches your reference window */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 scrollbar-none pb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 font-bold text-xs whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id ? 'border-sky-600 text-sky-600 bg-sky-50/50 rounded-t-xl':'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Structural Twin Columns split on large viewports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Demographic Master Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white text-xl font-black shadow-md shadow-sky-100">
              {selectedPatient.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-bold font-mono text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">{selectedPatient.id}</span>
              <h3 className="font-black text-slate-900 text-base mt-1">{selectedPatient.name}</h3>
              <p className="text-[11px] text-slate-400 font-medium">Last Sync: {selectedPatient.lastVisit}</p>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">Base Demographics</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100"><p className="text-slate-400 font-medium text-[10px]">Age Profile</p><p className="font-bold mt-0.5">{selectedPatient.age} Years</p></div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100"><p className="text-slate-400 font-medium text-[10px]">Gender Identification</p><p className="font-bold mt-0.5">{selectedPatient.sex}</p></div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100"><p className="text-slate-400 font-medium text-[10px]">Current Status</p><p className="font-bold mt-0.5 text-emerald-600">{selectedPatient.status}</p></div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100"><p className="text-slate-400 font-medium text-[10px]">AYUSH Stream</p><p className="font-bold mt-0.5 text-sky-600">{selectedPatient.department}</p></div>
            </div>
          </div>
        </div>

        {/* Right Side: Tab Dynamic Display Engine Panel */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[300px]">
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Primary Diagnosis</h4>
                <div className="p-4 bg-slate-50 border rounded-xl">
                  <h5 className="font-black text-sm text-slate-800">{selectedPatient.diseaseCaused}</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-200/60 text-xs">
                    <div><span className="font-semibold text-slate-400 block mb-0.5">ICD-11 Unified Code</span><code className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">{selectedPatient.icdCode}</code></div>
                    <div><span className="font-semibold text-slate-400 block mb-0.5">NAMASTE Core Index</span><code className="font-mono font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded">{selectedPatient.namasteCode}</code></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Prescribed Laboratory Screenings</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.testsDone.map((t, idx) => (
                    <span key={idx} className="bg-slate-100 border text-slate-700 font-semibold px-3 py-1 rounded-xl text-xs">🧪 {t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Scheduled Slots History</h4>
              <div className="border border-slate-100 rounded-xl divide-y text-xs">
                <div className="p-3 bg-emerald-50/30 flex justify-between items-center">
                  <div><p className="font-bold text-slate-800">Initial Clinical Integration Consultation</p><p className="text-[10px] text-slate-400">{selectedPatient.lastVisit} • 10:30 AM</p></div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">Completed</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Clinical Vitals Graph Log</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 border rounded-xl bg-slate-50/50"><p className="text-slate-400 font-medium">Blood Pressure</p><p className="font-black text-slate-800 text-sm mt-0.5">❤️ {selectedPatient.bp} mmHg</p></div>
                <div className="p-3 border rounded-xl bg-slate-50/50"><p className="text-slate-400 font-medium">Pulse Frequency</p><p className="font-black text-slate-800 text-sm mt-0.5">💓 {selectedPatient.pulse} bpm</p></div>
                <div className="p-3 border rounded-xl bg-slate-50/50"><p className="text-slate-400 font-medium">Blood SpO2 Node</p><p className="font-black text-slate-800 text-sm mt-0.5">🩺 {selectedPatient.spo2} %</p></div>
                <div className="p-3 border rounded-xl bg-slate-50/50"><p className="text-slate-400 font-medium">Thermal Metric</p><p className="font-black text-slate-800 text-sm mt-0.5">🌡️ {selectedPatient.temp} °F</p></div>
                <div className="p-3 border rounded-xl bg-slate-50/50"><p className="text-slate-400 font-medium">Body Weight</p><p className="font-black text-slate-800 text-sm mt-0.5">⚖️ {selectedPatient.weight}</p></div>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Active Medical Formulation Streams</h4>
              <div className="space-y-2">
                {selectedPatient.medicationsRequired.map((med, index) => (
                  <div key={index} className="p-3 bg-sky-50/30 border border-sky-100 rounded-xl flex items-center gap-3 text-xs">
                    <span className="text-base">🌿</span>
                    <div>
                      <p className="font-bold text-slate-800">{med}</p>
                      <p className="text-[10px] text-slate-400">Dosage Strategy: Standard AYUSH Operational Routine Protocol</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}