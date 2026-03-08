'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import VideoModal from './VideoModal';
import { motion, AnimatePresence } from 'framer-motion';

import Image from 'next/image';

export default function Nav() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoCursorPos, setDemoCursorPos] = useState({ x: 0, y: 0 });
  const searchParams = useSearchParams();

  const runDemoSequence = useCallback(async () => {
    setIsDemoActive(true);
    // 1. Lock UI
    document.body.style.pointerEvents = 'none';
    document.body.style.overflow = 'hidden';

    // 2. Wait 2 seconds
    await new Promise(r => setTimeout(r, 2000));

    // 3. Find button position
    const btn = document.getElementById('nav-demo-trigger');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      setDemoCursorPos({ x: targetX, y: targetY });

      // 4. Wait for cursor animation to finish
      await new Promise(r => setTimeout(r, 1200));
      
      // 5. Click!
      setIsVideoOpen(true);
      setIsDemoActive(false);
    }

    // Unlock UI
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    if (searchParams.get('demo') === 'active') {
      const timer = setTimeout(() => {
        runDemoSequence();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchParams, runDemoSequence]);

  return (
    <>
    <nav
      className="nav"
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        padding: '0.75rem 0.75rem 0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'clamp(2rem, 4vw, 4rem)',
        background: 'rgba(6, 0, 10, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-bright)',
        borderRadius: '100px',
      }}
    >
      <Link href="/" className="nav-logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Image 
          src="/arcigy-logo-official.png" 
          alt="ARCIGY" 
          width={120}
          height={28}
          priority
          style={{ 
            height: '28px', 
            width: 'auto',
            filter: 'brightness(1.1)',
            transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </Link>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <a
          href="mailto:hello@arcigy.group"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'var(--white)',
            textDecoration: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            transition: 'background 0.3s ease',
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e: React.MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e: React.MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          Kontakt
        </a>

        <button
          id="nav-demo-trigger"
          onClick={() => setIsVideoOpen(true)}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'var(--white)',
            background: 'transparent',
            border: 'none',
            cursor: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '50px',
            transition: 'background 0.3s ease',
            textTransform: 'uppercase',
          }}
          onMouseEnter={(e: React.MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
          }}
          onMouseLeave={(e: React.MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '4px', 
              height: '4px', 
              backgroundColor: 'var(--electric)', 
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--glow-electric)'
            }}></span>
            Ukážka
          </span>
        </button>

        <Link
          href="/audit"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            color: 'var(--bg)',
            background: 'var(--electric)',
            textDecoration: 'none',
            padding: '0.75rem 1.75rem',
            borderRadius: '50px',
            fontWeight: 600,
            textTransform: 'uppercase',
            transition: 'transform 0.3s ease, background 0.3s ease',
          }}
          onMouseEnter={(e: React.MouseEvent) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
            (e.currentTarget as HTMLElement).style.background = 'var(--neon)';
          }}
          onMouseLeave={(e: React.MouseEvent) => {
            (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            (e.currentTarget as HTMLElement).style.background = 'var(--electric)';
          }}
          id="nav-cta"
        >
          15-minútový call
        </Link>
      </div>
    </nav>
    <VideoModal 
      isOpen={isVideoOpen} 
      onClose={() => setIsVideoOpen(false)} 
      videoSrc="https://pub-940e42d6aeea403e9c1c9e8d91684329.r2.dev/Timeline%201.mp4"
    />

    {/* Virtual Demo Cursor */}
    <AnimatePresence>
      {isDemoActive && (
        <motion.div
          initial={{ opacity: 0, x: '50vw', y: '-100px', scale: 2 }}
          animate={{ 
            opacity: 1, 
            x: demoCursorPos.x || '50vw', 
            y: demoCursorPos.y || '50vh',
            scale: 1, 
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.23, 1, 0.32, 1],
            opacity: { duration: 0.3 }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid var(--electric)',
            background: 'rgba(168, 85, 247, 0.2)',
            boxShadow: '0 0 20px var(--glow-electric)',
            zIndex: 9999999,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ 
            width: '8px', 
            height: '8px', 
            background: 'var(--white)', 
            borderRadius: '50%' 
          }} />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
