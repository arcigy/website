'use client';

const MARQUEE_ITEMS = [
  'AI Audit',
  'Analýza Procesov',
  'Mapovanie Workflow',
  'Bezpečnosť',
  'Automatizácia',
  'Zníženie Nákladov',
];

export default function MarqueeBand() {
  return (
    <div
      aria-hidden="true"
      style={{
        borderTop: '1px solid var(--border)',
        padding: '2rem 0',
        overflow: 'hidden',
        background: 'rgba(5, 0, 8, 1)', // Darker contrast
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div 
        className="marquee-track"
        style={{ 
          display: 'flex', 
          width: 'max-content',
          gap: '6rem' // Larger gap since separators are gone
        }}
      >
        {/* Quadruple the list to ensure enough content for a seamless loop */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
          (item, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                letterSpacing: '0.02em',
                color: 'transparent',
                WebkitTextStroke: '1px var(--muted)',
                whiteSpace: 'nowrap',
                opacity: 0.6,
                flexShrink: 0
              }}
            >
              {item}
            </span>
          )
        )}
      </div>
    </div>
  );
}
