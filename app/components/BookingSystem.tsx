'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { InlineWidget } from 'react-calendly';

export default function BookingSystem() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);

  return (
    <section 
      style={{
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '0 clamp(1rem, 5vw, 6rem)',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 'clamp(2rem, 5vw, 6rem)',
      }}
    >
      {/* LEFT COLUMN - BRANDING & COPY */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        style={{
          flex: '1 1 40%',
          minWidth: '300px',
        }}
      >
        <div style={{
          display: 'inline-block',
          padding: '0.25rem 1rem',
          marginBottom: '2.5rem',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '50px',
          background: 'rgba(255,255,255,0.03)',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'var(--electric)'
          }}>Bezplatná úvodná konzultácia</span>
        </div>
        
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(4rem, 8vw, 7rem)',
          lineHeight: 0.85,
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.1rem',
        }}>
          <span style={{ color: 'var(--dim)', mixBlendMode: 'difference' }}>15 minút,</span>
          <span style={{ color: 'var(--white)' }}>ktoré</span>
          <span style={{ color: 'var(--electric)', fontStyle: 'italic' }}>zmenia hru.</span>
        </h2>
        
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
          lineHeight: 1.6,
          color: 'var(--muted)',
          marginBottom: '3.5rem',
          maxWidth: '45ch',
          borderLeft: '2px solid rgba(168, 85, 247, 0.3)',
          paddingLeft: '1.5rem',
        }}>
          Zarezervuj si čas priamo v našom kalendári. Počas hovoru preskúmame, ako tvoja firma funguje, a rovno navrhneme, ktoré konkrétne AI riešenia ti ušetria najviac času a peňazí.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {[
            { title: "Analýza procesov", desc: "Zmapujeme, kde tvoj tím stráca stovky hodín mesačne." },
            { title: "Návrh riešenia", desc: "Ukážeme ti, ako by vyzeral automatizovaný systém ušitý na mieru." },
            { title: "Žiadny bullshit", desc: "Žiadny agresívny predaj. Len surové dáta a okamžitá hodnota." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}
            >
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--electric)',
                marginTop: '0.6rem',
                flexShrink: 0
              }} />
              <div>
                <h4 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--white)',
                  marginBottom: '0.2rem',
                }}>{item.title}</h4>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--dim)',
                  lineHeight: 1.5,
                }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* RIGHT COLUMN - CALENDLY EMBED */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        style={{
          flex: '1 1 50%',
          minWidth: 'min(100%, 320px)',
          position: 'relative',
          height: 'clamp(600px, 85vh, 740px)',
          width: '100%',
          marginTop: '2rem'
        }}
      >
        {/* Brutalist Glows */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '110%',
          background: 'var(--glow-electric)',
          filter: 'blur(150px)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
        
        <div 
          className="group"
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            backgroundColor: 'rgba(6, 0, 10, 0.8)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.1)',
            overflow: 'hidden',
          }}
        >
          
          {/* OS-style Top Bar */}
          <div style={{
            height: '40px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.25rem',
            position: 'relative',
            zIndex: 20,
          }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--electric)' }} />
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.15em',
              color: 'var(--dim)',
              textTransform: 'uppercase',
            }}>
              Secure Booking Terminal
            </div>
          </div>

          <div 
            style={{
              width: '100%',
              flexGrow: 1,
              position: 'relative',
              zIndex: 10,
            }}
            onMouseEnter={() => {
              const cursor = document.querySelector('.cursor');
              if (cursor) {
                cursor.setAttribute('style', 'display: none !important');
              }
              document.body.classList.add('allow-native-cursor');
            }} 
            onMouseLeave={() => {
              const cursor = document.querySelector('.cursor');
              if (cursor) {
                cursor.removeAttribute('style');
              }
              document.body.classList.remove('allow-native-cursor');
            }}
          >
            {mounted ? (
              <InlineWidget 
                url="https://calendly.com/andrej-arcigy/ai-konzultacia?hide_event_type_details=1&hide_gdpr_banner=1" 
                styles={{
                  height: '100%',
                  width: '100%',
                }}
                pageSettings={{
                  backgroundColor: '0d0015',
                  hideEventTypeDetails: true,
                  hideLandingPageDetails: true,
                  primaryColor: 'a855f7',
                  textColor: 'ffffff',
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '660px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1.5rem',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  color: 'var(--dim)',
                  textTransform: 'uppercase',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}>
                  Načítavam kalendár...
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

    </section>
  );
}
