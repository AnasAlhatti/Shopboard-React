import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { queryClient } from '../shared/api/queryClient';

afterEach(() => {
  cleanup();
  queryClient.clear();
});
