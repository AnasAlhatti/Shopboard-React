import { act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import RootLayout from '../app/layout';

// Keep the actual document shell; feature state is irrelevant to head hydration.
vi.mock('../components/providers/AppProviders', () => ({
  AppProviders: ({ children }: { children: ReactNode }) => children,
}));
vi.mock('../components/layout/ApplicationLayout', () => ({
  ApplicationLayout: ({ children }: { children: ReactNode }) => children,
}));

it('hydrates the document when Netlify inserts a comment among head metadata', async () => {
  const element = (
    <RootLayout>
      <p>Storefront ready</p>
    </RootLayout>
  );
  const serverHtml = renderToString(element);
  const hydratedDocument = document.implementation.createHTMLDocument();
  hydratedDocument.open();
  hydratedDocument.write(
    serverHtml.replace(
      '<head>',
      '<head><meta charset="utf-8">\n<!-- This site is hosted on Netlify. -->',
    ),
  );
  hydratedDocument.close();
  const onRecoverableError = vi.fn();
  const root = await act(async () =>
    hydrateRoot(hydratedDocument, element, { onRecoverableError }),
  );
  try {
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(hydratedDocument.body.textContent).toContain('Storefront ready');
  } finally {
    await act(async () => root.unmount());
  }
});
