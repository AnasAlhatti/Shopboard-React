'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../shared/hooks/useTheme';
import { Button } from './Button';
export function ThemeToggle() {
  const { dark, toggleTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {dark ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </Button>
  );
}
