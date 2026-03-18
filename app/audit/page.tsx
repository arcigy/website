'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import BookingSystem from '../components/BookingSystem';


const ShaderBackground = dynamic(() => import('../components/ShaderBackground'), { ssr: false });
const CustomCursor = dynamic(() => import('../components/CustomCursor'), { ssr: false });

export default function AuditPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div 
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        backgroundColor: 'var(--bg)',
        color: 'var(--white)',
        fontFamily: 'var(--font-display)',
        overflowX: 'hidden',
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
          padding: 'clamp(1rem, 5vw, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      >
        <Link 
          href="/" 
          aria-label="Späť na hlavnú stránku"
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
 
      <main 
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: 'clamp(6rem, 12vh, 12rem) 0 4rem 0',
          width: '100%',
          opacity: isMounted ? 1 : 0,
          transition: 'opacity 0.6s ease'
        }}
      >
        <BookingSystem />
      </main>
    </div>
  );
}
