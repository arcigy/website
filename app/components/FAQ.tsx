'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: 'Máme špecifický biznis, u nás sa to nedá.',
    a: 'Váš biznis je unikátny vďaka vášmu know-how a vzťahom. Ale je unikátne aj manuálne prepisovanie faktúr alebo kopírovanie dát? My automatizujeme operatívu, aby ste vy mali viac času na to, v čom ste skutočne jedineční.',
  },
  {
    q: 'Už sme skúšali ChatGPT a nefungovalo to.',
    a: 'ChatGPT je len motor. My vám nestaviame četovacie okno, ale kompletné workflowy prepojené na vaše reálne firemné dáta. Rozdiel je v tom, že naše riešenia reálne vykonávajú prácu, nielen generujú texty.',
  },
  {
    q: 'Sú naše dáta v bezpečí?',
    a: 'Áno. Používame profesionálne API rozhrania a šifrované prenosy. Vaše citlivé údaje sa nikdy nepoužívajú na trénovanie verejných modelov. Dáta spracujeme bezpečne a izolujeme ich tak, aby slúžili výhradne vašej firme.',
  },
  {
    q: 'Je to príliš drahé / nemáme na to budget.',
    a: 'Automatizácia nie je náklad, ale investícia s jasnou návratnosťou. Naše riešenia stoja zlomok platu jedného zamestnanca, ale pracujú 24/7. Ak vám naše riešenia neušetria viac, než stoja, tak sme neurobili svoju prácu dobre.',
  },
  {
    q: 'Sme príliš malá firma, pomôže to?',
    a: 'Práve malé tímy získavajú najviac. Automatizácia vám dodá silu 10-členného oddelenia bez toho, aby ste museli priberať nových ľudí. Pomer manuálnych úloh voči kapacite tímu je u vás kritický – my ho vynulujeme.',
  },
  {
    q: 'Nemáme IT oddelenie. Kto to bude obsluhovať?',
    a: 'Väčšina našich riešení nevyžaduje žiadne technické znalosti. Navrhujeme ich formou „no-code“, aby ich vedel ovládať bežný zamestnanec. Celú technickú časť a údržbu držíme na našich pleciach my.',
  },
];

function FAQItem({ item }: { item: (typeof FAQS)[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="group"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          padding: '2rem 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            lineHeight: 1.1,
            letterSpacing: '0.01em',
            color: isOpen ? 'var(--electric)' : 'var(--white)',
            transition: 'color 0.4s cubic-bezier(0.23,1,0.32,1)',
          }}
        >
          {item.q}
        </h3>
        <div
          className="faq-plus-trigger"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '5.5rem',
            height: '5.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            cursor: 'none',
            flexShrink: 0,
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            style={{
              color: 'var(--white)',
              fontSize: '1.8rem',
              fontWeight: 300,
              display: 'block',
              lineHeight: 1,
            }}
          >
            +
          </motion.span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <p
              style={{
                paddingBottom: '2rem',
                maxWidth: '55ch',
                color: 'var(--muted)',
                fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
                lineHeight: 1.75,
              }}
            >
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.faq-headline', {
        scrollTrigger: {
          trigger: '.faq-headline',
          start: 'top 85%',
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'expo.out',
      });

      gsap.from('.faq-list-wrap', {
        scrollTrigger: {
          trigger: '.faq-list-wrap',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      style={{
        padding: 'clamp(6rem, 10vw, 10rem) clamp(2rem, 8vw, 10rem)',
        borderTop: '1px solid var(--border)',
        background: 'var(--bg)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="faq-headline" style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6vw, 6rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              color: 'var(--white)',
            }}
          >
            ČASTÉ <br />
            OTÁZKY <span style={{ color: 'var(--electric)' }}>& MÝTY</span>
          </h2>
        </div>

        <div className="faq-list-wrap">
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {FAQS.map((faq, i) => (
              <FAQItem key={i} item={faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}