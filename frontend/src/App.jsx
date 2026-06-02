import React, { useState, useEffect } from "react";
import {
  getICDBySymptom,
  getDashboardStats,
  getTopDiagnoses,
  getPatients
} from "./api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, Search, FileBarChart, Layers, Settings, Bell, ChevronRight, Activity, Database, CheckCircle, AlertCircle, RefreshCw, Filter, ArrowUpRight } from "lucide-react";
import { kpiData, trafficData, chapterData, topDiagnoses } from "./data";

export default function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [icdResult, setIcdResult] = useState(null);
const [dashboardStats, setDashboardStats] = useState(null);
const [diagnoses, setDiagnoses] = useState([]);
const [patients, setPatients] = useState([]);

const handleICDSearch = async () => {
  if (!searchQuery) return;

  try {
    const result = await getICDBySymptom(searchQuery);

    console.log(result);

    setIcdResult(result);
  } catch (err) {
    console.error(err);
    alert("Backend connection failed");
  }
};

  const COLORS = ["#0d9488", "#06b6d4", "#10b981", "#3b82f6", "#6366f1"];

  // Mock data for search engine simulation
  const sampleIcdResults = [
    { code: "BA00.0", title: "Essential Hypertension", chapter: "Diseases of the circulatory system", status: "Verified" },
    { code: "CA40.0", title: "Acute Respiratory Infection", chapter: "Diseases of the respiratory system", status: "Verified" },
    { code: "5A11.0", title: "Type 2 Diabetes Mellitus", chapter: "Endocrine, nutritional or metabolic diseases", status: "Verified" },
    { code: "CA20.1", title: "Bacterial Pneumonia", chapter: "Diseases of the respiratory system", status: "Review Required" },
    { code: "1B10.3", title: "Tuberculosis of nervous system", chapter: "Certain infectious or parasitic diseases", status: "Verified" }
  ];

  const filteredResults = sampleIcdResults.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#0f172a] text-slate-200 flex flex-col justify-between p-4 shrink-0 border-r border-slate-800 shadow-xl">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-3 py-4 border-b border-slate-800">
            <div className="bg-gradient-to-tr from-teal-500 to-cyan-400 text-white p-2 rounded-xl font-bold text-xl w-10 h-10 flex items-center justify-center shadow-lg shadow-teal-500/20">
              N
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider text-white block">Namaste ICD</span>
              <span className="text-[10px] text-teal-400 font-medium tracking-widest uppercase">Interop Engine</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            {[
              { name: "Overview", icon: LayoutDashboard },
              { name: "ICD-11 Finder", icon: Search },
              { name: "Batch Mapping", icon: Layers },
              { name: "Analytics Reports", icon: FileBarChart },
              { name: "Settings Portal", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name || (item.name === "ICD-11 Finder" && activeTab === "ICD-11 Finder");
              return (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive 
                      ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30 font-semibold translate-x-1" 
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight size={14} className="text-teal-200" />}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-sm border border-teal-500/30">
            MS
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-200 truncate">Malini Singh</p>
            <p className="text-[10px] text-slate-500 truncate">Lead Coordinator</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f1f5f9]">
        
        {/* Top Header Row */}
        <header className="flex justify-between items-center px-8 py-5 bg-white border-b border-slate-200/80 shadow-sm shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === "Overview" ? "Clinical Mapping Workspace" : "ICD-11 Real-time Finder"}
            </h1>
            <p className="text-slate-500 text-xs mt-0.5 font-medium">
              {activeTab === "Overview" 
                ? "Real-time WHO ICD-11 standard electronic code ingestion logs." 
                : "Search, evaluate, and tie terminology directly to WHO core entities."}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Synced Engine
            </div>
           
          </div>
        </header>

        {/* Workspace Panels */}
        <main className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 max-w-7xl w-full mx-auto">
          
          {/* OVERVIEW PANEL */}
          {activeTab === "Overview" && (
            <>
              {/* KPI Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {kpiData.map((kpi, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{kpi.title}</span>
                      <div className={`p-1.5 rounded-lg ${idx === 3 ? "bg-teal-50 text-teal-600" : "bg-slate-50 text-slate-600"}`}>
                        {idx === 0 && <Activity size={16} />}
                        {idx === 1 && <Database size={16} />}
                        {idx === 2 && <RefreshCw size={16} />}
                        {idx === 3 && <CheckCircle size={16} />}
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between mt-4">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${kpi.change.includes("-") ? "bg-rose-50 text-rose-600" : "bg-teal-50 text-teal-600"}`}>
                        {kpi.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* System Alerts */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <AlertCircle size={18} className="text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">System Notifications & Validation Logs</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3.5 p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wide">Unmapped Term Alert</h4>
                      <p className="text-slate-600 text-sm font-semibold mt-0.5">32 rare clinical terms failed auto-mapping telemetry routine.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3.5 p-3.5 bg-teal-50/70 border border-teal-100 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 shrink-0"></div>
                    <div>
                      <h4 className="font-bold text-teal-900 text-xs uppercase tracking-wide">Optimization Status</h4>
                      <p className="text-slate-600 text-sm font-semibold mt-0.5">ICD-11 WHO central server cluster mapping health is optimized (98.4%).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-3 flex flex-col">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Daily Mapping Volume Log</h3>
                  </div>
                  <div
  style={{
    width: "100%",
    height: "300px",
    minHeight: "300px"
  }}
>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trafficData} barSize={24}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={11} fontWeight={600} />
                        <YAxis axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={11} fontWeight={600} />
                        <Tooltip cursor={{ fill: "#f1f5f9" }} />
                        <Bar dataKey="value" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 flex flex-col">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Diseases by ICD Chapter</h3>
                  </div>
                 <div
  style={{
    width: "100%",
    height: "250px",
    minHeight: "250px"
  }}
>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chapterData} cx="50%" cy="50%" innerRadius={55} outerRadius={72} paddingAngle={3} dataKey="value">
                          {chapterData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-3 border-t border-slate-50 pt-3">
                    {chapterData.slice(0, 4).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-md" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          <span className="text-slate-500 font-medium">{entry.name}</span>
                        </div>
                        <span className="text-slate-900 font-bold">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Top ICD-11 Mapped Diagnoses Index</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200/60">
                        <th className="py-3 px-6">ICD Entity Code</th>
                        <th className="py-3 px-6">Diagnosis Description</th>
                        <th className="py-3 px-6 text-center">Inbound Cases</th>
                        <th className="py-3 px-6 text-center">Ratio Metric</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {topDiagnoses.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-teal-600">{row.code}</td>
                          <td className="py-3.5 px-6 text-slate-900 font-bold text-sm">{row.diagnosis}</td>
                          <td className="py-3.5 px-6 text-center text-slate-700 font-extrabold">{row.cases}</td>
                          <td className="py-3.5 px-6 text-center">
                            <span className="bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md font-bold border border-cyan-100">
                              {row.percentage}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* DYNAMIC FUNCTIONAL ICD-11 FINDER PANEL */}
          {activeTab === "ICD-11 Finder" && (
  <div className="flex flex-col gap-6 w-full animate-fadeIn">

    {/* Search Control Box */}
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

      <div className="flex gap-2 w-full md:max-w-xl">

        <input
          type="text"
          placeholder="Search by Disease name or ICD code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleICDSearch();
            }
          }}
          className="flex-1 bg-slate-50 text-slate-800 px-4 py-3 rounded-xl border border-slate-200"
        />

        <button
          onClick={handleICDSearch}
          className="bg-teal-600 text-white px-4 py-3 rounded-xl"
        >
          Search ICD
        </button>

      </div>

      <button className="flex items-center gap-2 px-4 py-3 bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 transition-colors">
        <Filter size={16} />
        Advanced Filter
      </button>

    </div>

    {/* Backend Response */}
    {icdResult && (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-lg mb-4">
          Backend Result
        </h3>

        <pre className="bg-slate-100 p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(icdResult, null, 2)}
        </pre>
      </div>
    )}

    {/* Results Terminal Block */}
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">

      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
          Found Entities Registry ({filteredResults.length})
        </h3>
      </div>

      {filteredResults.length > 0 ? (
        <div className="flex flex-col divide-y divide-slate-100">

          {filteredResults.map((result, idx) => (
            <div
              key={idx}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
            >

              <div className="flex items-start gap-4">

                <div className="bg-teal-50 border border-teal-100 font-mono text-teal-700 font-bold px-3 py-1.5 rounded-xl text-sm shrink-0">
                  {result.code}
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {result.title}
                  </h4>

                  <p className="text-slate-400 text-xs font-medium mt-0.5">
                    {result.chapter}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 shrink-0">

                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                    result.status === "Verified"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}
                >
                  {result.status}
                </span>

                <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                  <ArrowUpRight size={18} />
                </button>

              </div>

            </div>
          ))}

        </div>
      ) : (
        <div className="p-12 text-center">
          <p className="text-slate-400 text-sm font-medium">
            No active ICD codes match your current query parameter.
          </p>
        </div>
      )}

    </div>

  </div>
)}{/* Fallback for other modules */}
          {activeTab !== "Overview" && activeTab !== "ICD-11 Finder" && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200/60 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
                <Database size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-800">{activeTab} Module Dashboard</h3>
              <p className="text-slate-400 mt-1 text-xs font-medium">Dynamic dataset streams will bind seamlessly upon final engine integration.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}