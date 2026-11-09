// Generated from the official shadcn/ui field registry; split to keep one component per file.
import type * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
const fieldVariants = cva(
  'tw:group/field tw:flex tw:w-full tw:gap-3 tw:data-[invalid=true]:text-destructive',
  {
    variants: {
      orientation: {
        vertical: ['tw:flex-col tw:[&>*]:w-full tw:[&>.sr-only]:w-auto'],
        horizontal: [
          'tw:flex-row tw:items-center',
          'tw:[&>[data-slot=field-label]]:flex-auto',
          'tw:has-[>[data-slot=field-content]]:items-start tw:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        ],
        responsive: [
          'tw:flex-col tw:@md/field-group:flex-row tw:@md/field-group:items-center tw:[&>*]:w-full tw:@md/field-group:[&>*]:w-auto tw:[&>.sr-only]:w-auto',
          'tw:@md/field-group:[&>[data-slot=field-label]]:flex-auto',
          'tw:@md/field-group:has-[>[data-slot=field-content]]:items-start tw:@md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        ],
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  },
);
export interface FieldProps
  extends React.ComponentProps<'div'>, VariantProps<typeof fieldVariants> {}
export function Field({
  className,
  orientation = 'vertical',
  ...props
}: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}
