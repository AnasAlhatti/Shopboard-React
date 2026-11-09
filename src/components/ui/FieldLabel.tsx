import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { Label } from './Label';
export interface FieldLabelProps extends ComponentProps<typeof Label> {}
export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <Label
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
}
