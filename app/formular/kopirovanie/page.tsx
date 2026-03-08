'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Copy, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function CopyPageContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const encoded = searchParams.get('data');
    if (encoded) {
      try {
        const decoded = atob(decodeURIComponent(encoded));
        setData(decoded);
      } catch (e) {
        console.error('Failed to decode data', e);
        setData('Chyba pri načítaní dát.');
      }
    }
  }, [searchParams]);

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0010',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(124, 58, 237, 0.2)',
        borderRadius: '24px',
        padding: '3rem',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.5rem', margin: 0, color: '#A855F7', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            KOPÍROVANIE REPORTU
          </h1>
          <button 
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              backgroundColor: copied ? '#22C55E' : '#7C3AED',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: copied ? '0 0 20px rgba(34, 197, 94, 0.4)' : '0 0 20px rgba(124, 58, 237, 0.4)'
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'SKOPÍROVANÉ' : 'KOPÍROVAŤ VŠETKO'}
          </button>
        </div>

        <pre style={{
          backgroundColor: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.05)',
          padding: '2rem',
          borderRadius: '16px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          fontSize: '0.9rem',
          lineHeight: '1.6',
          color: '#E2D9F3',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          {data}
        </pre>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link 
            href="/"
            style={{ 
              color: 'rgba(255,255,255,0.4)', 
              textDecoration: 'none', 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <ArrowLeft size={14} />
            Späť na hlavnú stránku
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function KopirovaniePage() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Načítavam...</div>}>
      <CopyPageContent />
    </Suspense>
  );
}
