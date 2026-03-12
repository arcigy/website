'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PhoneWithQR from './PhoneWithQR';

gsap.registerPlugin(ScrollTrigger);

const FOUNDERS = [
  {
    name: 'Branislav Laubert',
    role: 'Co-Founder',
    bio: 'Roky som optimalizoval firemné procesy zvnútra. Viem presne, kde vznikajú úzke hrdlá, čo stojí najviac času — a ako to s AI vyriešiť.',
    email: 'branislav@arcigy.group',
    phone: '+421 951 268 376',
    photoId: 'founder-photo-1',
    image: '/branislav.jpg'
  },
  {
    name: 'Andrej Repický',
    role: 'Co-Founder',
    bio: 'Technológie sú pre mňa nástroj na riešenie reálnych problémov. Navrhujem automatizácie, ktoré fungujú od prvého dňa — bez zbytočnej komplexity.',
    email: 'andrej@arcigy.group',
    phone: '+421 919 165 630',
    photoId: 'founder-photo-2',
    image: '/andrej.jpg'
  },
];

export default function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline reveal
      gsap.from('.about-headline', {
        scrollTrigger: { trigger: '.about-headline', start: 'top 85%' },
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: 'expo.out',
      });

      // Founder cards stagger
      gsap.from('.founder-card', {
        scrollTrigger: { trigger: '.founders-grid', start: 'top 80%' },
        opacity: 0,
        y: 60,
        stagger: 0.25,
        duration: 1,
        ease: 'power3.out',
      });

      // Photo containers subtle scale
      gsap.from('.founder-photo', {
        scrollTrigger: { trigger: '.founders-grid', start: 'top 80%' },
        scale: 1.15,
        stagger: 0.25,
        duration: 1.4,
        ease: 'power2.out',
      });

      // Horizontal line draw
      gsap.from('.about-divider', {
        scrollTrigger: { trigger: '.about-divider', start: 'top 90%' },
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        padding: 'clamp(6rem, 10vw, 10rem) clamp(2rem, 8vw, 10rem)',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Headline */}
        <h2
          className="about-headline"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 9vw, 9rem)',
            lineHeight: 0.88,
            letterSpacing: '-0.03em',
            color: 'var(--white)',
            marginBottom: 'clamp(4rem, 8vw, 8rem)',
          }}
        >
          KTO ZA TÝM
          <br />
          <span
            style={{
              color: 'transparent',
              WebkitTextStroke: '1.5px var(--electric)',
            }}
          >
            STOJÍ
          </span>
        </h2>

        {/* Founders Grid */}
        <div
          className="founders-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1px',
            background: 'var(--border)',
          }}
        >
          {FOUNDERS.map((founder, i) => (
            <div
              key={i}
              className="founder-card group"
              style={{
                background: 'var(--bg)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Photo container */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1.2 / 1',
                  overflow: 'hidden',
                  background: 'rgba(5, 0, 8, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0'
                }}
              >
                <div
                  className="founder-photo"
                  id={founder.photoId}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: i === 0
                      ? 'linear-gradient(135deg, rgba(124,58,237,0.4) 0%, transparent 60%)'
                      : 'linear-gradient(225deg, rgba(192,38,211,0.3) 0%, transparent 60%)',
                    zIndex: 2,
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay'
                  }}
                />

                <img 
                  src={founder.image}
                  alt={founder.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'top center',
                    filter: 'grayscale(1) contrast(1.1) brightness(0.9)',
                    transition: 'transform 1.2s cubic-bezier(0.23,1,0.32,1), filter 0.8s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.03)';
                    (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0.2) contrast(1.1) brightness(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                    (e.currentTarget as HTMLImageElement).style.filter = 'grayscale(1) contrast(1.1) brightness(0.9)';
                  }}
                />

                {/* Bottom gradient fade into text area */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background:
                      'linear-gradient(to top, var(--bg) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Text info */}
              <div
                style={{
                  padding: 'clamp(2rem, 3vw, 3rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                      lineHeight: 0.95,
                      letterSpacing: '-0.01em',
                      color: 'var(--white)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {founder.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--electric)',
                    }}
                  >
                    {founder.role}
                  </span>
                </div>
                
                <p
                  style={{
                    color: 'var(--muted)',
                    fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
                    lineHeight: 1.7,
                    maxWidth: '45ch',
                  }}
                >
                  {founder.bio}
                </p>

                {/* Contact detail block */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.8rem', 
                  marginTop: 'auto',
                  alignItems: 'flex-start' // DON'T STRETCH! Keep phone/email narrow
                }}>
                  <a 
                    href={`mailto:${founder.email}`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--white)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      paddingBottom: '0.5rem',
                      width: 'fit-content'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--electric)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--white)'}
                  >
                    {founder.email}
                  </a>
                  <PhoneWithQR 
                    phone={founder.phone} 
                    label={founder.phone} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div
          className="about-divider"
          style={{
            height: '1px',
            background:
              'linear-gradient(90deg, var(--electric), transparent)',
            marginTop: 'clamp(4rem, 8vw, 6rem)',
            opacity: 0.3,
          }}
        />
      </div>
    </section>
  );
}