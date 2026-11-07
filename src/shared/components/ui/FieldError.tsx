import type { ComponentProps } from 'react';
import { cn } from '../../utils/cn';

export function FieldError({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-error"
      role="alert"
      className={cn('ui-field-error', className)}
      {...props}
    />
  );
}
