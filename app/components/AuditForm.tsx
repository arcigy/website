'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TEAM_SIZES = ['1-10', '11-50', '51-200', '201-500', '500+'];
const PROCESSES = [
  'Administratíva',
  'Sales / Zákaznícka podpora',
  'Marketing',
  'Operatíva',
  'Vývoj / Produkcia',
  'Iné',
];

export default function AuditForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    teamSize: '',
    processes: [] as string[],
    tool: '',
    acquisition: '',
    salesProcess: '',
    marketing: '',
    salesChannel: '',
    crm: '',
    painPoints: '',
    automateGoals: '',
    support: '',
    expectations: '',
    priorities: '',
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.form-section', {
        scrollTrigger: {
          trigger: '.form-section',
          start: 'top 85%',
        },
        opacity: 0,
        y: 40,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleProcessChange = (proc: string) => {
    setFormData(prev => ({
      ...prev,
      processes: prev.processes.includes(proc)
        ? prev.processes.filter(p => p !== proc)
        : [...prev.processes, proc]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const resp = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (resp.ok) {
        setStatus('success');
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert('Chyba pri odosielaní. Skúste to prosím znova.');
    }
  };

  if (status === 'success') {
    return (
      <section ref={sectionRef} id="audit-form" className="py-24 px-6 min-h-[60vh] flex items-center justify-center" style={{ background: 'rgba(5, 0, 8, 1)' }}>
        <div className="text-center">
          <h2 className="text-6xl font-display text-electric mb-6 animate-pulse">ODOSLANÉ.</h2>
          <p className="text-muted text-xl max-w-md mx-auto">
            Vaša prihláška na AI Audit bola prijatá. Ozveme sa vám čoskoro s návrhom termínu úvodného hovoru.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="audit-form"
      className="relative py-24 px-6 overflow-hidden border-t border-white/10"
      style={{ background: 'rgba(5, 0, 8, 1)' }}
    >
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-px bg-electric" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-electric">Audit prihláška</span>
          </div>
          <h2 className="text-5xl md:text-7xl font-display leading-[0.85] mb-8">
            PRIPRAVIŤ FIRMU <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-electric to-magenta-400">NA BUDÚCNOSŤ.</span>
          </h2>
          <p className="text-muted text-lg max-w-2xl">
            Vyplňte tento hĺbkový dotazník. Čím viac detailov nám poskytnete, tým presnejšiu diagnózu vášho potenciálu pre AI vieme pripraviť ešte pred prvým hovorom.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-20">
          {/* Section 1: Základy */}
          <div className="form-section space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-electric font-mono text-lg">01.</span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Základy</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-dim tracking-widest">Meno a priezvisko</label>
                <input required type="text" placeholder="Jozef Mrkva" className="audit-input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-dim tracking-widest">Váš email</label>
                <input required type="email" placeholder="jozef@firma.sk" className="audit-input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-dim tracking-widest">Váš telefón</label>
                <input required type="tel" placeholder="+421 ..." className="audit-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-dim tracking-widest">Webstránka / LinkedIn firmy</label>
                <input required type="url" placeholder="https://..." className="audit-input" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-sm font-semibold text-muted">Aká je veľkosť vašej spoločnosti/tímu?</label>
              <div className="flex flex-wrap gap-3">
                {TEAM_SIZES.map(size => (
                  <label key={size} className="cursor-pointer group">
                    <input type="radio" name="team_size" value={size} className="hidden peer" checked={formData.teamSize === size} onChange={() => setFormData({...formData, teamSize: size})} />
                    <div className="px-6 py-2 border border-white/10 bg-white/5 peer-checked:border-electric peer-checked:bg-electric/10 transition-all duration-300 group-hover:bg-white/10 uppercase font-mono text-xs">
                      {size}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Aktuálne fungovanie */}
          <div className="form-section space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-electric font-mono text-lg">02.</span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Aktuálne fungovanie</h3>
            </div>

            <div className="space-y-6">
              <label className="text-sm font-semibold text-muted">Ktoré z týchto procesov v súčasnosti vykonávate?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PROCESSES.map(proc => (
                  <label key={proc} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" name="processes" value={proc} className="audit-checkbox" checked={formData.processes.includes(proc)} onChange={() => handleProcessChange(proc)} />
                    <span className="text-dim group-hover:text-white transition-colors text-sm">{proc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Ktorý nástroj používate vo firme najviac?</label>
              <input type="text" placeholder="napr. Slack, Excel, SAP, Hubspot..." className="audit-input" value={formData.tool} onChange={(e) => setFormData({...formData, tool: e.target.value})} />
            </div>
          </div>

          {/* Section 3: Obchod / Sales */}
          <div className="form-section space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-electric font-mono text-lg">03.</span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Obchod / Sales</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Kde získavate potenciálnych klientov?</label>
              <textarea placeholder="Popíšte vaše akvizičné kanály..." className="audit-textarea" rows={3} value={formData.acquisition} onChange={(e) => setFormData({...formData, acquisition: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Máte nastavený proces pre sledovanie obchodných príležitostí?</label>
              <textarea placeholder="Áno / Nie / Ako to funguje?" className="audit-textarea" rows={2} value={formData.salesProcess} onChange={(e) => setFormData({...formData, salesProcess: e.target.value})} />
            </div>
          </div>

          {/* Section 4: Generovanie obsahu */}
          <div className="form-section space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-electric font-mono text-lg">04.</span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Generovanie obsahu a marketing</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Máte dedikovaný marketingový tím?</label>
              <input type="text" placeholder="Interný tím / Externá agentúra / Freelancer" className="audit-input" value={formData.marketing} onChange={(e) => setFormData({...formData, marketing: e.target.value})} />
            </div>
          </div>

          {/* Section 5: Predaj */}
          <div className="form-section space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-electric font-mono text-lg">05.</span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Predaj</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Aký je váš primárny kanál na získavanie zákazníkov?</label>
              <input type="text" placeholder="Ads / Referencie / Cold calling..." className="audit-input" value={formData.salesChannel} onChange={(e) => setFormData({...formData, salesChannel: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Používate CRM? Ak áno, aké?</label>
              <input type="text" placeholder="Pipedrive, Salesforce, vlastné riešenie..." className="audit-input" value={formData.crm} onChange={(e) => setFormData({...formData, crm: e.target.value})} />
            </div>
          </div>

          {/* Section 6: Administratíva */}
          <div className="form-section space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-electric font-mono text-lg">06.</span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Administratíva / Operatíva</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Ktoré administratívne úlohy vám zaberajú najviac času?</label>
              <textarea placeholder="Fakturácia, nahadzovanie dát, reporting..." className="audit-textarea" rows={3} value={formData.painPoints} onChange={(e) => setFormData({...formData, painPoints: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Aké rutinné činnosti by ste radi automatizovali?</label>
              <textarea placeholder="Napr. spracovanie objednávok, extrakcia dát z dokumentov..." className="audit-textarea" rows={3} value={formData.automateGoals} onChange={(e) => setFormData({...formData, automateGoals: e.target.value})} />
            </div>
          </div>

          {/* Section 7: Support */}
          <div className="form-section space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-electric font-mono text-lg">07.</span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Podpora</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Ako sa riešia požiadavky zákazníkov?</label>
              <textarea placeholder="Emailom, telefonicky, ticketing system..." className="audit-textarea" rows={3} value={formData.support} onChange={(e) => setFormData({...formData, support: e.target.value})} />
            </div>
          </div>

          {/* Section 8: Očakávania */}
          <div className="form-section space-y-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-electric font-mono text-lg">08.</span>
              <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Očakávania</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Čo očakávate od implementácie AI?</label>
              <textarea placeholder="Zníženie nákladov, vyššia rýchlosť, lepšia kvalita..." className="audit-textarea" rows={3} value={formData.expectations} onChange={(e) => setFormData({...formData, expectations: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-dim tracking-widest">Ktoré sú vaše tri najdôležitejšie priority pre nasledujúcich 12 mesiacov?</label>
              <textarea placeholder="1. ... 2. ... 3. ..." className="audit-textarea" rows={4} value={formData.priorities} onChange={(e) => setFormData({...formData, priorities: e.target.value})} />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-6 bg-electric hover:bg-violet-600 text-white font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-3">
              {status === 'loading' ? 'Odosielam...' : 'Odoslať dopyt na Audit'}
              <span className={`${status === 'loading' ? 'animate-spin' : 'group-hover:translate-x-2'} transition-transform duration-300`}>
                {status === 'loading' ? '◌' : '→'}
              </span>
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
