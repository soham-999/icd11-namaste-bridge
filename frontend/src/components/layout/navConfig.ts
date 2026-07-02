// src/components/layout/navConfig.ts
import {
  LayoutDashboard, Users, Stethoscope, Languages, UserCog, Network,
  BarChart3, ShieldCheck, LifeBuoy, type LucideIcon,
} from 'lucide-react';
import type { UserRole } from '../../api/types';

export interface NavItem {
  label: string;
  emoji: string;
  href: string;
  icon: LucideIcon;
  roles?: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', emoji: '🏠', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Patient Registry', emoji: '🧑‍🤝‍🧑', href: '/patients', icon: Users },
  { label: 'Clinical Intake', emoji: '📋', href: '/clinical/intake', icon: Stethoscope, roles: ['Admin', 'Doctor', 'Operator'] },
  { label: 'Translation Console', emoji: '🔤', href: '/translation', icon: Languages, roles: ['Admin', 'Doctor'] },
  { label: 'Specialist Roster', emoji: '🩺', href: '/specialists', icon: UserCog },
  { label: 'Interoperability', emoji: '🔗', href: '/interoperability', icon: Network, roles: ['Admin', 'Integrator', 'Auditor'] },
  { label: 'Analytics & Reports', emoji: '📊', href: '/analytics', icon: BarChart3, roles: ['Admin', 'Auditor'] },
  { label: 'Administration', emoji: '⚙️', href: '/admin', icon: ShieldCheck, roles: ['Admin'] },
  { label: 'System & Support', emoji: '🛟', href: '/support', icon: LifeBuoy },
];