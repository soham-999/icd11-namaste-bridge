// src/components/forms/ClinicalIntakeForm.tsx
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { TerminologySearch } from '../mapping/TerminologySearch';
import { Button } from '../ui/Buttons';
import { commitMapping } from '../../api/mapping';
import { createPatient } from '../../api/patients';
import type { TerminologyMapping, AyushDepartment } from '../../api/types';
import { CheckCircle2 } from 'lucide-react';

const departments: AyushDepartment[] = ['Ayurveda', 'Unani', 'Siddha', 'Homeopathy', 'Yoga & Naturopathy'];

const schema = z.object({
  patientName: z.string().min(2, 'Enter the patient name'),
  age: z.coerce.number().min(0).max(120),
  gender: z.enum(['Male', 'Female', 'Other']),
  traditionalMedications: z.string().optional(),
  assignedDepartment: z.enum(['Ayurveda', 'Unani', 'Siddha', 'Homeopathy', 'Yoga & Naturopathy']),
});

type FormValues = z.infer<typeof schema>;

export function ClinicalIntakeForm() {
  const [bestMatch, setBestMatch] = useState<TerminologyMapping | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [committed, setCommitted] = useState(false);

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { patientName: 'John Doe', age: 30, gender: 'Male', assignedDepartment: 'Ayurveda' },
  });

  async function onSubmit(values: FormValues) {
    if (!bestMatch) return;
    setSubmitting(true);
    try {
      await createPatient({ name: values.patientName, age: values.age, gender: values.gender });
      await commitMapping({ icd11Code: bestMatch.icd11Code, namasteCode: bestMatch.namasteCode, department: values.assignedDepartment });
      setCommitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500 mb-1 block">🧑 Patient Name</label>
          <input {...register('patientName')} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent" />
          {errors.patientName && <p className="text-xs text-danger mt-1">{errors.patientName.message}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">🎂 Age</label>
          <input type="number" {...register('age')} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent" />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">⚧ Gender</label>
          <select {...register('gender')} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent bg-white">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">🌿 Disease (Auto-Suggest)</label>
        <TerminologySearch onBestMatchChange={setBestMatch} showAlternatives={false} />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">💊 Traditional Medications</label>
        <input {...register('traditionalMedications')} placeholder="Sudarshan Vati, etc." className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">🏷️ ICD-11 Code (Auto-mapped)</label>
          <input readOnly value={bestMatch ? `${bestMatch.icd11Code} — ${bestMatch.icd11Term}` : ''} placeholder="Resolves after disease search" className="w-full rounded-lg border border-slate-200 bg-surface px-3 py-2.5 text-sm text-slate-600" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">🏷️ NAMASTE Code (Auto-mapped)</label>
          <input readOnly value={bestMatch ? `${bestMatch.namasteCode} — ${bestMatch.namasteTerm}` : ''} placeholder="Resolves after disease search" className="w-full rounded-lg border border-slate-200 bg-surface px-3 py-2.5 text-sm text-slate-600" />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">🏥 Assigned Department</label>
        <Controller
          control={control}
          name="assignedDepartment"
          render={({ field }) => (
            <select {...field} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent bg-white">
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          )}
        />
      </div>

      {committed && (
        <div className="flex items-center gap-2 rounded-lg bg-success-light text-success text-sm font-medium px-3 py-2.5">
          <CheckCircle2 size={16} /> Committed to Interoperability Layer
        </div>
      )}

      <Button type="submit" disabled={!bestMatch || submitting} fullWidthOnMobile>
        {submitting ? 'Committing…' : '✅ Commit to Interoperability'}
      </Button>
    </form>
  );
}