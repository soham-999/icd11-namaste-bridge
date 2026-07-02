// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navConfig';
import { useAuthStore } from '../../store/useAuthStore';
import { cn } from '../../utils';

export function Sidebar() {
  const role = useAuthStore((s) => s.user?.role);
  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || (role && item.roles.includes(role)));

  return (
    <aside className="hidden md:flex md:flex-col w-16 lg:w-64 shrink-0 bg-brand text-white h-screen sticky top-0">
      <div className="flex items-center gap-3 px-4 lg:px-5 h-16 border-b border-white/10">
        <span className="text-2xl leading-none">🪷</span>
        <div className="hidden lg:block leading-tight">
          <p className="text-sm font-bold">NAMASTE–ICD</p>
          <p className="text-[11px] text-slate-300">Interoperability Portal</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 lg:px-3 space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="hidden lg:inline truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="hidden lg:block px-4 py-3 border-t border-white/10 text-[11px] text-slate-400">
        SIH25026 · v1.0.0
      </div>
    </aside>
  );
}