// src/components/ui/Button.tsx
import { cn } from '../../utils';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-light active:bg-brand-soft',
  secondary: 'bg-accent text-white hover:bg-blue-700',
  ghost: 'bg-transparent text-brand border border-slate-200 hover:bg-slate-50',
  danger: 'bg-danger text-white hover:bg-red-700',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidthOnMobile?: boolean;
}

export function Button({ variant = 'primary', fullWidthOnMobile = false, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        fullWidthOnMobile && 'w-full sm:w-auto',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}