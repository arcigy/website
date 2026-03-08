'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!cursor || !dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let isHoveringMagnetic = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    let raf: number;
    const animate = () => {
      const easing = isHoveringMagnetic ? 0.35 : 0.12;
      ringX += (mouseX - ringX) * easing;
      ringY += (mouseY - ringY) * easing;
      
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onEnterMagnetic = (e: MouseEvent) => {
      isHoveringMagnetic = true;
      cursor.classList.add('cursor-hide');
      
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      mouseX = rect.left + rect.width / 2;
      mouseY = rect.top + rect.height / 2;
      
      target.style.transition = 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)';
    };

    const onMoveMagnetic = (e: MouseEvent) => {
      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Update coordinates to center to force the snap
      mouseX = centerX;
      mouseY = centerY;
      
      const pullX = (e.clientX - centerX) * 0.2;
      const pullY = (e.clientY - centerY) * 0.2;
      
      target.style.transform = `translate(${pullX}px, ${pullY}px)`;
    };

    const onLeaveMagnetic = (e: MouseEvent) => {
      isHoveringMagnetic = false;
      cursor.classList.remove('cursor-active');
      cursor.classList.remove('cursor-hide');
      
      const target = e.currentTarget as HTMLElement;
      target.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      target.style.transform = 'translate(0px, 0px) scale(1)';
    };

    const updateInteractives = () => {
      // Find all possible interactives including the new triggers
      const interactives = document.querySelectorAll(
        'a, button, .btn-primary, .btn-ghost, .nav-cta, input, textarea, [role="button"], .faq-plus-trigger, .problem-plus-trigger'
      );
      
      interactives.forEach((el) => {
        // Enforce cursor hiding
        (el as HTMLElement).style.cursor = 'none';

        // Add listeners
        el.addEventListener('mouseenter', onEnterMagnetic as EventListener);
        el.addEventListener('mousemove', onMoveMagnetic as EventListener);
        el.addEventListener('mouseleave', onLeaveMagnetic as EventListener);
      });
    };

    updateInteractives();
    window.addEventListener('mousemove', onMove);

    const observer = new MutationObserver(updateInteractives);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor">
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </div>
  );
}
