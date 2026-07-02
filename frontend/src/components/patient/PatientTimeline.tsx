// src/components/patient/PatientTimeline.tsx
import { FileText, Stethoscope, GitMerge, Pill, HeartPulse } from 'lucide-react';
import type { PatientTimelineEvent, TimelineEventType } from '../../api/types';
import { formatDate } from '../../utils';
import { EmptyState } from '../ui/EmptyState';

const TYPE_ICON: Record<TimelineEventType, typeof FileText> = {
  visit_created: FileText, diagnosis: Stethoscope, mapping: GitMerge, prescription: Pill, follow_up: HeartPulse,
};

const TYPE_EMOJI: Record<TimelineEventType, string> = {
  visit_created: '📝', diagnosis: '🩺', mapping: '🔗', prescription: '💊', follow_up: '💙',
};

export function PatientTimeline({ events }: { events: PatientTimelineEvent[] }) {
  if (events.length === 0) {
    return <EmptyState emoji="🗂️" title="No timeline events yet" description="Events will appear here once a visit is recorded." />;
  }

  return (
    <ol className="relative border-l border-slate-200 ml-3">
      {events.map((event) => {
        const Icon = TYPE_ICON[event.type];
        return (
          <li key={event.id} className="mb-6 ml-5 last:mb-0">
            <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-accent ring-4 ring-white">
              <Icon size={9} className="text-white" />
            </span>
            <p className="text-xs text-slate-400">{formatDate(event.date)}</p>
            <p className="text-sm font-semibold text-brand mt-0.5">{TYPE_EMOJI[event.type]} {event.title}</p>
            <p className="text-xs sm:text-sm text-slate-500">{event.description}</p>
          </li>
        );
      })}
    </ol>
  );
}