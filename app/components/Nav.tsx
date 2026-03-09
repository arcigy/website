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
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCloseModal = () => {
    setIsVideoOpen(false);
    setIsAutoTriggered(false);
  };

  const runDemoSequence = useCallback(async () => {
    setIsDemoActive(true);
    router.replace(pathname, { scroll: false }); 
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

        {/* Desktop Links (>= 1024px) */}
        {!isMobile && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
        )}

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
            {isMobile ? 'REZERVOVAŤ CALL' : '15-MINÚTOVÝ CALL'}
          </Link>
          
          {/* Hamburger Toggle - ONLY ON MOBILE */}
          {isMobile && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.5rem',
                cursor: 'none'
              }}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </nav>

      {/* Ultra-Brutal Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 500,
              background: '#06000a',
              display: 'flex',
              flexDirection: 'column',
              padding: '2rem',
              overflow: 'hidden'
            }}
          >
            {/* Corner Glow Overlay */}
            <div style={{
              position: 'absolute',
              bottom: '-20%',
              right: '-10%',
              width: '80vw',
              height: '80vw',
              background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1, marginBottom: '6rem' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', letterSpacing: '0.2em' }}>
                ARC<span style={{ color: 'var(--electric)' }}>I</span>GY
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  color: 'var(--white)',
                  width: '56px',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'none'
                }}
              >
                <X size={28} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 1, marginTop: 'auto' }}>
               {[
                 { label: 'DOMOV', href: '/' },
                 { label: 'UKÁŽKA', onClick: () => { setIsMenuOpen(false); setIsVideoOpen(true); } },
                 { label: 'KONTAKT', href: 'mailto:hello@arcigy.group' }
               ].map((item, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ y: 80, opacity: 0, rotateX: -45 }}
                   animate={{ y: 0, opacity: 1, rotateX: 0 }}
                   transition={{ delay: 0.1 * idx, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                   style={{ perspective: '1000px' }}
                 >
                   {item.href ? (
                     <Link
                       href={item.href}
                       onClick={() => setIsMenuOpen(false)}
                       style={{
                         fontFamily: 'var(--font-display)',
                         fontSize: '15vw',
                         lineHeight: 1,
                         letterSpacing: '-0.02em',
                         color: 'var(--white)',
                         textDecoration: 'none',
                         display: 'block',
                         textTransform: 'uppercase'
                       }}
                     >
                       {item.label}
                     </Link>
                   ) : (
                     <button
                       onClick={item.onClick}
                       style={{
                         fontFamily: 'var(--font-display)',
                         fontSize: '15vw',
                         lineHeight: 1,
                         letterSpacing: '-0.02em',
                         color: 'var(--white)',
                         background: 'none',
                         border: 'none',
                         padding: 0,
                         textAlign: 'left',
                         width: '100%',
                         textTransform: 'uppercase'
                       }}
                     >
                       {item.label}
                     </button>
                   )}
                 </motion.div>
               ))}
               
               <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  style={{ marginTop: '4rem', marginBottom: '2rem' }}
               >
                  <Link
                    href="/audit"
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.9rem',
                      color: 'var(--bg)',
                      background: 'var(--electric)',
                      padding: '1.25rem 2.5rem',
                      borderRadius: '100px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      width: '100%',
                      boxShadow: '0 0 30px var(--glow-electric)'
                    }}
                  >
                    REZERVOVAŤ KONZULTÁCIU
                  </Link>
               </motion.div>
            </div>
            
            {/* Bottom Accent */}
            <div style={{
              position: 'absolute',
              bottom: '5%',
              left: '2rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              opacity: 0.3,
              letterSpacing: '0.3em',
              textTransform: 'uppercase'
            }}>
              Artificial Agency • 2024
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
      {/* Global Video Preloader - hidden but active */}
      <video
        src="https://pub-940e42d6aeea403e9c1c9e8d91684329.r2.dev/Timeline%201.mp4"
        preload="auto"
        muted
        style={{ display: 'none' }}
      />
    </>
  );
}
