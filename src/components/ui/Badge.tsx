import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
const badge = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        neutral: 'bg-raised text-muted',
        available: 'bg-success/10 text-success',
        unavailable: 'bg-primary/10 text-primary',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);
export interface BadgeProps
  extends ComponentProps<'span'>, VariantProps<typeof badge> {}
export function Badge({ variant, className, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant }), className)} {...props} />;
}
