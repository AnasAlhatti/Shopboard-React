import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { clearProductCache } from '../services/productService';

afterEach(() => {
  cleanup();
  clearProductCache();
});
