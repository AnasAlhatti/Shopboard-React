// Adapted from the official shadcn/ui registry.
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
export interface InputProps extends ComponentProps<'input'> {}
export function Input({ className, type, ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'min-h-11 w-full min-w-0 rounded-md border border-input bg-carbon px-3 py-2 text-base text-foreground shadow-xs outline-none placeholder:text-muted focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
