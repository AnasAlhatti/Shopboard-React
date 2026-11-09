import type { ComponentProps, ElementType } from 'react';
import { cn } from '../../lib/utils';
export interface CardProps extends ComponentProps<'div'> {
  as?: ElementType;
}
export function Card({
  as: Component = 'div',
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        cn(
          'rounded-card border border-border bg-surface p-6 shadow-card',
          className,
        ),
      )}
      {...props}
    />
  );
}
