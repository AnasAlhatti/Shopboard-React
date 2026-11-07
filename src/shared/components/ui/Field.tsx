// shadcn/ui Field primitives. React Hook Form Controller owns values and validation.
import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';

export function Field({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="field"
      role="group"
      className={cn('ui-field', className)}
      {...props}
    />
  );
}
