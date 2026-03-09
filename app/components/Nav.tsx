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
        className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between md:justify-center w-[92%] md:w-auto gap-3 md:gap-10 bg-[#060010]/80 backdrop-blur-xl border border-purple-500/20 rounded-full pl-6 pr-2 py-2 md:pl-8 md:pr-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <Link href="/" className="nav-logo shrink-0" style={{ 
          textDecoration: 'none', 
          display: 'flex', 
          alignItems: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 2vw, 1.4rem)',
          letterSpacing: '0.15em',
          color: 'var(--white)',
          fontWeight: 700
        }}>
          ARC<span style={{ color: 'var(--electric)' }}>I</span>GY
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href="mailto:hello@arcigy.group"
            className="font-mono text-[0.7rem] tracking-[0.15em] text-white uppercase px-6 py-3 rounded-full hover:bg-white/5 transition-colors"
          >
            Kontakt
          </a>

          <button
            id="nav-demo-trigger"
            onClick={() => setIsVideoOpen(true)}
            className="flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.15em] text-white uppercase bg-transparent border-none cursor-none px-6 py-3 rounded-full hover:bg-white/5 transition-colors"
          >
            <span className="w-1 h-1 bg-[var(--electric)] rounded-full shadow-[0_0_8px_var(--glow-electric)]"></span>
            Ukážka
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/audit"
            className="font-mono text-[0.6rem] md:text-[0.7rem] tracking-[0.15em] text-[#060010] bg-[var(--electric)] hover:bg-[var(--neon)] uppercase font-bold px-4 py-2.5 md:px-8 md:py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(124,58,237,0.3)] whitespace-nowrap"
            id="nav-cta"
          >
            15-MIN CALL
          </Link>
          
          {/* Hamburger Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white transition-all active:scale-90"
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
