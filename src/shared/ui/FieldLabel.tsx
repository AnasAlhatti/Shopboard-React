// Generated from the official shadcn/ui field registry.
import type * as React from 'react';
import { Label } from './Label';
import { cn } from '../utils/cn';
export interface FieldLabelProps extends React.ComponentProps<typeof Label> {}
export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'tw:group/field-label tw:peer/field-label tw:flex tw:w-fit tw:gap-2 tw:leading-snug tw:group-data-[disabled=true]/field:opacity-50',
        'tw:has-[>[data-slot=field]]:w-full tw:has-[>[data-slot=field]]:flex-col tw:has-[>[data-slot=field]]:rounded-md tw:has-[>[data-slot=field]]:border tw:[&>*]:data-[slot=field]:p-4',
        'tw:has-data-[state=checked]:border-primary tw:has-data-[state=checked]:bg-primary/5 tw:dark:has-data-[state=checked]:bg-primary/10',
        className,
      )}
      {...props}
    />
  );
}
