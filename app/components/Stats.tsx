'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { num: '60+', label: 'Zmapovaných procesov' },
  { num: '12', label: 'Odvetví' },
  { num: '0', label: 'Generických riešení' },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 60,
        stagger: 0.12,
        duration: 1,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stats"
      style={{
        padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 8vw, 10rem)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1px',
          background: 'rgba(255,255,255,0.05)',
          marginBottom: '4rem',
        }}
      >
        {STATS.map((stat, i) => (
          <div
            key={i}
            className="stat-item"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(4rem, 8vw, 7rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--electric)',
              }}
            >
              {stat.num}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                fontWeight: 500,
                color: 'var(--muted)',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}