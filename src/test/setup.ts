import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { createElement, useSyncExternalStore } from 'react';
import { afterEach, beforeEach, vi } from 'vitest';

// jsdom has no dialog methods. Real-browser checks cover native focus trapping.
Object.defineProperties(HTMLDialogElement.prototype, {
  showModal: {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  },
  close: {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    },
  },
});

afterEach(() => {
  cleanup();
});

vi.mock('server-only', () => ({}));
vi.mock('next/navigation', () => {
  const subscribe = (fn: () => void) => {
    window.addEventListener('popstate', fn);
    return () => window.removeEventListener('popstate', fn);
  };
  const navigate = (href: string, replace = false) => {
    if (replace) history.replaceState(null, '', href);
    else history.pushState(null, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  return {
    usePathname: () => useSyncExternalStore(subscribe, () => location.pathname),
    useSearchParams: () =>
      new URLSearchParams(
        useSyncExternalStore(subscribe, () => location.search),
      ),
    useParams: () => ({ id: location.pathname.split('/').at(-1) }),
    useRouter: () => ({
      push: (href: string) => navigate(href),
      replace: (href: string) => navigate(href, true),
      back: () => history.back(),
      forward: () => history.forward(),
      refresh: vi.fn(),
    }),
    notFound: () => {
      throw new Error('NEXT_NOT_FOUND');
    },
    redirect: (url: string) => {
      throw new Error('NEXT_REDIRECT:' + url);
    },
  };
});
vi.mock('next/link', () => ({
  default: ({
    href,
    onClick,
    children,
    ...props
  }: import('react').ComponentProps<'a'>) =>
    createElement(
      'a',
      {
        ...props,
        href,
        onClick: (event: import('react').MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event);
          if (!event.defaultPrevented && href?.startsWith('/')) {
            event.preventDefault();
            history.pushState(null, '', href);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        },
      },
      children,
    ),
}));

const replaceState = window.history.replaceState.bind(window.history);
const pushState = window.history.pushState.bind(window.history);
beforeEach(() => {
  vi.spyOn(window.history, 'replaceState').mockImplementation((...args) => {
    replaceState(...args);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  vi.spyOn(window.history, 'pushState').mockImplementation((...args) => {
    pushState(...args);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
});
