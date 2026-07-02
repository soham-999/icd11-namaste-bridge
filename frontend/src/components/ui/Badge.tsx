// src/components/ui/Badge.tsx
import { cn } from '../../utils';

type BadgeTone = 'success' | 'danger' | 'warning' | 'neutral' | 'accent';

const toneClasses: Record<BadgeTone, string> = {
  success: 'bg-success-light text-success',
  danger: 'bg-danger-light text-danger',
  warning: 'bg-warning-light text-warning',
  neutral: 'bg-slate-100 text-slate-600',
  accent: 'bg-accent-light text-accent',
};

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap', toneClasses[tone])}>
      {children}
    </span>
  );
}