import React, { useState } from 'react';
import { login } from './api';
import { HeartPulse } from 'lucide-react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login({ username, password });
      onLogin();
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 items-center justify-center">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-teal-500 rounded-xl flex items-center justify-center">
            <HeartPulse className="h-6 w-6 text-slate-950" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-wide">Med-Center</h1>
            <p className="text-[10px] text-teal-400 font-mono">WORKSTATION OS</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-black text-white">Sign In</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your credentials to access the system.</p>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. test" className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-850 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-teal-500 transition-colors" />
          </div>
        </div>
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        <button onClick={handleLogin} disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}