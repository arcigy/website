import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '15-minútový AI hovor | Arcigy',
  description:
    'Zmapujeme vaše procesy a ukážeme kde vám AI ušetrí čas a peniaze. Úvodný hovor bez záväzkov. Kapacita: 4 klienti mesačne.',
  keywords: ['AI Audit', 'AI agentúra', 'business AI', 'AI automatizácia', 'AI pre firmy'],
  openGraph: {
    title: '15-minútový AI hovor | Arcigy',
    description: 'Zmapujeme vaše procesy a ukážeme kde vám AI ušetrí čas a peniaze. Úvodný hovor bez záväzkov. Kapacita: 4 klienti mesačne.',
    type: 'website',
  },
};

import SmoothScroll from './components/SmoothScroll';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
