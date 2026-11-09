import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ApplicationLayout } from '../components/layout/ApplicationLayout';
import { AppProviders } from '../components/providers/AppProviders';
import './globals.css';
export const metadata: Metadata = {
  title: {
    default: 'ShopBoard — Aethel Silicon',
    template: '%s | Aethel Silicon',
  },
  icons: { icon: '/favicon.svg' },
  description: 'Desktop hardware, custom builds, and everyday essentials.',
};
export interface RootLayoutProps {
  children: ReactNode;
}
const themeScript =
  "try{document.documentElement.classList.toggle('dark',localStorage.getItem('aethel-theme')!=='light')}catch{document.documentElement.classList.add('dark')}";
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <AppProviders>
          <ApplicationLayout>{children}</ApplicationLayout>
        </AppProviders>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};
