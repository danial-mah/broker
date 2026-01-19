import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export function Button({ className, variant = 'primary', asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary' && 'bg-primary text-slate-950 hover:bg-teal-300',
        variant === 'secondary' && 'border border-border bg-panel text-slate-100 hover:bg-slate-800',
        variant === 'ghost' && 'text-slate-300 hover:bg-slate-800',
        variant === 'danger' && 'bg-danger text-slate-950 hover:bg-red-300',
        className
      )}
      {...props}
    />
  );
}
