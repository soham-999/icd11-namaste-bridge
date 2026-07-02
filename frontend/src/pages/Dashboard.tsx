// src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../components/layout/Appshell';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { AppointmentsChart } from '../components/charts/AppointmentsChart';
import { getDashboardStats, getAppointmentTrend, getRecentActivity } from '../api/dashboard';
import { formatCurrencyINR, formatNumber, formatTime } from '../utils';
import { Users, CalendarCheck, Stethoscope, Wallet, UserPlus, GitMerge, RefreshCw } from 'lucide-react';

const ACTIVITY_ICON = { patient_registered: UserPlus, mapping_created: GitMerge, data_synced: RefreshCw } as const;

export default function DashboardPage() {
  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: getDashboardStats });
  const { data: trend } = useQuery({ queryKey: ['appointment-trend'], queryFn: getAppointmentTrend });
  const { data: activity } = useQuery({ queryKey: ['recent-activity'], queryFn: getRecentActivity });

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-brand">🏠 Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Overview of patients, appointments, AYUSH experts &amp; interoperability transactions.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <StatCard label="Patients" value={formatNumber(stats.totalPatients)} growthPct={stats.patientsGrowthPct} icon={Users} emoji="🧑‍🤝‍🧑" />
          <StatCard label="Appointments" value={formatNumber(stats.totalAppointments)} growthPct={stats.appointmentsGrowthPct} icon={CalendarCheck} emoji="📅" />
          <StatCard label="AYUSH Experts" value={formatNumber(stats.totalAyushExperts)} growthPct={stats.expertsGrowthPct} icon={Stethoscope} emoji="🌿" />
          <StatCard label="Transactions" value={formatCurrencyINR(stats.totalTransactions)} growthPct={stats.transactionsGrowthPct} icon={Wallet} emoji="💳" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>📈 Appointments (This Month)</CardTitle></CardHeader>
          {trend && <AppointmentsChart data={trend} />}
        </Card>

        <Card>
          <CardHeader><CardTitle>🕒 Recent Activity</CardTitle></CardHeader>
          <ul className="space-y-4">
            {activity?.map((item) => {
              const Icon = ACTIVITY_ICON[item.type];
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="h-8 w-8 shrink-0 rounded-full bg-accent-light text-accent flex items-center justify-center">
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-brand font-medium truncate">{item.description}</p>
                    <p className="text-xs text-slate-400">{formatTime(item.timestamp)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <button className="mt-4 text-sm font-semibold text-accent hover:underline">View All →</button>
        </Card>
      </div>
    </AppShell>
  );
}