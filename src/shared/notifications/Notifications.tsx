'use client';
import { Toaster } from 'sonner';
import { useTheme } from '../hooks/useTheme';
export function Notifications() {
  const { dark } = useTheme();
  return (
    <Toaster
      theme={dark ? 'dark' : 'light'}
      richColors
      closeButton
      position="bottom-right"
    />
  );
}
