'use client';
import { useSyncExternalStore } from 'react';
function subscribe(callback: () => void) {
  window.addEventListener('theme-change', callback);
  return () => window.removeEventListener('theme-change', callback);
}
function snapshot() {
  return document.documentElement.classList.contains('dark');
}
export function useTheme() {
  const dark = useSyncExternalStore(subscribe, snapshot, () => true);
  function toggleTheme() {
    const theme = dark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', !dark);
    try {
      localStorage.setItem('aethel-theme', theme);
    } catch {
      /* Theme remains available for this visit. */
    }
    window.dispatchEvent(new Event('theme-change'));
  }
  return { dark, toggleTheme };
}
