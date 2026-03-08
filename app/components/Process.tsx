'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: '01',
    title: 'Úvodný hovor',
    desc: 'Zavoláme si a prejdeme vaše procesy. Zistíme, kde strácate čas a či má AI pre vás zmysel.',
  },
  {
    num: '02',
    title: 'Návrh riešenia',
    desc: 'Do 3 dní dostanete konkrétny plán — ktoré procesy automatizovať a čo to reálne ušetrí.',
  },
  {
    num: '03',
    title: 'Implementácia',
    desc: 'Spustíme automatizácie, otestujeme ich a naučíme váš tím. Odídeme až keď to funguje.',
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-title', {
        scrollTrigger: { trigger: '.process-title', start: 'top 85%' },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'expo.out',
      });

      gsap.from('.step-card', {
        scrollTrigger: { trigger: '.steps-wrap', start: 'top 80%' },
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="process"
      style={{
        padding: 'clamp(6rem, 10vw, 10rem) clamp(2rem, 8vw, 10rem)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2
          className="process-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: 'clamp(3rem, 6vw, 6rem)',
          }}
        >
          TRI KROKY.{' '}
          <span style={{ color: 'var(--electric)' }}>DVA TÝŽDNE.</span>
        </h2>

        {/* Steps — horizontal cards */}
        <div
          className="steps-wrap"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
          }}
        >
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="step-card"
              style={{
                background: 'var(--bg)',
                padding: 'clamp(2rem, 3vw, 3rem)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                transition: 'background 0.5s cubic-bezier(0.23,1,0.32,1)',
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
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3.5rem',
                  lineHeight: 1,
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(168,85,247,0.25)',
                  letterSpacing: '-0.02em',
                }}
              >
                {step.num}
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                  lineHeight: 1.05,
                  letterSpacing: '0.01em',
                  color: 'var(--white)',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
                  lineHeight: 1.7,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
