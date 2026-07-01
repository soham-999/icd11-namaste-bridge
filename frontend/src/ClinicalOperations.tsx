import React, { useState, useEffect } from 'react';

// Live Backend integration ke liye types pehle se ready rakhte hain
interface LabTest {
  tokenKey: string;
  patientName: string;
  testDescription: string;
}

interface PharmacyItem {
  drugId: string;
  nomenclatureName: string;
  price: string;
}

export default function ClinicalOperations() {
  const [activeTab, setActiveTab] = useState<'pathology' | 'pharmacy'>('pathology');
  
  // Abhi ke liye dummy data state mein hai, future integration ke liye useEffect empty rakha hai
  const [labTests, setLabTests] = useState<LabTest[]>([
    { tokenKey: '#TE0025', patientName: 'James Carter', testDescription: 'Complete Anti-CCP Screen Matrix' },
    { tokenKey: '#TE0024', patientName: 'Emily Davis', testDescription: 'Synovial Joint Fluid Examination' }
  ]);

  const [pharmacyItems, setPharmacyItems] = useState<PharmacyItem[]>([
    { drugId: '#PR0025', nomenclatureName: 'Sinnadh Guggulu Compound', price: '$300' },
    { drugId: '#PR0024', nomenclatureName: 'Habb-e-Suranjan Capsule Matrix', price: '$200' }
  ]);

  // 🌐 FUTURE BACKEND INTEGRATION PLACEHOLDER:
  useEffect(() => {
    // Jab backend ready ho jaye, tab aap yahan fetch calls add kar sakte hain:
    // fetch('/api/clinical-ops').then(res => res.json()).then(data => {
    //    setLabTests(data.tests);
    //    setPharmacyItems(data.drugs);
    // })
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-[#f8fafc] min-h-screen space-y-6">
      {/* Dynamic Tab Switchers */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        <button 
          onClick={() => setActiveTab('pathology')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'pathology' 
              ? 'bg-[#0b1f3a] text-white shadow-md' 
              : 'bg-white text-slate-600 border hover:bg-slate-50'
          }`}
        >
          🔬 Pathology Labs Desk
        </button>
        <button 
          onClick={() => setActiveTab('pharmacy')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'pharmacy' 
              ? 'bg-[#0b1f3a] text-white shadow-md' 
              : 'bg-white text-slate-600 border hover:bg-slate-50'
          }`}
        >
          💊 Formulary Pharmacy Inventory
        </button>
      </div>

      {/* Grid Content Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'pathology' ? (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-4">Token Key</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Test Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {labTests.map((test, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-700">{test.tokenKey}</td>
                    <td className="p-4 font-semibold text-slate-900">{test.patientName}</td>
                    <td className="p-4 text-slate-600">{test.testDescription}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <th className="p-4">Drug ID</th>
                  <th className="p-4">Nomenclature Name</th>
                  <th className="p-4">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pharmacyItems.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-700">{item.drugId}</td>
                    <td className="p-4 font-semibold text-slate-900">{item.nomenclatureName}</td>
                    <td className="p-4 text-emerald-600 font-bold">{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}