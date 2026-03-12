'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhoneWithQRProps {
  phone: string;
  label: string;
}

export default function PhoneWithQR({ phone, label }: PhoneWithQRProps) {
  const [showQR, setShowQR] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) return; // Let default tel: handler work on mobile
    
    e.preventDefault();
    e.stopPropagation(); // Avoid triggering any parent cards
    setShowQR(!showQR);
  };

  // Close when clicking outside or scrolling
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowQR(false);
      }
    };
    if (showQR) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', () => setShowQR(false));
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', () => setShowQR(false));
    }
  }, [showQR]);

  const telLink = `tel:${phone.replace(/\s/g, '')}`;

  return (
    <div 
      ref={containerRef} 
      style={{ 
        position: 'relative', 
        display: 'inline-flex',
        width: 'fit-content'
      }}
      role="button"
    >
      <a 
        href={telLink}
        onClick={handleClick}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--dim)',
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          display: 'block',
          padding: '2px 0'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--dim)'}
      >
        {label}
      </a>
      
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            style={{
              position: 'absolute',
              left: '50%',
              top: 'calc(100% + 12px)', // Position BELOW the number
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'var(--bg-alt)',
              padding: '1rem',
              borderRadius: '16px',
              border: '2px solid var(--border-bright)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px var(--glow-electric)',
              textAlign: 'center',
              width: '140px',
              pointerEvents: 'none'
            }}
          >
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(telLink)}&color=a855f7&bgcolor=06000a`} 
              alt="Scan for calling"
              style={{ 
                width: '100%', 
                aspectRatio: '1/1',
                display: 'block', 
                borderRadius: '8px',
                border: '1px solid rgba(168, 85, 247, 0.3)'
              }}
            />
            <p style={{ 
              fontSize: '0.6rem', 
              color: 'var(--electric)', 
              fontFamily: 'var(--font-mono)',
              marginTop: '0.75rem',
              letterSpacing: '0.1em',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              SCAN PRE VOLANIE
            </p>
            {/* Arrow pointing UP to the number */}
            <div style={{
                position: 'absolute',
                left: '50%',
                top: '-9px', // Positioned at the TOP of popover
                width: '16px',
                height: '16px',
                background: 'var(--bg-alt)',
                borderLeft: '2px solid var(--border-bright)',
                borderTop: '2px solid var(--border-bright)',
                transform: 'translateX(-50%) rotate(45deg)',
                zIndex: -1
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
