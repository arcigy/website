'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: 'clamp(4rem, 8vw, 6rem) clamp(2rem, 8vw, 10rem)',
        background: 'var(--bg)',
        paddingBottom: '8rem',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem',
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          {/* Logo + tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <Image 
              src="/arcigy-logo-official.png" 
              alt="ARCIGY" 
              width={1024}
              height={682}
              style={{ 
                height: '32px', 
                width: 'auto',
                filter: 'brightness(1.1)',
                display: 'block',
                objectFit: 'contain'
              }} 
            />
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--dim)',
              }}
            >
              Arcigy s. r. o. · IČO: 57 503 028
            </p>
          </div>

          {/* Contact links */}
          <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <a
                href="mailto:hello@arcigy.group"
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--electric)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
              >
                hello@arcigy.group
              </a>
            </div>
            <a
              href="https://linkedin.com/company/arcigy"
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--electric)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.12em',
              color: 'var(--dim)',
              textTransform: 'uppercase',
            }}
          >
            © {new Date().getFullYear()} Arcigy s. r. o. Všetky práva vyhradené.
          </p>

          {/* Legal links */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link
              href="/terms"
              style={legalLinkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--dim)')}
            >
              Obchodné podmienky
            </Link>
            <Link
              href="/privacy"
              style={legalLinkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--white)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--dim)')}
            >
              Ochrana súkromia
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.85rem',
  letterSpacing: '0.05em',
  color: 'var(--muted)',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
};

const legalLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--dim)',
  textDecoration: 'none',
  transition: 'color 0.3s ease',
};
