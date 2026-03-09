'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import VideoModal from './VideoModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Nav() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isAutoTriggered, setIsAutoTriggered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoCursorPos, setDemoCursorPos] = useState({ x: 0, y: 0 });
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleCloseModal = () => {
    setIsVideoOpen(false);
    setIsAutoTriggered(false);
  };

  const runDemoSequence = useCallback(async () => {
    setIsDemoActive(true);
    router.replace(pathname, { scroll: false }); // Clean up URL immediately
    document.body.style.pointerEvents = 'none';
    document.body.style.overflow = 'hidden';

    await new Promise(r => setTimeout(r, 2000));

    const btn = document.getElementById('nav-demo-trigger');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;

      setDemoCursorPos({ x: targetX, y: targetY });
      await new Promise(r => setTimeout(r, 1200));
      
      setIsAutoTriggered(true);
      setIsVideoOpen(true);
      setIsDemoActive(false);
    }

    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
  }, [pathname, router]);

  useEffect(() => {
    if (searchParams.get('demo') === 'active') {
      // Set state to trigger sequence
      const timer = setTimeout(() => {
        runDemoSequence();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchParams, runDemoSequence]);

  return (
    <>
      <nav
        className="nav-container"
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
          width: 'auto',
          minWidth: 'max-content'
        }}
      >
        <Link href="/" className="nav-logo" style={{ 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
          letterSpacing: '0.15em',
          color: 'var(--white)',
          fontWeight: 700
        }}>
          ARC<span style={{ color: 'var(--electric)' }}>I</span>GY
        </Link>

        {/* Desktop Links - Hidden on Mobile */}
        <div className="hidden md:flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
          <a
            href="mailto:hello@arcigy.group"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
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
              letterSpacing: '0.15em',
              color: 'var(--white)',
              background: 'transparent',
              border: 'none',
              cursor: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              transition: 'background 0.3s ease',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e: React.MouseEvent) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e: React.MouseEvent) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <span style={{ 
              width: '4px', 
              height: '4px', 
              backgroundColor: 'var(--electric)', 
              borderRadius: '50%',
              boxShadow: '0 0 8px var(--glow-electric)'
            }}></span>
            Ukážka
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link
            href="/audit"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              color: 'var(--bg)',
              background: 'var(--electric)',
              textDecoration: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '100px',
              fontWeight: 700,
              textTransform: 'uppercase',
              transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), background 0.3s ease, box-shadow 0.3s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e: React.MouseEvent) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
              (e.currentTarget as HTMLElement).style.background = 'var(--neon)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 30px var(--glow-electric)';
            }}
            onMouseLeave={(e: React.MouseEvent) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLElement).style.background = 'var(--electric)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
            id="nav-cta"
          >
            <span className="hidden md:inline">15-MINÚTOVÝ CALL</span>
            <span className="md:hidden">15-MIN CALL</span>
          </Link>
          
          {/* Hamburger Toggle - Only on Mobile */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white transition-all active:scale-90"
            style={{ marginLeft: '0.5rem' }}
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[90] md:hidden flex flex-col items-center justify-center bg-[#060010] backdrop-blur-3xl"
          >
            <div className="flex flex-col items-center gap-8 p-10">
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-display tracking-widest text-white mb-10"
              >
                ARC<span className="text-[var(--electric)]">I</span>GY
              </Link>
              
              <a
                href="mailto:hello@arcigy.group"
                onClick={() => setIsMenuOpen(false)}
                className="font-mono text-2xl tracking-[0.2em] text-white uppercase hover:text-[var(--electric)]"
              >
                Kontakt
              </a>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsVideoOpen(true);
                }}
                className="flex items-center gap-4 font-mono text-2xl tracking-[0.2em] text-white uppercase hover:text-[var(--electric)]"
              >
                <span className="w-2 h-2 bg-[var(--electric)] rounded-full shadow-[0_0_10px_var(--glow-electric)]"></span>
                Ukážka
              </button>

              <Link
                href="/audit"
                onClick={() => setIsMenuOpen(false)}
                className="mt-12 font-mono text-xl tracking-[0.2em] text-[#060010] bg-[var(--electric)] uppercase font-bold px-12 py-6 rounded-full shadow-[0_0_40px_rgba(124,58,237,0.4)]"
              >
                REZERVOVAŤ CALL
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <VideoModal 
        isOpen={isVideoOpen} 
        onClose={handleCloseModal} 
        isAutoTriggered={isAutoTriggered}
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
