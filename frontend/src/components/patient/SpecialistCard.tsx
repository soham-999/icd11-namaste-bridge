// src/components/patient/SpecialistCard.tsx
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Specialist } from '../../api/types';

const AVAILABILITY_TONE = { Available: 'success', Unavailable: 'danger', 'On Leave': 'warning' } as const;

const DEPT_EMOJI: Record<string, string> = {
  Ayurveda: '🌿', Unani: '🕌', Siddha: '🪔', Homeopathy: '💧', 'Yoga & Naturopathy': '🧘',
};

export function SpecialistCard({ specialist }: { specialist: Specialist }) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-brand truncate">{specialist.name}</p>
        <p className="text-xs text-slate-500 mt-0.5">{DEPT_EMOJI[specialist.department] ?? '⚕️'} {specialist.department} Department</p>
        {specialist.qualification && <p className="text-[11px] text-slate-400 mt-1">{specialist.qualification}</p>}
      </div>
      <Badge tone={AVAILABILITY_TONE[specialist.availability]}>{specialist.availability}</Badge>
    </Card>
  );
}