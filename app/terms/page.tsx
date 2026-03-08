'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const ShaderBackground = dynamic(() => import('../components/ShaderBackground'), {
  ssr: false,
});
const CustomCursor = dynamic(() => import('../components/CustomCursor'), {
  ssr: false,
});

export default function TermsOfService() {
  return (
    <>
      <ShaderBackground />
      <CustomCursor />
      <main
      style={{
        padding: 'clamp(8rem, 14vw, 14rem) clamp(2rem, 8vw, 10rem) clamp(6rem, 10vw, 10rem)',
        background: 'var(--bg)',
        color: 'var(--white)',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Back link */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--dim)',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '3rem',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--electric)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--dim)')}
        >
          ← Späť na hlavnú stránku
        </Link>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
          }}
        >
          OBCHODNÉ PODMIENKY
        </h1>

        <p style={{ color: 'var(--dim)', fontSize: '0.85rem', marginBottom: '4rem' }}>
          Posledná aktualizácia: 7. marca 2026
        </p>

        {/* --- Content --- */}
        <div className="legal-content" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* 1 */}
          <section>
            <h2 style={sectionTitle}>1. Identifikácia prevádzkovateľa</h2>
            <div style={sectionBody}>
              <p><strong>Obchodné meno:</strong> Arcigy s. r. o.</p>
              <p><strong>Sídlo:</strong> Slovenská republika</p>
              <p><strong>IČO:</strong> 57 503 028</p>
              <p><strong>Kontakt:</strong> hello@arcigy.group</p>
              <p>
                Spoločnosť je zapísaná v Obchodnom registri Slovenskej republiky.
              </p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 style={sectionTitle}>2. Úvodné ustanovenia</h2>
            <div style={sectionBody}>
              <p>
                Tieto Obchodné podmienky (ďalej len &quot;OP&quot;) upravujú práva a povinnosti medzi spoločnosťou Arcigy s. r. o. (ďalej len &quot;Poskytovateľ&quot;) a fyzickou alebo právnickou osobou, ktorá využíva služby Poskytovateľa (ďalej len &quot;Klient&quot;).
              </p>
              <p>
                Odoslaním objednávky, podpísaním zmluvy alebo vyplnením kontaktného formulára na webovej stránke arcigy.group Klient vyjadruje súhlas s týmito OP.
              </p>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 style={sectionTitle}>3. Predmet služieb</h2>
            <div style={sectionBody}>
              <p>Poskytovateľ poskytuje najmä nasledovné služby:</p>
              <ul style={listStyle}>
                <li>AI Audit — analýza firemných procesov a identifikácia príležitostí na automatizáciu</li>
                <li>Návrh a implementácia automatizačných riešení s využitím umelej inteligencie</li>
                <li>Konzultácie a poradenstvo v oblasti AI a automatizácie</li>
                <li>Zaškolenie a technická podpora po implementácii</li>
              </ul>
              <p>
                Konkrétny rozsah služieb je vždy definovaný v individuálnej ponuke alebo zmluve medzi Poskytovateľom a Klientom.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 style={sectionTitle}>4. Objednávka a vznik zmluvného vzťahu</h2>
            <div style={sectionBody}>
              <p>
                Zmluvný vzťah medzi Poskytovateľom a Klientom vzniká na základe písomnej objednávky potvrdenej Poskytovateľom, podpísanej zmluvy o poskytovaní služieb, alebo obojstranného potvrdenia rozsahu prác prostredníctvom e-mailovej komunikácie.
              </p>
              <p>
                Úvodný 15-minútový hovor je nezáväzný a neslúži ako objednávka služieb.
              </p>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 style={sectionTitle}>5. Ceny a platobné podmienky</h2>
            <div style={sectionBody}>
              <p>
                Cena za služby je stanovená individuálne na základe rozsahu a náročnosti prác. Všetky ceny sú uvádzané bez DPH, pokiaľ nie je uvedené inak.
              </p>
              <p>
                Platba prebieha na základe vystavenej faktúry so splatnosťou 14 dní odo dňa vystavenia, pokiaľ nie je dohodnuté inak. V prípade omeškania s platbou si Poskytovateľ vyhradzuje právo účtovať úrok z omeškania vo výške 0,05 % z dlžnej sumy za každý deň omeškania.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 style={sectionTitle}>6. Práva a povinnosti zmluvných strán</h2>
            <div style={sectionBody}>
              <p><strong>Poskytovateľ sa zaväzuje:</strong></p>
              <ul style={listStyle}>
                <li>Poskytnúť služby odborne, včas a v dohodnutom rozsahu</li>
                <li>Zachovávať mlčanlivosť o všetkých dôverných informáciách Klienta</li>
                <li>Informovať Klienta o priebehu realizácie</li>
              </ul>
              <p style={{ marginTop: '1.25rem' }}><strong>Klient sa zaväzuje:</strong></p>
              <ul style={listStyle}>
                <li>Poskytnúť Poskytovateľovi potrebnú súčinnosť a prístupy</li>
                <li>Uhradiť dohodnutú cenu za služby v stanovenej lehote</li>
                <li>Poskytnúť pravdivé a úplné informácie relevantné pre poskytovanie služieb</li>
              </ul>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 style={sectionTitle}>7. Zodpovednosť a obmedzenie záruk</h2>
            <div style={sectionBody}>
              <p>
                Poskytovateľ nezaručuje konkrétne obchodné výsledky plynúce z implementácie navrhnutých riešení. Odhady úspor a návratnosti uvedené v rámci auditu majú informatívny charakter.
              </p>
              <p>
                Celková zodpovednosť Poskytovateľa za škodu je obmedzená výškou ceny zaplatenej Klientom za konkrétnu službu, z ktorej škoda vznikla.
              </p>
            </div>
          </section>

          {/* 8 */}
          <section>
            <h2 style={sectionTitle}>8. Odstúpenie od zmluvy</h2>
            <div style={sectionBody}>
              <p>
                Ktorákoľvek zmluvná strana môže odstúpiť od zmluvy písomným oznámením druhej strane s výpovednou lehotou 14 dní. V prípade odstúpenia je Klient povinný uhradiť cenu za služby, ktoré boli do dňa odstúpenia reálne poskytnuté.
              </p>
            </div>
          </section>

          {/* 9 */}
          <section>
            <h2 style={sectionTitle}>9. Záverečné ustanovenia</h2>
            <div style={sectionBody}>
              <p>
                Tieto OP sa riadia právnym poriadkom Slovenskej republiky. Akékoľvek spory vzniknuté v súvislosti s poskytovaním služieb budú riešené prednostne dohodou a v prípade neúspechu príslušným súdom Slovenskej republiky.
              </p>
              <p>
                Poskytovateľ si vyhradzuje právo tieto OP kedykoľvek zmeniť. Aktuálna verzia je vždy dostupná na webovej stránke arcigy.group.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
    </>
  );
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
  letterSpacing: '0.02em',
  color: 'var(--white)',
  marginBottom: '1.25rem',
  lineHeight: 1.2,
};

const sectionBody: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  color: 'var(--muted)',
  fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
  lineHeight: 1.75,
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};
