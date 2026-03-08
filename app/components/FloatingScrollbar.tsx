"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function FloatingScrollbar() {
  const { scrollYProgress } = useScroll();
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Calculate thumb position
  const thumbY = useTransform(scaleY, [0, 1], ["0%", "100%"]);

  const handleScroll = (percentage: number) => {
    const scrollTarget = percentage * (document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo({ top: scrollTarget, behavior: 'auto' });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const pos = (e.clientY - rect.top) / rect.height;
      handleScroll(Math.max(0, Math.min(1, pos)));
    };

    const onMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <div 
        className="fixed top-1/2 -translate-y-1/2 h-[50vh] w-12 z-[9999] flex justify-center group"
        onMouseDown={onMouseDown}
        style={{ right: '1.5rem', left: 'auto' }}
      >
        {/* The Track */}
        <div 
          ref={trackRef}
          className="relative h-full w-2 bg-white/10 border border-white/20 rounded-full cursor-pointer transition-all duration-300 group-hover:w-3"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            handleScroll((e.clientY - rect.top) / rect.height);
          }}
        >
          {/* Progress fill - SOLID visibility */}
          <motion.div 
             className="absolute top-0 left-0 w-full bg-gradient-to-b from-violet to-electric rounded-full origin-top"
             style={{ scaleY, height: "100%", boxShadow: '0 0 15px rgba(168,85,247,0.5)' }}
          />

          {/* DRAGGABLE THUMB - Extremely visible */}
          <motion.div 
            className="absolute left-1/2 -translate-x-1/2 w-6 h-12 bg-white rounded-full shadow-[0_0_30px_#fff,0_0_10px_#fff_inset] z-[10000] cursor-grab active:cursor-grabbing border-4 border-electric"
            style={{ 
              top: thumbY,
              y: "-50%"
            }}
          />
        </div>
      </div>

      {/* Modern Mouse Scroll Indicator with Text */}
      <div 
        className="fixed z-[9999] flex flex-col items-center gap-4 pointer-events-none"
        style={{
          right: '1.5rem',
          bottom: '2.5rem',
        }}
      >
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-[18px] h-[30px] border-2 border-white/50 rounded-full relative bg-black/40 backdrop-blur-sm">
            <motion.div 
              animate={{ 
                y: [2, 14, 2],
                opacity: [1, 0, 1]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-2 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-white rounded-full shadow-[0_0_10px_#fff]"
            />
          </div>
          <div className="flex flex-col items-center">
             <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/60 mb-1">Scroll</span>
             <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </motion.div>
      </div>
    </>
  );
}
