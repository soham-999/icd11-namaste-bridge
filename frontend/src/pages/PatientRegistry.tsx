// src/pages/PatientRegistry.tsx
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { getPatients } from '../api/patients';
import { ChevronRight } from 'lucide-react';

export default function PatientRegistryPage() {
  const { data: patients } = useQuery({ queryKey: ['patients'], queryFn: getPatients });

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-brand">🧑‍🤝‍🧑 Patient Registry</h1>
        <p className="text-sm text-slate-500 mt-0.5">{patients?.length ?? 0} patients on record.</p>
      </div>

      <div className="space-y-3">
        {patients?.map((p) => (
          <Link key={p.id} to={`/patients/${p.id}`}>
            <Card className="flex items-center justify-between hover:border-accent transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 shrink-0 rounded-full bg-ayush-light text-ayush flex items-center justify-center font-bold text-sm">
                  {p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand truncate">{p.name}</p>
                  <p className="text-xs text-slate-500">{p.id} · {p.age} yrs · {p.gender} {p.hospital ? `· ${p.hospital}` : ''}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400 shrink-0" />
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}