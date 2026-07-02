// src/pages/PatientDetail.tsx
import { useParams, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../components/layout/AppShell';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { PatientTimeline } from '../components/patient/PatientTimeline';
import { getPatients, getPatientTimeline } from '../api/patients';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: patients } = useQuery({ queryKey: ['patients'], queryFn: getPatients });
  const { data: timeline } = useQuery({
    queryKey: ['patient-timeline', id],
    queryFn: () => getPatientTimeline(id!),
    enabled: !!id,
  });

  const patient = patients?.find((p) => p.id === id);
  if (patients && !patient) return <Navigate to="/patients" replace />;

  return (
    <AppShell>
      {patient && (
        <Card className="mb-5 flex items-center gap-4">
          <div className="h-14 w-14 shrink-0 rounded-full bg-ayush-light text-ayush flex items-center justify-center font-bold text-lg">
            {patient.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-brand">👤 {patient.name}</h1>
            <p className="text-sm text-slate-500">ID: {patient.id} · Age: {patient.age} · Gender: {patient.gender}</p>
          </div>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>🕓 Patient Timeline</CardTitle></CardHeader>
        <PatientTimeline events={timeline ?? []} />
        <button className="mt-5 text-sm font-semibold text-accent hover:underline">View Full History →</button>
      </Card>
    </AppShell>
  );
}