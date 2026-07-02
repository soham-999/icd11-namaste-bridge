// src/components/ui/StatCard.tsx
import { Card } from './Card';
import { cn } from '../../utils';
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  growthPct: number;
  icon: LucideIcon;
  emoji: string;
}

export function StatCard({ label, value, growthPct, icon: Icon, emoji }: StatCardProps) {
  const isPositive = growthPct >= 0;
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm text-slate-500 font-medium">{emoji} {label}</span>
        <span className="hidden xs:flex items-center justify-center h-8 w-8 rounded-lg bg-accent-light text-accent">
          <Icon size={16} />
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl sm:text-2xl font-bold text-brand">{value}</span>
        <span className={cn('flex items-center text-xs font-semibold', isPositive ? 'text-success' : 'text-danger')}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(growthPct)}%
        </span>
      </div>
    </Card>
  );
}