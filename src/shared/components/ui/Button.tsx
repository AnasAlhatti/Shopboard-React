// shadcn/ui button pattern, styled with this project's CSS tokens instead of Tailwind.
import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva('ui-button', {
  variants: {
    variant: { default: 'ui-button--primary', outline: 'ui-button--outline' },
  },
  defaultVariants: { variant: 'default' },
});
export function Button({
  className,
  variant,
  type = 'button',
  ...props
}: ComponentProps<'button'> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
