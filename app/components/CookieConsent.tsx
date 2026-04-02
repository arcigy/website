'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie } from 'lucide-react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
    }
    // Reload or trigger a custom event
    window.dispatchEvent(new Event('cookieConsentUpdate'));
    window.dispatchEvent(new Event('cursor-reset'));
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
    window.dispatchEvent(new Event('cursor-reset'));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        exit={{ y: 100, opacity: 0, x: '-50%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed',
          bottom: isMobile ? '1rem' : '2rem',
          left: '50%',
          width: isMobile ? 'calc(100% - 1.5rem)' : '500px',
          maxWidth: 'calc(100% - 1.5rem)',
          zIndex: 999999, // Under cursor but above everything else
          backgroundColor: '#0D0010',
          border: '1px solid rgba(124, 58, 237, 0.3)',
          borderRadius: isMobile ? '20px' : '24px',
          padding: isMobile ? '1.25rem' : '2rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(124, 58, 237, 0.1)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <div style={{ 
               width: isMobile ? '32px' : '40px', 
               height: isMobile ? '32px' : '40px', 
               borderRadius: '10px', 
               backgroundColor: 'rgba(168, 85, 247, 0.1)', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center',
               border: '1px solid rgba(168, 85, 247, 0.3)'
             }}>
               <Cookie size={isMobile ? 16 : 20} color="#A855F7" />
             </div>
             <h3 style={{ 
               fontFamily: 'var(--font-display)', 
               fontSize: isMobile ? '1.1rem' : '1.25rem', 
               color: '#FFFFFF', 
               margin: 0,
               letterSpacing: '1px'
             }}>
               COOKIES & SÚKROMIE
             </h3>
          </div>

          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: isMobile ? '0.8rem' : '0.9rem', 
            lineHeight: 1.5,
            margin: 0 
          }}>
            Používame Google Analytics a Meta Pixel, aby sme pochopili, čo vás zaujíma a vedeli sme doručiť náš AI Audit presne tam, kde má zmysel. Súhlasíte?
          </p>

          <div style={{ display: 'flex', gap: isMobile ? '0.75rem' : '1rem' }}>
            <button
              onClick={handleAccept}
              style={{
                flex: 1,
                padding: isMobile ? '0.85rem' : '1rem',
                borderRadius: '12px',
                backgroundColor: 'var(--electric)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                boxShadow: '0 0 20px var(--glow-electric)',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                if(window.matchMedia('(pointer: fine)').matches) {
                  e.currentTarget.style.backgroundColor = 'var(--neon)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--electric)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              SÚHLASÍM
            </button>
            <button
              onClick={handleDecline}
              style={{
                padding: isMobile ? '0.85rem 1rem' : '1rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'rgba(255, 255, 255, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                textTransform: 'uppercase'
              }}
              onMouseEnter={(e) => {
                if(window.matchMedia('(pointer: fine)').matches) {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }}
            >
              ODMIETNUŤ
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
