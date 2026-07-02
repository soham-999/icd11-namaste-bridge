// src/pages/Specialists.tsx
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { SpecialistCard } from '../components/patient/SpecialistCard';
import { getSpecialists } from '../api/specialists';

export default function SpecialistsPage() {
  const { data: specialists } = useQuery({ queryKey: ['specialists'], queryFn: getSpecialists });

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-brand">🩺 Specialist Roster</h1>
        <p className="text-sm text-slate-500 mt-0.5">AYUSH specialists across all departments.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialists?.map((s) => <SpecialistCard key={s.id} specialist={s} />)}
      </div>
    </AppShell>
  );
}