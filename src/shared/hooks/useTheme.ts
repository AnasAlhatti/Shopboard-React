'use client';
import { useSyncExternalStore } from 'react';
let transitionFrame: number | undefined;
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
    if (transitionFrame !== undefined) cancelAnimationFrame(transitionFrame);
    document.documentElement.setAttribute('data-theme-changing', '');
    // Commit transition suppression before applying the new palette.
    void document.documentElement.offsetHeight;
    document.documentElement.classList.toggle('dark', !dark);
    try {
      localStorage.setItem('aethel-theme', theme);
    } catch {
      /* Theme remains available for this visit. */
    }
    window.dispatchEvent(new Event('theme-change'));
    void document.documentElement.offsetHeight;
    transitionFrame = requestAnimationFrame(() => {
      transitionFrame = requestAnimationFrame(() => {
        document.documentElement.removeAttribute('data-theme-changing');
        transitionFrame = undefined;
      });
    });
  }
  return { dark, toggleTheme };
}
