'use client';

import Hero from './components/Hero';
import Stats from './components/Stats';
import Problem from './components/Problem';
import Process from './components/Process';
import CaseStudies from './components/CaseStudies';
import AuditSection from './components/AuditSection';
import AboutUs from './components/AboutUs';
import FAQ from './components/FAQ';
import MarqueeBand from './components/MarqueeBand';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <main>
        {/* Sekcia 1 */}
        <Hero />
        
        {/* Sekcia 2 */}
        <Stats />
        

        
        {/* Sekcia 3 */}
        <Problem />
        
        <MarqueeBand />
        
        {/* Sekcia 4 */}
        <Process />
        
        {/* Sekcia 5 */}
        <CaseStudies />
        
        {/* Sekcia 6 */}
        <AuditSection />
        
        {/* Sekcia 7 */}
        <AboutUs />
        
        {/* Sekcia 8 */}
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
