'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VideoModal from './VideoModal';
import { motion, AnimatePresence } from 'framer-motion';

import Image from 'next/image';

export default function Nav() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoCursorPos, setDemoCursorPos] = useState({ x: 0, y: 0 });
  const searchParams = useSearchParams();
  const router = useRouter();

  const runDemoSequence = useCallback(async () => {
    setIsDemoActive(true);
    
    // 0. Clean up URL immediately so user doesn't see ?demo=active for long
    // Using replace to keep history clean
    router.replace('/', { scroll: false });

    // 1. Lock UI
    document.body.style.pointerEvents = 'none';
    document.body.style.overflow = 'hidden';

    // 2. Wait 1.5 seconds (reduced from 2s for better pacing)
    await new Promise(r => setTimeout(r, 1500));

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
    } else {
        // Fallback if button not found (shouldn't happen now)
        setIsVideoOpen(true);
        setIsDemoActive(false);
    }

    // Unlock UI
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
  }, [router]);

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
      className="fixed bottom-4 md:bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between md:justify-center w-[calc(100%-2rem)] md:w-auto gap-4 md:gap-10 bg-[#06000a]/80 backdrop-blur-md border border-purple-500/40 rounded-full px-5 py-3 md:pl-8 md:pr-3 shadow-[0_10px_40px_rgba(124,58,237,0.4)]"
    >
      <Link href="/" className="nav-logo shrink-0" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Image 
          src="/arcigy-wordmark-footer.png" 
          alt="ARCIGY" 
          width={786}
          height={168}
          priority
          className="h-[18px] md:h-[24px] w-auto brightness-110 object-contain transition-transform duration-300 hover:scale-105"
        />
      </Link>

      <div className="flex items-center gap-2">
        <a
          href="mailto:hello@arcigy.group"
          className="hidden md:flex items-center font-mono text-[0.7rem] tracking-widest text-white uppercase px-6 py-3 rounded-full hover:bg-white/5 transition-colors"
        >
          Kontakt
        </a>

        <button
          id="nav-demo-trigger"
          onClick={() => setIsVideoOpen(true)}
          className="flex items-center gap-2 font-mono text-[0.65rem] md:text-[0.7rem] tracking-widest text-white uppercase bg-transparent border-none cursor-none px-3 md:px-6 py-3 rounded-full hover:bg-white/5 transition-colors"
        >
          <span className="w-1 h-1 bg-[var(--electric)] rounded-full shadow-[0_0_8px_var(--glow-electric)]"></span>
          <span className="md:inline">Ukážka</span>
        </button>

        <Link
          href="/audit"
          className="flex items-center font-mono text-[0.65rem] md:text-[0.7rem] tracking-widest text-[var(--bg)] bg-[var(--electric)] hover:bg-[var(--neon)] uppercase font-semibold px-4 py-2 md:px-7 md:py-3 rounded-full transition-all duration-300 hover:scale-105 whitespace-nowrap"
          id="nav-cta"
        >
          15-min call
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
