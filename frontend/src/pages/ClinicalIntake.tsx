// src/pages/ClinicalIntake.tsx
import { AppShell } from '../components/layout/Appshell';
import { Card } from '../components/ui/Card';
import { ClinicalIntakeForm } from '../components/forms/ClinicalIntakeForm';

export default function ClinicalIntakePage() {
  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-brand">📋 Clinical Intake</h1>
        <p className="text-sm text-slate-500 mt-0.5">Capture patient details and auto-map the diagnosis to ICD-11 TM &amp; NAMASTE.</p>
      </div>
      <Card className="max-w-2xl">
        <ClinicalIntakeForm />
      </Card>
    </AppShell>
  );
}