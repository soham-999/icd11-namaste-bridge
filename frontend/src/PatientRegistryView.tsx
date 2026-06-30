import React, { useState } from 'react';
import { INTEGRATION_API } from './api';

interface RegistryProps {
  setView: (view: string) => void;
}

export default function PatientRegistry({ setView }: RegistryProps) {
  const [formData, setFormData] = useState({
    name: '', age: '', sex: 'Male', diseaseCaused: '', icdCode: '', namasteCode: '',
    medications: '', tests: '', bp: '120/80', pulse: '76', spo2: '98', temp: '98.6', weight: '70',
    department: 'Ayurveda'
  });

  const handleDiseaseChange = (val: string) => {
    const match = INTEGRATION_API.autoMapDisease(val);
    if (match) {
      setFormData(prev => ({
        ...prev,
        diseaseCaused: val,
        icdCode: match.icd,
        namasteCode: match.namaste,
        medications: match.meds,
        department: match.dept as any
      }));
    } else {
      setFormData(prev => ({ ...prev, diseaseCaused: val }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.diseaseCaused) return alert("Fill essential details.");

    await INTEGRATION_API.commitPatient({
      name: formData.name, age: Number(formData.age), sex: formData.sex,
      diseaseCaused: formData.diseaseCaused, icdCode: formData.icdCode, namasteCode: formData.namasteCode,
      medicationsRequired: formData.medications.split(',').map(m => m.trim()),
      testsDone: formData.tests.split(',').map(t => t.trim()),
      status: "Out Patient", department: formData.department as any,
      bp: formData.bp, pulse: formData.pulse, spo2: formData.spo2, temp: formData.temp, weight: formData.weight
    });

    alert("Real-time EMR Data Synchronized!");
    setView('dashboard');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f8fafc] min-h-screen space-y-6">
      <h2 className="text-lg sm:text-xl font-bold text-[#0f172a] border-b pb-2">Clinical Intake Registry Form</h2>
      
      <form onSubmit={handleSave} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm max-w-4xl space-y-6 mx-auto">
        
        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Patient Full Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs sm:text-sm" placeholder="John Doe" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Age</label>
            <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs sm:text-sm" placeholder="30" />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Gender</label>
            <select value={formData.sex} onChange={e => setFormData({...formData, sex: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs sm:text-sm bg-white">
              <option>Male</option><option>Female</option>
            </select>
          </div>
        </div>

        {/* Row 2 - Auto Match Engine Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-emerald-50/20 p-3 rounded-xl border border-emerald-100">
          <div>
            <label className="text-xs font-bold text-emerald-700 block mb-1">Disease Caused (Auto-maps)</label>
            <input type="text" value={formData.diseaseCaused} onChange={e => handleDiseaseChange(e.target.value)} className="w-full p-2.5 border-2 border-emerald-400 rounded-xl text-xs sm:text-sm font-semibold bg-white text-emerald-800" placeholder="Type 'Amavata'..." />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">ICD-11 Code Mapping</label>
            <input type="text" value={formData.icdCode} readOnly className="w-full p-2.5 border bg-slate-50 rounded-xl text-xs sm:text-sm font-mono text-rose-600 font-bold" placeholder="Auto-generated..." />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">NAMASTE Framework Code</label>
            <input type="text" value={formData.namasteCode} readOnly className="w-full p-2.5 border bg-slate-50 rounded-xl text-xs sm:text-sm font-mono text-sky-600 font-bold" placeholder="Auto-generated..." />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Traditional Medications Prescribed</label>
            <input type="text" value={formData.medications} onChange={e => setFormData({...formData, medications: e.target.value})} className="w-full p-2.5 border rounded-xl text-xs sm:text-sm" placeholder="Sudarshan Vati, etc." />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">AYUSH Department Assigned</label>
            <input type="text" value={formData.department} readOnly className="w-full p-2.5 border bg-slate-50 rounded-xl text-xs sm:text-sm font-bold text-slate-700" />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#0b1f3a] text-white p-3 rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-800 transition-colors">
          Commit to National Interoperability System
        </button>
      </form>
    </div>
  );
}