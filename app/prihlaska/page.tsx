'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import AuditForm from '../components/AuditForm';

const ShaderBackground = dynamic(() => import('../components/ShaderBackground'), { ssr: false });
const CustomCursor = dynamic(() => import('../components/CustomCursor'), { ssr: false });

export default function PrihlaskaPage() {
  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        backgroundColor: 'var(--bg)',
        color: 'var(--white)',
      }}
    >
      <ShaderBackground />
      <CustomCursor />
      
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
      >
        <Link 
          href="/" 
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
            letterSpacing: '0.04em',
            color: 'var(--white)',
            textDecoration: 'none',
            pointerEvents: 'auto',
          }}
        >
          ARC<span style={{ color: 'var(--electric)' }}>I</span>GY
        </Link>
        <Link 
          href="/" 
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            color: 'var(--dim)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            pointerEvents: 'auto',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--white)' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--dim)' }}
        >
          ZAVRIEŤ ✕
        </Link>
      </nav>

      <main style={{ position: 'relative', zIndex: 10, paddingTop: '100px' }}>
        <AuditForm />
      </main>
    </div>
  );
}
