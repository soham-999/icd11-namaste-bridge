// src/Sidebar.jsx
import React from 'react';
import { 
  LayoutDashboard, RefreshCw, Database, FileSpreadsheet, 
  Layers, History, ShieldCheck, Terminal, BellRing, Settings, X 
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, activeTab, setActiveTab }) {
  // Define all navigation items matching your layout in 104354.jpg
  const menuItems = [
    { id: 'overview', name: 'Overview Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'mapper', name: 'Terminology Mapper', icon: <RefreshCw size={18} /> },
    { id: 'ehr', name: 'EHR Endpoint Config', icon: <Database size={18} /> },
    { id: 'records', name: 'Structured Records', icon: <FileSpreadsheet size={18} /> },
    { id: 'fhir', name: 'FHIR / HL7 Outputs', icon: <Layers size={18} /> },
    { id: 'history', name: 'Mapping History', icon: <History size={18} /> },
    { id: 'validation', name: 'Validation Rules', icon: <ShieldCheck size={18} /> },
    { id: 'logs', name: 'System Logs', icon: <Terminal size={18} /> },
    { id: 'alerts', name: 'Alert Rules', icon: <BellRing size={18} /> },
    { id: 'settings', name: 'Bridge Settings', icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Background Overlay for Mobile Screen view */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-950 text-slate-400 border-r border-slate-900 p-4 flex flex-col z-50 transition-transform duration-300 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header Brand title */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-900/20 text-sm">Ω</div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide leading-none">NAMASTE Bridge</h1>
              <span className="text-[10px] text-slate-500 font-medium">ICD-11 Interoperability</span>
            </div>
          </div>
          <button className="lg:hidden p-1.5 text-slate-500 hover:text-white rounded-lg" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Navigation Links Area */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false); // Auto-close drawer on mobile devices
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 group text-left ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                    : 'hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Footer Indicator */}
        <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-600 flex flex-col gap-0.5">
          <p className="font-semibold text-slate-500">Production API Live</p>
          <p className="truncate font-mono">https://api.namaste-bridge.in/v1</p>
          <div className="flex items-center gap-1.5 mt-1 text-emerald-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Latency Stable</span>
          </div>
        </div>
      </aside>
    </>
  );
}