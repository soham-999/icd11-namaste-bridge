import React, { useState } from 'react';
import { kpiData, trafficData, chapterData, topDiagnoses } from './data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, Search, FileBarChart, Layers, Settings, Bell, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Local WHO ICD-11 Filter Dataset 
  const icd11Database = [
    { code: "2F30.0", title: "Type 2 diabetes mellitus", chapter: "05 Endocrine, nutritional or metabolic diseases", status: "Approved" },
    { code: "2F30.1", title: "Type 2 diabetes mellitus with established complication", chapter: "05 Endocrine diseases", status: "Approved" },
    { code: "BA00.0", title: "Essential hypertension", chapter: "11 Diseases of the circulatory system", status: "Approved" },
    { code: "CA40.0", title: "Acute bronchitis", chapter: "12 Diseases of the respiratory system", status: "Pending Review" },
    { code: "1B10.y", title: "Tuberculosis of lung", chapter: "01 Certain infectious or parasitic diseases", status: "Approved" }
  ];

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview" },
    { icon: <Search size={20} />, label: "ICD-11 Finder" },
    { icon: <Layers size={20} />, label: "Batch Mapping" },
    { icon: <FileBarChart size={20} />, label: "Reports" },
  ];

  const handleIcdSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }
    const filtered = icd11Database.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    setHasSearched(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Overview":
        return (
          <>
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {kpiData?.map((kpi, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <span className="text-sm font-medium text-slate-500">{kpi.title}</span>
                  <div className="flex items-baseline justify-between mt-4">
                    <span className="text-3xl font-bold text-slate-900">{kpi.value}</span>
                    <span className={`text-xs font-semibold flex items-center ${kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {kpi.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {kpi.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Daily Mapping Volume</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip cursor={{fill: '#f8fafc'}}/>
                      <Bar dataKey="cases" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Diseases by ICD Chapter</h3>
                <div className="h-48 flex justify-center items-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chapterData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {chapterData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-medium text-slate-600">
                  {chapterData?.map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{backgroundColor: entry.color}}></span>
                      <span className="truncate">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Top ICD-11 Mapped Diagnoses</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3">ICD Code</th>
                        <th className="pb-3">Diagnosis Description</th>
                        <th className="pb-3 text-right">Cases</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-50">
                      {topDiagnoses?.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-mono text-blue-600">{row.code}</td>
                          <td className="py-3 text-slate-900">{row.diagnosis}</td>
                          <td className="py-3 text-right">{row.cases}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">System Alerts</h3>
                <div className="space-y-4">
                  <div className="flex gap-3 bg-red-50 p-4 rounded-xl border border-red-100">
                    <AlertTriangle className="text-red-500 shrink-0" size={20}/>
                    <div>
                      <p className="text-sm font-semibold text-red-900">Unmapped Term Alert</p>
                      <p className="text-xs text-red-700 mt-0.5">32 rare clinical terms failed auto-mapping.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case "ICD-11 Finder":
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[450px]">
            <h3 className="text-xl font-bold text-slate-900 mb-2">ICD-11 Electronic Finder</h3>
            <p className="text-slate-500 text-sm mb-6">Search WHO central repository to find specific entities and diagnostic codes.</p>
            
            <div className="flex gap-4 max-w-2xl mb-8">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleIcdSearch()}
                placeholder="Enter clinical term (e.g. Diabetes, Hypertension)..." 
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm bg-slate-50"
              />
              <button 
                onClick={handleIcdSearch}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Search size={18}/> Search Code
              </button>
            </div>

            {hasSearched ? (
              searchResults.length > 0 ? (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Search Results ({searchResults.length})</h4>
                  {searchResults.map((result, index) => (
                    <div key={index} className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between hover:border-blue-200 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded text-xs">{result.code}</span>
                          <span className="font-semibold text-slate-900 text-sm">{result.title}</span>
                        </div>
                        <p className="text-xs text-slate-400">{result.chapter}</p>
                      </div>
                      <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={12}/> {result.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-red-200 bg-red-50/30 rounded-xl p-8 text-center text-red-500 text-sm">
                  No standard WHO mapping codes found for "{searchQuery}". Try "Diabetes".
                </div>
              )
            ) : (
              <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                Results will be fetched directly from WHO ICD-11 API endpoints.
              </div>
            )}
          </div>
        );
      case "Batch Mapping":
        return (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Batch Electronic Mapping System</h3>
            <p className="text-slate-500 text-sm mb-6">Upload datasets to auto-map local terms to standard ICD-11 codes.</p>
            <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-2xl p-12 text-center max-w-2xl mx-auto">
              <Layers className="text-blue-500 mx-auto mb-4" size={40}/>
              <p className="font-semibold text-slate-800 mb-1">Drag & drop clinical CSV files here</p>
            </div>
          </div>
        );
      default:
        return <div className="p-8 bg-white rounded-2xl">Module under layout mode.</div>;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 font-sans w-full overflow-x-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 h-screen bg-[#0a2040] text-white flex flex-col justify-between p-4 fixed left-0 top-0 z-50 shrink-0">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-gray-700">
            <div className="bg-blue-500 p-2 rounded-lg text-white font-bold text-xl">🇳</div>
            <span className="text-xl font-bold tracking-wide">Namaste ICD</span>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <button 
                key={index} 
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.label ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="border-t border-gray-700 pt-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">A</div>
          <div>
            <p className="text-sm font-semibold">Admin Panel</p>
            <p className="text-xs text-gray-400">NHA Standard</p>
          </div>
        </div>
      </div>
      
      {/* Right Content Area */}
      <div className="ml-64 flex-1 p-8 w-[calc(100%-16rem)] min-h-screen box-border">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{activeTab === "Overview" ? "Good morning, Coordinator" : activeTab}</h1>
            <p className="text-sm text-slate-500">Here's what's happening in your ICD portal today.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-medium">📅 June 1, 2026</span>
          </div>
        </div>

        {/* Dynamic Panel */}
        {renderContent()}
      </div>
    </div>
  );
}