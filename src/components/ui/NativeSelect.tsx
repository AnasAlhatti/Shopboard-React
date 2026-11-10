import type { ComponentProps } from 'react';
import { cn } from '../../lib/utils';
import { inputStyles } from './Input';

export interface NativeSelectProps extends ComponentProps<'select'> {}

export function NativeSelect({ className, ...props }: NativeSelectProps) {
  return (
    <select
      data-slot="native-select"
      className={cn(inputStyles, className)}
      {...props}
    />
  );
}
