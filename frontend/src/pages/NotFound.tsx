// src/pages/NotFound.tsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
      <span className="text-4xl">🧭</span>
      <h1 className="text-lg font-bold text-brand">Page not found</h1>
      <p className="text-sm text-slate-500 max-w-xs">The screen you're looking for doesn't exist in this module.</p>
      <Link to="/dashboard" className="text-sm font-semibold text-accent hover:underline">← Back to Dashboard</Link>
    </div>
  );
}