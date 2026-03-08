'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ShaderBackground = dynamic(() => import('../components/ShaderBackground'), { ssr: false });
const CustomCursor = dynamic(() => import('../components/CustomCursor'), { ssr: false });

type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'radio';

interface FieldOption {
  label: string;
  value: string;
}

interface Field {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  required?: boolean;
  helpText?: string;
}

interface Step {
  id: number;
  title: string;
  subtitle: string;
  fields: Field[];
}

const steps: Step[] = [
  {
    id: 1,
    title: "Základy",
    subtitle: "Kto ste a čomu sa venujete?",
    fields: [
      { id: 'name', label: 'Meno a priezvisko', type: 'text', placeholder: 'Ján Novák', required: true },
      { id: 'email', label: 'Pracovný e-mail', type: 'email', placeholder: 'jan@firma.sk', required: true },
      { id: 'phone', label: 'Telefónne číslo', type: 'tel', placeholder: '+421', required: true },
      { id: 'company', label: 'Názov firmy', type: 'text', placeholder: 'Novák s.r.o.', required: true },
      { id: 'industry', label: 'Odvetvie', type: 'text', placeholder: 'Napr. Reality, E-shop, Účtovníctvo...', required: true },
      { 
        id: 'teamSize', 
        label: 'Koľko ľudí pracuje vo firme?', 
        type: 'radio', 
        required: true,
        options: [
          { label: 'Iba ja', value: '1' },
          { label: '2 - 5', value: '2-5' },
          { label: '6 - 15', value: '6-15' },
          { label: '16 - 50', value: '16-50' },
          { label: '50+', value: '50+' },
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Čo robíte",
    subtitle: "Povedzte nám viac o vašom biznise.",
    fields: [
      { id: 'whatYouSell', label: 'Jednou vetou, čo vaša firma predáva?', type: 'textarea', placeholder: 'Pomáhame firmám s...', required: false, helpText: 'Nemusí to byť dokonalé, len pre pochopenie podstaty.' },
      { id: 'typicalCustomer', label: 'Kto je váš typický zákazník?', type: 'textarea', placeholder: 'Majitelia malých firiem s 5-20 zamestnancami...', required: false },
      { 
        id: 'customerSource', 
        label: 'Ako vás nájde väčšina zákazníkov?', 
        type: 'radio', 
        required: false,
        options: [
          { label: 'Odporúčania / Word of mouth', value: 'word_of_mouth' },
          { label: 'Google vyhľadávanie / SEO', value: 'seo' },
          { label: 'Sociálne siete (organické)', value: 'social_organic' },
          { label: 'Platená reklama', value: 'ads' },
          { label: 'Cold outreach', value: 'outreach' },
          { label: 'Eventy / Networking', value: 'events' },
          { label: 'Iné', value: 'other' },
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Čas zakladateľa",
    subtitle: "Kde strácate najviac energie?",
    fields: [
      { id: 'founderTasks', label: 'Aké sú 3 hlavné úlohy, ktoré vám každý týždeň zaberajú najviac času?', type: 'textarea', placeholder: 'Ktoré činnosti by ste najradšej nerobili?', required: false },
      { id: 'magicWand', label: 'Keby ste mali čarovný prútik a získať späť 10 hodín týždenne, ktorú úlohu by ste zrušili prvú?', type: 'textarea', placeholder: 'Tá jedna vec, ktorá všetko zmení...', required: false },
    ]
  },
  {
    id: 4,
    title: "Marketing",
    subtitle: "Ako získavate pozornosť.",
    fields: [
      { id: 'marketingChallenge', label: 'Akej najväčšej prekážke čelíte pri získavaní leadov?', type: 'textarea', placeholder: 'Napr., "Tvorba obsahu trvá večnosť" alebo "Drahá reklama"', required: false },
    ]
  },
  {
    id: 5,
    title: "Predaj",
    subtitle: "Uzátváranie dealov.",
    fields: [
      { 
        id: 'salesTeam', 
        label: 'Ako máte riešený obchodný tím?', 
        type: 'radio', 
        required: false,
        options: [
          { label: 'Iba ja', value: 'only_me' },
          { label: 'Ja + 1-2 ďalší', value: 'me_and_few' },
          { label: 'Dedikovaný obchodník/tím (3+)', value: 'team' },
          { label: 'Nerobíme "sales" (e-shop...)', value: 'no_sales' },
        ]
      },
      { id: 'salesChallenge', label: 'Aká je najväčšia výzva pri uzatváraní obchodov?', type: 'textarea', placeholder: 'Napr., "Nízka konverzia", "Spracovanie ponúk je pomalé"', required: false },
    ]
  },
  {
    id: 6,
    title: "Operatíva",
    subtitle: "Dodanie služby a interné procesy.",
    fields: [
      { id: 'deliveryBottleneck', label: 'Čo je časovo najnáročnejšia časť procesu po tom, ako zákazník povie ÁNO?', type: 'textarea', placeholder: 'Kde sa to spomaľuje a komplikuje?', required: false },
      { id: 'recurringProblem', label: 'Je vo vašej operatíve niečo, čo sa neustále kazí?', type: 'textarea', placeholder: 'Opakujúci sa problém, ktorý neviete eliminovať...', required: false },
    ]
  },
  {
    id: 7,
    title: "Podpora klientov",
    subtitle: "Starostlivosť po predaji.",
    fields: [
      { id: 'supportHeadaches', label: 'Čo vám pri správe klientov spôsobuje najväčšie bolesti hlavy?', type: 'textarea', placeholder: 'Napr. "Stále tie isté otázky dookola" alebo "Zabudnuté follow-upy"', required: false },
    ]
  },
  {
    id: 8,
    title: "Očakávania",
    subtitle: "Prečo sme tu?",
    fields: [
      { 
        id: 'aiExperience', 
        label: 'Skúšali ste už nejaké AI nástroje?', 
        type: 'radio', 
        required: false,
        options: [
          { label: 'Nie, zatiaľ nič', value: 'none' },
          { label: 'Áno, ale neuchytilo sa to', value: 'tried_failed' },
          { label: 'Áno, občasný ChatGPT', value: 'some_usage' },
          { label: 'Áno, sme už celkom AI-zbehlí', value: 'advanced' },
        ]
      },
      { id: 'aiToolsUsed', label: 'Aké nástroje ste skúšali a aká bola skúsenosť?', type: 'textarea', placeholder: '...', required: false },
      { id: 'successDefinition', label: 'Ak nájdeme pri audite pre vás to pravé, ako vyzerá úspech?', type: 'textarea', placeholder: 'Napr. "Ušetrím si 10 hod. na administratíve"', required: false },
      { id: 'specificFocus', label: 'Mám sa počas auditu zamerať na niečo extrémne špecifické?', type: 'textarea', placeholder: 'Napr. Váš aktuálny CRM systém, fakturácie...', required: false },
    ]
  }
];

export default function Formular() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const activeStep = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/[^0-9+]/g, '');
    return cleaned.length >= 9;
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    activeStep.fields.forEach(field => {
      const val = formData[field.id] || '';
      
      if (field.required && !val.trim()) {
        newErrors[field.id] = 'Toto pole je povinné';
        isValid = false;
      }
      
      if (field.type === 'email' && val.trim() && !validateEmail(val)) {
        newErrors[field.id] = 'Neplatný e-mail';
        isValid = false;
      }
      
      if (field.type === 'tel' && val.trim() && !validatePhone(val)) {
        newErrors[field.id] = 'Neplatné číslo';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        console.error('Submission failed');
        alert('Ospravedlňujeme sa, ale niečo sa pokazilo. Skúste to prosím znova o chvíľu.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Chyba pripojenia. Skúste to prosím znova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() !== 'textarea') {
        e.preventDefault();
        if (isLastStep) handleSubmit();
        else handleNext();
      }
    }
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#06000a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem'
      }}>
        <ShaderBackground />
        <CustomCursor />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '600px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem auto',
            boxShadow: '0 0 40px rgba(34,197,94,0.2)'
          }}>
            <Check size={48} color="#4ade80" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', marginBottom: '1rem', letterSpacing: '2px' }}>
            MÁME TO.
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: 1.6 }}>
            Dáta sme bezpečne uložili. Na základe týchto informácií vypracujeme presný audit, z ktorého padnete na zadok. Uvidíme sa na hovore.
          </p>
          <Link 
            href="/"
            role="button"
            style={{
              display: 'inline-block',
              padding: '1rem 3rem',
              borderRadius: '50px',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '1rem',
              backgroundColor: 'var(--electric)',
              color: '#fff',
              textDecoration: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 20px var(--glow-electric)',
              transition: 'all 0.3s ease'
             }}
          >
            VRÁTIŤ SA DOMOV
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#06000a',
      color: '#fff',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      paddingBottom: '150px',
      overflowY: 'auto' // Ensure scrolling is possible
    }}>
      <CustomCursor />
      
      {/* Top Progress Bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.05)', zIndex: 100 }}>
        <motion.div 
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ ease: "circOut", duration: 0.5 }}
          style={{
            height: '100%',
            backgroundColor: 'var(--electric)',
            boxShadow: '0 0 20px var(--glow-electric)'
          }}
        />
      </div>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '5rem 2rem 2rem 2rem',
        position: 'relative',
        zIndex: 10 
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--electric)', lineHeight: 1 }}>
            {String(currentStep + 1).padStart(2, '0')}
          </div>
          <div style={{ height: '2px', width: '3rem', backgroundColor: 'var(--border)' }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1 }}>
            {String(steps.length).padStart(2, '0')}
          </div>
        </div>

        <div style={{ 
          position: 'relative', 
          width: '100%', 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'center',
          perspective: '1200px',
          padding: '2rem 0',
          minHeight: '600px' // Minimum height to prevent collapse during transition
        }}>
          <AnimatePresence mode="popLayout">
            {steps.map((step, idx) => {
              // Calculate positional offset
              const offset = idx - currentStep;
              
              // Only render the current, immediate left, and immediate right for performance
              // You can expand this if you want >3 columns visible
              if (Math.abs(offset) > 1 && idx !== steps.length - 1 && idx !== 0 && offset !== 0) return null;

              // Base styling formulas based on distance from center
              const isCenter = offset === 0;
              const isLeft = offset < 0;
              
              const xPos = isCenter ? '0%' : isLeft ? '-120%' : '120%'; 
              const scale = isCenter ? 1 : 0.85; 
              const opacity = isCenter ? 1 : 0.25; 
              const zIndex = isCenter ? 50 : 10;
              const blur = isCenter ? 'blur(0px)' : 'blur(4px)'; 

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: offset > 0 ? '100%' : '-100%' }}
                  animate={{ 
                    opacity, 
                    x: xPos, 
                    scale, 
                    rotateY: isCenter ? 0 : isLeft ? 5 : -5, 
                    skewY: 0, // Remove skew for readability
                    filter: blur,
                    zIndex 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 250, 
                    damping: 25, 
                    mass: 0.8 
                  }}
                  style={{ 
                    position: isCenter ? 'relative' : 'absolute', // Relative for center to push container height
                    width: '100%',
                    maxWidth: '800px',
                    pointerEvents: isCenter ? 'auto' : 'none',
                    backgroundColor: isCenter ? 'transparent' : 'rgba(255,255,255,0.02)',
                    padding: '2rem',
                    borderRadius: '24px',
                    border: isCenter ? 'none' : '1px solid rgba(255,255,255,0.05)',
                    visibility: Math.abs(offset) > 1 ? 'hidden' : 'visible'
                  }}
                  onKeyDown={handleKeyDown}
                >
                  <h2 style={{ 
                    fontFamily: 'var(--font-display)', 
                    fontSize: '4.5rem', 
                    lineHeight: 0.9,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '1rem',
                  }}>
                    {step.title}
                  </h2>
                  <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '4rem' }}>
                    {step.subtitle}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {step.fields.map((field) => (
                      <div key={field.id} style={{ position: 'relative' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                          <label style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--white)' }}>
                            {field.label}
                          </label>
                          {field.required && <span style={{ color: 'var(--neon)', fontSize: '1.5rem', lineHeight: 1 }}>*</span>}
                        </div>
                        
                        {field.helpText && (
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic' }}>
                            {field.helpText}
                          </p>
                        )}

                        {/* Text/Email/Tel Inputs - Brutalist underline style */}
                        {(field.type === 'text' || field.type === 'email' || field.type === 'tel') && (
                          <input
                            type={field.type}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            tabIndex={isCenter ? 0 : -1} // Only focusable if center
                            style={{
                              width: '100%',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderBottom: `2px solid ${errors[field.id] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                              padding: '1rem 0',
                              fontSize: '2rem',
                              fontFamily: 'var(--font-display)',
                              letterSpacing: '1px',
                              color: 'var(--white)',
                              outline: 'none',
                              transition: 'border-color 0.3s'
                            }}
                            onFocus={(e) => isCenter && (e.target.style.borderBottomColor = 'var(--electric)')}
                            onBlur={(e) => isCenter && (e.target.style.borderBottomColor = errors[field.id] ? '#ef4444' : 'rgba(255,255,255,0.1)')}
                          />
                        )}

                        {/* Textarea - Glassmorphic box */}
                        {field.type === 'textarea' && (
                          <textarea
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            rows={4}
                            tabIndex={isCenter ? 0 : -1}
                            style={{
                              width: '100%',
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              border: `1px solid ${errors[field.id] ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                              borderRadius: '16px',
                              padding: '1.5rem',
                              fontSize: '1.1rem',
                              fontFamily: 'var(--font-body)',
                              color: 'var(--white)',
                              outline: 'none',
                              resize: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onFocus={(e) => {
                              if(!isCenter) return;
                              e.target.style.borderColor = 'var(--electric)';
                              e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                              e.target.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.1)';
                            }}
                            onBlur={(e) => {
                              if(!isCenter) return;
                              e.target.style.borderColor = errors[field.id] ? '#ef4444' : 'rgba(255,255,255,0.1)';
                              e.target.style.backgroundColor = 'rgba(255,255,255,0.03)';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        )}

                        {/* Radio Buttons - Grid of huge selectable blocks */}
                        {field.type === 'radio' && field.options && (
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                            gap: '1rem' 
                          }}>
                            {field.options.map((opt) => {
                              const isSelected = formData[field.id] === opt.value;
                              return (
                                <label 
                                  key={opt.value}
                                  role="button"
                                  style={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1.5rem',
                                    cursor: isCenter ? 'pointer' : 'default',
                                    borderRadius: '16px',
                                    border: `1px solid ${isSelected ? 'var(--electric)' : 'rgba(255,255,255,0.08)'}`,
                                    backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.08)' : 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.3s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!isSelected && isCenter) {
                                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected && isCenter) {
                                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                    }
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={field.id}
                                    value={opt.value}
                                    checked={isSelected}
                                    onChange={() => isCenter && handleInputChange(field.id, opt.value)}
                                    tabIndex={isCenter ? 0 : -1}
                                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                  />
                                  
                                  {/* Custom dot indicator */}
                                  <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: `2px solid ${isSelected ? 'var(--electric)' : 'rgba(255,255,255,0.2)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '1rem',
                                    flexShrink: 0
                                  }}>
                                    {isSelected && (
                                      <motion.div 
                                        layoutId={isCenter ? `radio-${field.id}` : undefined} // Only animate layout if center
                                        style={{ width: '12px', height: '12px', backgroundColor: 'var(--electric)', borderRadius: '50%', boxShadow: '0 0 10px var(--glow-electric)' }}
                                      />
                                    )}
                                  </div>
                                  
                                  <span style={{ 
                                    fontSize: '1.1rem', 
                                    fontWeight: isSelected ? 600 : 400,
                                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)'
                                  }}>
                                    {opt.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* Error Notification */}
                        <div style={{ height: '24px', marginTop: '0.5rem' }}>
                          <AnimatePresence>
                            {errors[field.id] && isCenter && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                              >
                                <AlertCircle size={16} />
                                {errors[field.id]}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Absolute Bottom Navigation Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(6, 0, 10, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        zIndex: 100,
        padding: '1.5rem 0'
      }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '0 2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          
          <button
            onClick={handlePrev}
            role="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--muted)',
              border: 'none',
              background: 'none',
              cursor: currentStep === 0 || isSubmitting ? 'default' : 'pointer',
              opacity: currentStep === 0 || isSubmitting ? 0 : 1,
              fontFamily: 'var(--font-body)',
              fontSize: '1.1rem',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => {
              if (currentStep !== 0 && !isSubmitting) e.currentTarget.style.color = 'var(--white)';
            }}
            onMouseLeave={(e) => {
              if (currentStep !== 0 && !isSubmitting) e.currentTarget.style.color = 'var(--muted)';
            }}
          >
            <ArrowLeft size={20} />
            Späť
          </button>

          {isLastStep ? (
             <button
               onClick={handleSubmit}
               disabled={isSubmitting}
               role="button"
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.75rem',
                 padding: '1rem 3rem',
                 borderRadius: '50px',
                 backgroundColor: 'var(--electric)',
                 color: '#fff',
                 border: 'none',
                 cursor: isSubmitting ? 'not-allowed' : 'pointer',
                 fontFamily: 'var(--font-body)',
                 fontWeight: 700,
                 fontSize: '1.1rem',
                 boxShadow: '0 0 30px var(--glow-electric)',
                 transition: 'all 0.3s ease',
                 opacity: isSubmitting ? 0.7 : 1,
                 animation: isSubmitting ? 'none' : 'pulse-electric 3s infinite shadow-only' 
               }}
               onMouseEnter={(e) => {
                 if (!isSubmitting) {
                   e.currentTarget.style.transform = 'scale(1.03)';
                   e.currentTarget.style.backgroundColor = 'var(--neon)';
                 }
               }}
               onMouseLeave={(e) => {
                 if (!isSubmitting) {
                   e.currentTarget.style.transform = 'scale(1)';
                   e.currentTarget.style.backgroundColor = 'var(--electric)';
                 }
               }}
             >
               {isSubmitting ? 'ODOSIELAM...' : 'DOKONČIŤ A ODOSLAŤ'}
               {!isSubmitting && <Check size={20} />}
             </button>
          ) : (
            <button
               onClick={handleNext}
               role="button"
               style={{
                 display: 'flex',
                 alignItems: 'center',
                 gap: '0.75rem',
                 padding: '1rem 3rem',
                 borderRadius: '50px',
                 backgroundColor: 'rgba(255,255,255,0.05)',
                 border: '1px solid rgba(255,255,255,0.1)',
                 color: '#fff',
                 cursor: 'pointer',
                 fontFamily: 'var(--font-body)',
                 fontWeight: 600,
                 fontSize: '1.1rem',
                 transition: 'all 0.3s ease',
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = 'var(--electric)';
                 e.currentTarget.style.borderColor = 'var(--electric)';
                 e.currentTarget.style.boxShadow = '0 0 20px var(--glow-electric)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                 e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                 e.currentTarget.style.boxShadow = 'none';
               }}
             >
               ĎALŠÍ KROK
               <ArrowRight size={20} />
             </button>
          )}

        </div>
      </div>

    </div>
  );
}
