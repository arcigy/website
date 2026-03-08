'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ShowcasePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home with the demo parameter
    router.replace('/?demo=active');
  }, [router]);

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      background: 'var(--bg)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: 'var(--white)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.8rem',
      letterSpacing: '0.2em'
    }}>
      INICIALIZUJEM SHOWCASE...
    </div>
  );
}
