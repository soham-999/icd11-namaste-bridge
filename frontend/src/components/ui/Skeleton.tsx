// src/components/ui/Skeleton.tsx
import { cn } from '../../utils';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-slate-200 rounded-md', className)} />;
}