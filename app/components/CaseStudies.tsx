'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CASES = [
  {
    industry: 'Geodetická firma',
    problem: 'Chaos v zadaniach, neusporiadaný kalendár. Spracovanie objednávok zaberalo 5–10 hodín týždenne.',
    solution: 'Automatické spracovanie zákaziek, napojenie na inteligentný CRM systém, synchronizácia dokumentov a informácií.',
    result: 'Ušetrených 30 hodín týždenne a zachránené 1–2 zákazky mesačne.',
  },
  {
    industry: 'Odvetrávané fasády (10 ľudí)',
    problem: 'Zahltenie dopytmi a neschopnosť efektívne filtrovať lukratívne projekty. Zdĺhavá manuálna príprava kalkulácií a vysvetľovanie cenových ponúk.',
    solution: 'Automatizovaný systém na generovanie CP s AI rozborom do 15 minút. Týždenný skríning dopytov a dynamický pricing podľa bonity projektu.',
    result: 'CP hotová do 15 minút a 100% prehľad o maržovosti každého projektu.',
  },
];

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.case-title', {
        scrollTrigger: { trigger: '.case-title', start: 'top 85%' },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'expo.out',
      });

      gsap.from('.case-card', {
        scrollTrigger: { trigger: '.cases-grid', start: 'top 80%' },
        opacity: 0,
        y: 60,
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
      id="case-studies"
      style={{
        padding: 'clamp(6rem, 10vw, 10rem) clamp(2rem, 8vw, 10rem)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div className="case-title" style={{ marginBottom: 'clamp(4rem, 8vw, 6rem)' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
            }}
          >
            REÁLNE VÝSLEDKY
          </h2>
        </div>

        {/* Dense, minimalist grid - taking out the tape */}
        <div
          className="cases-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
          }}
        >
          {CASES.map((item, i) => (
            <div
              key={i}
              className="case-card group"
              style={{
                background: 'var(--bg)',
                padding: 'clamp(2.5rem, 4vw, 4rem)',
                position: 'relative',
                transition: 'background 0.5s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  'rgba(124,58,237,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  'var(--bg)';
              }}
              data-hover
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--electric)',
                  marginBottom: '2rem',
                }}
              >
                {item.industry}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: 'var(--dim)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Problém
                  </h4>
                  <p style={{ fontSize: '1.2rem', lineHeight: 1.4, color: 'var(--white)' }}>
                    {item.problem}
                  </p>
                </div>

                <div>
                  <h4 style={{ color: 'var(--dim)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    Riešenie
                  </h4>
                  <p style={{ fontSize: '1rem', lineHeight: 1.5, color: 'var(--muted)' }}>
                    {item.solution}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', marginTop: '1rem' }}>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                      color: 'var(--white)',
                      lineHeight: 1.1,
                    }}
                  >
                    {item.result}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}