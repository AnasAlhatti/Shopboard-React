import type { ComponentProps, ElementType } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
const card = cva('border border-border', {
  variants: {
    variant: {
      elevated: 'rounded-card bg-surface shadow-card',
      flat: 'rounded-lg bg-surface shadow-none',
      inset: 'rounded-lg bg-background shadow-none',
    },
    padding: { none: 'p-0', sm: 'p-4', md: 'p-6', lg: 'p-8' },
  },
  defaultVariants: { variant: 'elevated', padding: 'md' },
});
export interface CardProps
  extends ComponentProps<'div'>, VariantProps<typeof card> {
  as?: ElementType;
}
export function Card({
  as: Component = 'div',
  className,
  variant,
  padding,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(card({ variant, padding }), className)}
      {...props}
    />
  );
}
