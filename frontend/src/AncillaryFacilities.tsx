import React, { useState, useEffect } from 'react';
import { INTEGRATION_API, PatientRecord } from './api';

// 🎯 DoctorProfile interface ko local define karke error fix kar diya
interface DoctorProfile {
  name: string;
  dept: string;
  status: string;
}

interface AncillaryProps {
  setView?: (view: string) => void;
}

export default function AncillaryFacilities({ setView }: AncillaryProps) {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [ayushStaff, setAyushStaff] = useState<DoctorProfile[]>([]);

  useEffect(() => {
    // Real-time patient data fetch logic
    INTEGRATION_API.fetchPatients().then((data) => {
      if (data) setPatients(data);
    });

    // Mocking matching AYUSH diagnostic profile registry
    setAyushStaff([
      { name: "Vaidya Harishankar Sharma", dept: "Ayurveda", status: "Available" },
      { name: "Hakim Aslam Khan", dept: "Unani", status: "Unavailable" },
      { name: "Dr. Rajeswari Pillai", dept: "Siddha", status: "Available" },
      { name: "Dr. S. K. Mukherjee", dept: "Homeopathy", status: "Available" }
    ]);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f8fafc] min-h-screen space-y-6 text-slate-800">
      
      {/* Header Section */}
      <div className="border-b pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Ancillary Management</span>
          <h2 className="text-lg sm:text-2xl font-black text-[#0f172a] mt-0.5">Specialist Roster & Facilities</h2>
        </div>
        {setView && (
          <button 
            onClick={() => setView('dashboard')}
            className="text-xs font-bold bg-white border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* Grid Layout: Splitting Roster and Patient count handles viewports cleanly */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AYUSH Specialists Roster Panel */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="font-bold text-sm text-[#0f172a] flex items-center gap-2">
            <span>🩺</span> Registered AYUSH Medical Staff
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ayushStaff.map((doc, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center transition-all hover:shadow-sm">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">{doc.name}</h4>
                  <p className="text-[11px] text-sky-600 font-semibold mt-0.5">{doc.dept} Department</p>
                </div>
                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${
                  doc.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Active Queues Quick Stats */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-[#0f172a] flex items-center gap-2">
            <span>📊</span> Facility Node Metrics
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-xl">
              <p className="text-slate-500 font-medium">Active EMR Queues</p>
              <p className="text-xl font-black text-slate-900 mt-1">{patients.length} Patients Waiting</p>
            </div>
            <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
              <p className="text-slate-500 font-medium">On-Duty Doctors</p>
              <p className="text-xl font-black text-slate-900 mt-1">
                {ayushStaff.filter(d => d.status === 'Available').length} / {ayushStaff.length} Online
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}