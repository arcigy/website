'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DELIVERABLES = [
  {
    title: 'Analýza procesov',
    desc: '3–5 vašich kľúčových procesov.',
  },
  {
    title: 'Kde strácate',
    desc: 'Odhad premrhaného času a peňazí.',
  },
  {
    title: 'Nástroje',
    desc: 'Odporúčanie softvéru a AI modelov.',
  },
  {
    title: 'Návratnosť',
    desc: 'Čas a rozpočet na implementáciu.',
  },
];

const OUTPUT_OPTIONS = [
  {
    title: 'DIY',
    desc: 'Získate kompletný plán zadarmo. Postup, akým systémom a nástrojmi všetko automatizovať vo vlastnej réžii.',
    tag: 'ZADARMO',
    accent: 'var(--muted)',
  },
  {
    title: 'Standard',
    desc: 'Vyriešime za vás 2–3 najväčšie problémové automatizácie, ktoré vám okamžite uvoľnia ruky.',
    tag: 'POPULÁRNE',
    accent: 'var(--electric)',
    featured: true,
  },
  {
    title: 'Enterprise',
    desc: 'Kompletná transformácia. Vyriešime 5–7 kľúčových automatizácií a nastavíme dlhodobú spoluprácu.',
    tag: 'PLNÝ SERVIS',
    accent: 'var(--neon)',
  },
];

export default function AuditSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.audit-title', {
        scrollTrigger: { trigger: '.audit-title', start: 'top 85%' },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'expo.out',
      });

      gsap.from('.audit-flow-line', {
        scrollTrigger: { trigger: '.audit-flow-line', start: 'top 85%' },
        scaleY: 0,
        transformOrigin: 'top center',
        duration: 2,
        ease: 'expo.inOut',
      });

      gsap.from('.deliverable-card', {
        scrollTrigger: { trigger: '.deliverables-grid', start: 'top 80%' },
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
      });

      gsap.from('.output-card', {
        scrollTrigger: { trigger: '.outputs-grid', start: 'top 80%' },
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="audit"
      style={{
        padding: 'clamp(6rem, 10vw, 10rem) clamp(2rem, 8vw, 10rem)',
        borderTop: '1px solid var(--border)',
        background: 'rgba(5, 0, 8, 1)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="audit-title" style={{ marginBottom: 'clamp(4rem, 8vw, 6rem)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              marginBottom: '2rem',
              color: 'var(--white)',
            }}
          >
            AI AUDIT
          </h2>
          <p
            style={{
              color: 'var(--muted)',
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              maxWidth: '45ch',
              lineHeight: 1.6,
            }}
          >
            Všetko začína 15-minútovým vysvetlením procesu. Samotný audit je hĺbková 1–2 hodinová analýza procesov a konzultácie so zamestnancami, ktoré odhalia reálny potenciál pre automatizáciu vo vašej firme.
          </p>
        </div>

        <div
          className="deliverables-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1px',
            background: 'rgba(255,255,255,0.05)',
            marginBottom: '4rem',
          }}
        >
          {DELIVERABLES.map((item, i) => (
            <div
              key={i}
              className="deliverable-card"
              style={{
                background: 'rgba(5, 0, 8, 1)',
                padding: 'clamp(2.5rem, 3.5vw, 3.5rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                border: '1px solid transparent',
                transition: 'border-color 0.4s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--electric)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
              }}
              data-hover
            >
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 2vw, 2rem)',
                  color: 'var(--white)',
                  letterSpacing: '0.02em',
                }}
              >
                {item.title}
              </h4>
              <p
                style={{
                  color: 'var(--dim)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Connecting Flow Line */}
        <div 
          className="audit-flow-line"
          style={{ 
            width: '1px', 
            height: 'clamp(4rem, 8vw, 6rem)', 
            background: 'linear-gradient(to bottom, var(--electric), transparent)',
            margin: '0 auto',
            opacity: 0.5
          }} 
        />

        {/* Output Section */}
        <div style={{ marginTop: '0' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '4rem',
            textAlign: 'center'
          }}>
             <span style={{ 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              color: 'var(--electric)', 
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              opacity: 0.8,
              marginBottom: '1rem'
            }}>
              FÁZA 2
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
                color: 'var(--white)',
                letterSpacing: '-0.01em',
                textTransform: 'uppercase'
              }}
            >
              VÝSTUP AUDITU
            </h3>
          </div>

          <div
            className="outputs-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2.5rem',
              marginBottom: '6rem',
              position: 'relative'
            }}
          >
            {/* Background connecting bar for the cards */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent)',
              zIndex: 0,
              pointerEvents: 'none'
            }} />
            {OUTPUT_OPTIONS.map((item, i) => (
              <div
                key={i}
                className="output-card"
                style={{
                  background: 'rgba(5, 0, 8, 1)',
                  padding: 'clamp(2rem, 3vw, 3rem)',
                  border: '1px solid transparent',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  transition: 'border-color 0.4s ease',
                  zIndex: 1
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--electric)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
                }}
                data-hover
              >
                <div style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.65rem', 
                  color: item.accent,
                  border: `1px solid ${item.accent}40`,
                  padding: '0.4rem 0.8rem',
                  width: 'fit-content',
                  letterSpacing: '0.1em'
                }}>
                  {item.tag}
                </div>
                
                <h4
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 3vw, 3rem)',
                    color: 'var(--white)',
                    lineHeight: 1,
                  }}
                >
                  {item.title}
                </h4>

                <p
                  style={{
                    color: 'var(--muted)',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    flexGrow: 1,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <p style={{ color: 'var(--electric)', fontSize: '0.9rem', maxWidth: '30ch', lineHeight: 1.5 }}>
            Kapacita: Berieme len 4 klientov mesačne.
          </p>
          <Link href="/audit" className="btn-primary" id="audit-cta">
            <span>Rezervovať termín</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
