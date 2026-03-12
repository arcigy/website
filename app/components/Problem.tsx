'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const PAIN_POINTS = [
  {
    title: 'NEKONEČNÉ "COPY-PASTE" MEDZI SYSTÉMAMI',
    desc: 'Manuálne prepisovanie údajov z e-mailov do CRM, z tabuliek do fakturačného systému alebo medzi e-shopom a skladom. Táto mechanická práca nielenže brzdí váš rast, ale vytvára zbytočné chyby, ktoré vás stoja peniaze. My tieto mosty postavíme za vás – automaticky a bez chýb.',
  },
  {
    title: 'PODPORA ODPOVEDÁ DOKOLA NA TO ISTÉ',
    desc: 'Vaši zamestnanci trávia hodiny odpovedaním na tie isté otázky o stave objednávky, dostupnosti tovaru alebo termínoch. AI agent vybaví 80 % týchto dopytov okamžite, 24/7 a v akomkoľvek jazyku. Váš tím sa tak môže konečne venovať predaju a riešeniu skutočne dôležitých prípadov.',
  },
  {
    title: 'ZABITÝ PONDELOK TVORBOU REPORTOV',
    desc: 'Zbieranie dát z piatich rôznych zdrojov, ich čistenie a lepenie do prezentácie na poradu. Tento proces, ktorý vám zaberá celé doobedie, vieme skrátiť na nula sekúnd. Report s kľúčovými číslami vás bude čakať v e-maile alebo na Slacku každé pondelok ráno, úplne sám.',
  },
  {
    title: 'CHAOS V DOKUMENTOCH A SCHVAĽOVANÍ',
    desc: 'Hľadanie „tej poslednej verzie“ zmluvy v neprehľadných priečinkoch alebo čakanie dni na schválenie banálnej požiadavky. Nastavíme inteligentné workflow, ktoré za vás postráži termíny, automaticky roztriedi dokumenty a upozorní kompetentných ľudí presne vtedy, keď majú niečo urobiť.',
  },
  {
    title: 'CÍTITE, ŽE VÁM AI VLAK UTREKÁ, ALE NEVIETE KDE ZAČAŤ',
    desc: 'Trh je zaplavený nástrojmi, ale vy potrebujete funkčné riešenie, nie ďalšie predplatné. Nemusíte rozumieť technológii, stačí vedieť, kde vás procesy bolia. My prídeme, zanalyzujeme vašu firmu a nasadíme len to, čo vám reálne prinesie zisk alebo úsporu času.',
  },
];

function ProblemAccordionItem({
  item,
}: {
  item: (typeof PAIN_POINTS)[0];
}) {
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
          {item.title}
        </h3>
        <div
          className="problem-plus-trigger"
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
              {item.desc}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Problem() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.problem-headline', {
        scrollTrigger: {
          trigger: '.problem-headline',
          start: 'top 85%',
        },
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'expo.out',
      });

      gsap.from('.pain-list-wrap', {
        scrollTrigger: {
          trigger: '.pain-list-wrap',
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
      id="problem"
      style={{
        padding: 'clamp(6rem, 10vw, 10rem) clamp(2rem, 8vw, 10rem)',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Headline */}
        <div className="problem-headline" style={{ marginBottom: '4rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
            }}
          >
            POZNÁŠ NIEKTORÝ
            <br />
            Z TÝCHTO{' '}
            <span style={{ color: 'var(--electric)' }}>PROBLÉMOV?</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="pain-list-wrap">
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {PAIN_POINTS.map((point, i) => (
              <ProblemAccordionItem key={i} item={point} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
