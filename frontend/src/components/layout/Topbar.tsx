// src/components/layout/Topbar.tsx
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export function Topbar() {
  const user = useAuthStore((s) => s.user);
  const initials = user?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('') ?? 'U';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 h-16 px-4 sm:px-6 bg-white border-b border-slate-200">
      <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md bg-surface rounded-lg px-3 py-2 border border-slate-200">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search patients, terms, codes…"
          className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface" aria-label="Notifications">
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-ayush text-white flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-brand">{user?.name ?? 'Guest'}</p>
            <p className="text-[11px] text-slate-500">{user?.role ?? '—'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}