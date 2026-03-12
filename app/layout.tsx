import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARCIGY — Vaša konkurencia už používa AI.',
  description:
    'Zmapujeme vaše procesy a ukážeme kde vám AI ušetrí čas a peniaze. Úvodný hovor bez záväzkov. Kapacita: 4 klienti mesačne.',
  keywords: ['AI Audit', 'AI agentúra', 'business AI', 'AI automatizácia', 'AI pre firmy'],
  openGraph: {
    title: 'ARCIGY — Vaša konkurencia už používa AI.',
    description: 'Zmapujeme vaše procesy a ukážeme kde vám AI ušetrí čas a peniaze. Úvodný hovor bez záväzkov. Kapacita: 4 klienti mesačne.',
    type: 'website',
  },
};

import SmoothScroll from './components/SmoothScroll';
import CookieConsent from './components/CookieConsent';
import Script from 'next/script';

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
        <link rel="icon" href="/arcigy-symbol-official.png" />
        
        {/* Google Analytics - Placeholder pre tvoje ID (G-XXXXXXX) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Default consent nastaveny na denied
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied'
            });

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Facebook Pixel - Placeholder pre tvoje ID */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            const pixelId = '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}';
            if (pixelId && pixelId !== 'undefined' && pixelId !== 'null') {
              fbq('init', pixelId);
              fbq('track', 'PageView');
            }
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <SmoothScroll />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
