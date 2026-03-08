'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const ShaderBackground = dynamic(() => import('../components/ShaderBackground'), {
  ssr: false,
});
const CustomCursor = dynamic(() => import('../components/CustomCursor'), {
  ssr: false,
});

export default function PrivacyPolicy() {
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
          OCHRANA OSOBNÝCH ÚDAJOV
        </h1>

        <p style={{ color: 'var(--dim)', fontSize: '0.85rem', marginBottom: '4rem' }}>
          Posledná aktualizácia: 7. marca 2026
        </p>

        {/* --- Content --- */}
        <div className="legal-content" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* 1 */}
          <section>
            <h2 style={sectionTitle}>1. Prevádzkovateľ osobných údajov</h2>
            <div style={sectionBody}>
              <p><strong>Obchodné meno:</strong> Arcigy s. r. o.</p>
              <p><strong>IČO:</strong> 57 503 028</p>
              <p><strong>Kontakt:</strong> hello@arcigy.group</p>
              <p>
                Prevádzkovateľ spracúva osobné údaje v súlade s Nariadením Európskeho parlamentu a Rady (EÚ) 2016/679 o ochrane fyzických osôb pri spracúvaní osobných údajov (GDPR) a zákonom č. 18/2018 Z. z. o ochrane osobných údajov.
              </p>
            </div>
          </section>

          {/* 2 */}
          <section>
            <h2 style={sectionTitle}>2. Aké údaje zbierame</h2>
            <div style={sectionBody}>
              <p>Na webovej stránke arcigy.group môžeme zbierať nasledovné osobné údaje:</p>
              <ul style={listStyle}>
                <li><strong>Kontaktné údaje</strong> — meno, priezvisko, e-mailová adresa, telefónne číslo (poskytnuté cez kontaktný formulár alebo pri objednávke služieb)</li>
                <li><strong>Firemné údaje</strong> — názov spoločnosti, IČO, pozícia v spoločnosti</li>
                <li><strong>Technické údaje</strong> — IP adresa, typ prehliadača, operačný systém, údaje o návšteve stránky (cookies, analytické údaje)</li>
                <li><strong>Komunikačné údaje</strong> — obsah e-mailovej komunikácie a správ odoslaných cez stránku</li>
              </ul>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 style={sectionTitle}>3. Účel a právny základ spracúvania</h2>
            <div style={sectionBody}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Účel</th>
                    <th style={thStyle}>Právny základ</th>
                    <th style={thStyle}>Doba uchovávania</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}>Spracovanie dopytov a objednávok</td>
                    <td style={tdStyle}>Plnenie zmluvy (čl. 6 ods. 1 písm. b) GDPR)</td>
                    <td style={tdStyle}>Po dobu trvania zmluvného vzťahu + 5 rokov</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Zasielanie obchodných oznámení</td>
                    <td style={tdStyle}>Oprávnený záujem (čl. 6 ods. 1 písm. f) GDPR)</td>
                    <td style={tdStyle}>Do odvolania súhlasu</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Analytika návštevnosti stránky</td>
                    <td style={tdStyle}>Súhlas (čl. 6 ods. 1 písm. a) GDPR)</td>
                    <td style={tdStyle}>26 mesiacov</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}>Plnenie zákonných povinností (účtovníctvo)</td>
                    <td style={tdStyle}>Zákonná povinnosť (čl. 6 ods. 1 písm. c) GDPR)</td>
                    <td style={tdStyle}>10 rokov</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 style={sectionTitle}>4. Príjemcovia osobných údajov</h2>
            <div style={sectionBody}>
              <p>Vaše osobné údaje môžu byť sprístupnené nasledovným kategóriám príjemcov:</p>
              <ul style={listStyle}>
                <li>Poskytovatelia IT služieb a hostingu</li>
                <li>Účtovná a právna kancelária</li>
                <li>Poskytovatelia analytických nástrojov (napr. Google Analytics)</li>
                <li>Orgány verejnej moci v prípadoch stanovených zákonom</li>
              </ul>
              <p>
                Osobné údaje nie sú prenášané do tretích krajín mimo EÚ/EHP, pokiaľ príjemca nezaručuje primeranú úroveň ochrany (napr. rozhodnutie Európskej komisie o primeranosti).
              </p>
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 style={sectionTitle}>5. Vaše práva</h2>
            <div style={sectionBody}>
              <p>V súvislosti so spracúvaním vašich osobných údajov máte nasledovné práva:</p>
              <ul style={listStyle}>
                <li><strong>Právo na prístup</strong> — máte právo získať potvrdenie o tom, či sa vaše údaje spracúvajú, a prístup k nim</li>
                <li><strong>Právo na opravu</strong> — máte právo na opravu nesprávnych alebo neúplných údajov</li>
                <li><strong>Právo na vymazanie</strong> — máte právo požiadať o vymazanie údajov, ak pominul účel ich spracovania</li>
                <li><strong>Právo na obmedzenie spracúvania</strong> — máte právo požiadať o dočasné obmedzenie spracovania</li>
                <li><strong>Právo na prenosnosť údajov</strong> — máte právo získať svoje údaje v štruktúrovanom formáte</li>
                <li><strong>Právo namietať</strong> — máte právo namietať proti spracovaniu na základe oprávneného záujmu</li>
                <li><strong>Právo odvolať súhlas</strong> — ak je spracúvanie založené na súhlase, máte právo tento súhlas kedykoľvek odvolať</li>
              </ul>
              <p>
                Svoje práva si môžete uplatniť zaslaním žiadosti na e-mailovú adresu <strong style={{ color: 'var(--white)' }}>hello@arcigy.group</strong>. Na vašu žiadosť odpovieme najneskôr do 30 dní.
              </p>
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 style={sectionTitle}>6. Cookies</h2>
            <div style={sectionBody}>
              <p>
                Webová stránka arcigy.group používa cookies — malé textové súbory uložené vo vašom prehliadači. Cookies nám pomáhajú analyzovať návštevnosť a zlepšovať fungovanie stránky.
              </p>
              <p><strong>Typy cookies, ktoré môžeme používať:</strong></p>
              <ul style={listStyle}>
                <li><strong>Nevyhnutné cookies</strong> — potrebné na fungovanie stránky (bez súhlasu)</li>
                <li><strong>Analytické cookies</strong> — pomáhajú pochopiť správanie návštevníkov (vyžadujú súhlas)</li>
              </ul>
              <p>
                Nastavenie cookies môžete kedykoľvek zmeniť vo svojom prehliadači. Blokovanie niektorých cookies môže ovplyvniť fungovanie stránky.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section>
            <h2 style={sectionTitle}>7. Podávanie sťažností</h2>
            <div style={sectionBody}>
              <p>
                Ak sa domnievate, že spracúvanie vašich osobných údajov je v rozpore s platnými predpismi, máte právo podať sťažnosť na dozorný orgán:
              </p>
              <p>
                <strong>Úrad na ochranu osobných údajov Slovenskej republiky</strong><br />
                Hraničná 12, 820 07 Bratislava 27<br />
                Web: <a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--electric)', textDecoration: 'none' }}>dataprotection.gov.sk</a>
              </p>
            </div>
          </section>

          {/* 8 */}
          <section>
            <h2 style={sectionTitle}>8. Záverečné ustanovenia</h2>
            <div style={sectionBody}>
              <p>
                Tieto zásady ochrany osobných údajov sú platné a účinné od ich zverejnenia na webovej stránke arcigy.group. Prevádzkovateľ si vyhradzuje právo tieto zásady kedykoľvek aktualizovať. O zmenách budete informovaní prostredníctvom webovej stránky.
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

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.9rem',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.75rem 1rem',
  borderBottom: '1px solid rgba(168,85,247,0.3)',
  color: 'var(--electric)',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontWeight: 500,
};

const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  verticalAlign: 'top',
  color: 'var(--muted)',
  fontSize: '0.85rem',
  lineHeight: 1.6,
};
