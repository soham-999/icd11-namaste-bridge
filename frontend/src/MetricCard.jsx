// src/components/MetricCard.jsx
import React from 'react';
import { RefreshCw, Database, Terminal, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, change, isUp, index }) {
  const icons = [
    <RefreshCw size={20} />,
    <Database size={20} />,
    <Terminal size={20} />,
    <AlertTriangle size={20} />
  ];

  const iconStyles = [
    'bg-blue-50 text-blue-600',
    'bg-emerald-50 text-emerald-600',
    'bg-indigo-50 text-indigo-600',
    'bg-rose-50 text-rose-600'
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${iconStyles[index % 4]}`}>
          {icons[index % 4]}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs">
        <span className={`font-bold flex items-center gap-0.5 ${isUp ? 'text-emerald-600' : 'text-rose-500'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {change}
        </span>
        <span className="text-slate-400">vs benchmark limits</span>
      </div>
    </div>
  );
}