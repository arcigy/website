'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(
        '.hero-line',
        {
          opacity: 0,
          y: 100,
          skewY: 4,
          stagger: 0.14,
          duration: 1.2,
          ease: 'expo.out',
        }
      )
        .from(
          subRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.9,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .from(
          ctaRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.7,
            ease: 'power3.out',
          },
          '-=0.5'
        )
        .from(
          scrollIndicatorRef.current,
          {
            opacity: 0,
            duration: 1,
          },
          '-=0.3'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ padding: '0 clamp(2rem, 8vw, 10rem)' }}
    >
      <div className="w-full" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Headline — one giant statement */}
        <div ref={headlineRef} className="relative mb-16">
          <h1 className="flex flex-col" style={{ gap: '0.15em' }}>
            <span
              className="hero-line"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 10vw, 10rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                color: 'var(--white)',
              }}
            >
              VAŠA KONKURENCIA
            </span>
            <span
              className="hero-line"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 10vw, 10rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                color: 'var(--white)',
              }}
            >
              UŽ POUŽÍVA{' '}
              <span
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '2px var(--electric)',
                }}
              >
                AI
              </span>
            </span>
          </h1>
        </div>

        {/* Bottom row — subtext + CTA side by side */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '3rem',
            flexWrap: 'wrap',
          }}
        >
          <p
            ref={subRef}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1.05rem, 1.5vw, 1.3rem)',
              color: 'var(--muted)',
              maxWidth: '42ch',
              lineHeight: 1.65,
              fontWeight: 400,
            }}
          >
            Zmapujeme vaše procesy a ukážeme presne kde vám AI ušetrí čas
            a peniaze. Začíname vždy úvodným{' '}<strong style={{ color: 'var(--white)', fontWeight: 600 }}>15-minútovým hovorom</strong>.
          </p>

          <div
            ref={ctaRef}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              alignItems: 'flex-start',
            }}
          >
            <Link href="/audit" className="btn-primary" id="hero-cta">
              <span>Zarezervovať úvodný call</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none"
      >
        <div className="w-px h-16 bg-gradient-to-t from-purple-500/60 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
