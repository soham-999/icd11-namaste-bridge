// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Button } from '../components/ui/Buttons';
import { backendApi } from '../api/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('ananya.rao@namaste-icd.org');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await backendApi.post('/auth/login', { email, password });
      setSession(data.user, data.token);
      navigate('/dashboard');
    } catch {
      setError('⚠️ Could not reach auth service — check VITE_BACKEND_URL.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm bg-white rounded-xl2 border border-slate-200 shadow-card p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🪷</span>
          <div>
            <p className="text-sm font-bold text-brand">NAMASTE–ICD</p>
            <p className="text-xs text-slate-500">Interoperability Portal</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">✉️ Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">🔒 Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent" />
          </div>
          {error && <p className="text-xs text-danger">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Signing in…' : '🔐 Sign In'}</Button>
        </form>
      </div>
    </div>
  );
}