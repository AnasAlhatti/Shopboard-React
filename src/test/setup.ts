import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { queryClient } from '../shared/api/queryClient';

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
  queryClient.clear();
});
