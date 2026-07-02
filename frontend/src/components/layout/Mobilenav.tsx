// src/components/layout/MobileNav.tsx
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from './navConfig';
import { useAuthStore } from '../../store/useAuthStore';
import { useUiStore } from '../../store/useUiStore';
import { cn } from '../../utils';
import { Menu, X } from 'lucide-react';

const PRIMARY_MOBILE_ITEMS = ['/dashboard', '/patients', '/clinical/intake', '/translation'];

export function MobileNav() {
  const location = useLocation();
  const role = useAuthStore((s) => s.user?.role);
  const { mobileNavOpen, setMobileNavOpen } = useUiStore();

  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || (role && item.roles.includes(role)));
  const primaryItems = visibleItems.filter((i) => PRIMARY_MOBILE_ITEMS.includes(i.href));
  const overflowItems = visibleItems.filter((i) => !PRIMARY_MOBILE_ITEMS.includes(i.href));

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand border-t border-white/10 flex items-stretch h-16">
        {primaryItems.map((item) => {
          const active = location.pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium',
                active ? 'text-white' : 'text-slate-400'
              )}
            >
              <Icon size={18} />
              <span className="truncate px-1">{item.label.split(' ')[0]}</span>
            </NavLink>
          );
        })}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-slate-400"
        >
          <Menu size={18} />
          <span>More</span>
        </button>
      </nav>

      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setMobileNavOpen(false)} />
          <div className="w-72 bg-white h-full p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-brand">🪷 All Modules</p>
              <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-1">
              {overflowItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand hover:bg-slate-50"
                  >
                    <Icon size={18} />
                    {item.emoji} {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}