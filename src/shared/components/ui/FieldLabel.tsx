import type { ComponentProps } from 'react';
import { Label } from 'radix-ui';
import { cn } from '../../utils/cn';

export function FieldLabel({
  className,
  ...props
}: ComponentProps<typeof Label.Root>) {
  return (
    <Label.Root
      data-slot="field-label"
      className={cn('ui-field-label', className)}
      {...props}
    />
  );
}
