'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Disable custom cursor on touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      cursor.style.display = 'none';
      return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let isHoveringMagnetic = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

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
        // Enforce cleanup before re-adding
        el.removeEventListener('mouseenter', onEnterMagnetic as EventListener);
        el.removeEventListener('mousemove', onMoveMagnetic as EventListener);
        el.removeEventListener('mouseleave', onLeaveMagnetic as EventListener);

        // Add listeners
        el.addEventListener('mouseenter', onEnterMagnetic as EventListener);
        el.addEventListener('mousemove', onMoveMagnetic as EventListener);
        el.addEventListener('mouseleave', onLeaveMagnetic as EventListener);
      });
    };

    const resetCursor = () => {
      isHoveringMagnetic = false;
      cursor.classList.remove('cursor-active');
      cursor.classList.remove('cursor-hide');
      cursor.classList.remove('cursor-force-hidden');
    };

    updateInteractives();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('cursor-reset', resetCursor);

    const observer = new MutationObserver(() => {
      updateInteractives();
      // If the current hovered element is gone, reset
      if (isHoveringMagnetic) {
         resetCursor();
      }
    });

    // Safety fallback: if we are in a hidden state, periodically check
    const safetyTimer = setInterval(() => {
      if (!isHoveringMagnetic && cursor.classList.contains('cursor-hide')) {
        cursor.classList.remove('cursor-hide');
      }
    }, 1000);
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('cursor-reset', resetCursor);
      clearInterval(safetyTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={cursorRef} className="cursor">
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}

