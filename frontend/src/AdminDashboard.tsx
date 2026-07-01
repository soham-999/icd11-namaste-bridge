import React, { useState, useEffect } from 'react';
import { INTEGRATION_API, PatientRecord } from './api';

interface DashboardProps {
  setView: (view: string) => void;
  setSelectedPatient: (patient: PatientRecord) => void; // Fixed naming explicitly here
}

export default function AdminDashboard({ setView, setSelectedPatient }: DashboardProps) {
  const [patients, setPatients] = useState<PatientRecord[]>([]);

  useEffect(() => {
    INTEGRATION_API.fetchPatients().then(setPatients);
  }, []);

  const ayushDoctors = [
    { name: "Vaidya Harishankar Sharma", dept: "Ayurveda", status: "Available" },
    { name: "Hakim Aslam Khan", dept: "Unani", status: "Unavailable" },
    { name: "Dr. Rajeswari Pillai", dept: "Siddha", status: "Available" },
    { name: "Dr. S. K. Mukherjee", dept: "Homeopathy", status: "Available" }
  ];

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen space-y-6 text-slate-800">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase">All Patients</p><h3 className="text-2xl font-black text-slate-800 mt-1">{patients.length + 108}</h3></div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+20%</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase">Appointments</p><h3 className="text-2xl font-black text-slate-800 mt-1">658</h3></div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">-15%</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase">AYUSH Experts</p><h3 className="text-2xl font-black text-slate-800 mt-1">565</h3></div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+18%</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div><p className="text-xs font-bold text-slate-400 uppercase">Transactions</p><h3 className="text-2xl font-black text-[#0f172a] mt-1">$56,523.56</h3></div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#0f172a]">Appointment Request Queue</h3>
            <span className="text-xs text-sky-600 font-bold cursor-pointer">All Appointments</span>
          </div>
          <div className="space-y-3">
            {patients.map((p, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-xs text-slate-800">{p.name}</h4>
                  <p className="text-[10px] text-slate-400">Sync Date: {p.lastVisit}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-1 rounded">{p.department}</span>
                  <button 
                    onClick={() => { setSelectedPatient(p); setView('details'); }} 
                    className="text-[10px] font-bold bg-[#0284c7] text-white px-2 py-1 rounded hover:bg-sky-700">
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-[#0f172a]">AYUSH Roster Status</h3>
            <span className="text-xs text-slate-400 cursor-pointer">View All</span>
          </div>
          <div className="space-y-3">
            {ayushDoctors.map((doc, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 hover:bg-slate-50 rounded-xl transition-all">
                <div>
                  <h5 className="font-bold text-xs text-slate-800">{doc.name}</h5>
                  <p className="text-[10px] text-emerald-600 font-medium">{doc.dept}</p>
                </div>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${doc.status === 'Available' ? 'bg-emerald-50 text-emerald-600':'bg-rose-50 text-rose-600'}`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <h3 className="font-bold text-sm text-[#0f172a]">Unified Patient Integration Ledger</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-bold border-b text-[10px]">
              <th className="p-3">Patient Name</th>
              <th className="p-3">Condition/Diagnosis</th>
              <th className="p-3">AYUSH Department</th>
              <th className="p-3">ICD-11 Sync Code</th>
              <th className="p-3">NAMASTE Framework Index</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {patients.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/80">
                <td className="p-3 font-bold text-slate-800">{p.name}</td>
                <td className="p-3 text-slate-600">{p.diseaseCaused}</td>
                <td className="p-3"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold">{p.department}</span></td>
                <td className="p-3 font-mono text-rose-600 font-bold">{p.icdCode}</td>
                <td className="p-3 font-mono text-sky-600 font-bold">{p.namasteCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}