'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Nav from './components/Nav';
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
import FloatingScrollbar from './components/FloatingScrollbar';

// Load WebGL canvas and cursor only on client side
const ShaderBackground = dynamic(() => import('./components/ShaderBackground'), {
  ssr: false,
});
const CustomCursor = dynamic(() => import('./components/CustomCursor'), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <ShaderBackground />
      <CustomCursor />
      <FloatingScrollbar />
      <Suspense fallback={null}>
        <Nav />
      </Suspense>
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
