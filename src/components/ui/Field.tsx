import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
const field = cva('flex gap-2', {
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row items-center',
      responsive: 'flex-col sm:flex-row sm:items-center',
    },
  },
  defaultVariants: { orientation: 'vertical' },
});
export interface FieldProps
  extends ComponentProps<'div'>, VariantProps<typeof field> {}
export function Field({ className, orientation, ...props }: FieldProps) {
  return (
    <div
      role="group"
      data-slot="field"
      className={cn(field({ orientation }), className)}
      {...props}
    />
  );
}
