'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize, Minimize, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  isAutoTriggered?: boolean;
}

export default function VideoModal({ isOpen, onClose, videoSrc, isAutoTriggered = false }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [hasStarted, setHasStarted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);



  const startAutoplay = useCallback(() => {
    // Wait 1.2s for a more "pro" dramatic entrance (black screen first)
    if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
    startTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && isOpen) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.warn('Autoplay blocked, attempting muted play...', err);
            // If autoplay is blocked, browsers often allow it if muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error('Even muted play failed:', e));
            }
          });
      }
    }, 1200);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.pause(); 
        
        setTimeout(() => {
          setIsPlaying(false);
          setHasStarted(false); // Reset on open
          
          // Only autoplay if NOT system-triggered (to protect audio)
          if (!isAutoTriggered) {
             startAutoplay();
             setHasStarted(true);
          }
        }, 50);
      }
    } else {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
      if (videoRef.current) {
        videoRef.current.pause();
        setTimeout(() => {
           setIsPlaying(false);
           setHasStarted(false);
        }, 50);
      }
      
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
      setTimeout(() => setIsFullscreen(false), 50);
    }
  }, [isOpen, isAutoTriggered, startAutoplay]);

  useEffect(() => {
    const cursorEl = document.querySelector('.cursor');
    if (!cursorEl) return;
    
    // Disable difference blending while video is open
    cursorEl.classList.add('cursor-video-active');
    
    if (!showControls && isPlaying) {
      cursorEl.classList.add('cursor-force-hidden');
    } else {
      cursorEl.classList.remove('cursor-force-hidden');
    }
  }, [showControls, isPlaying]);

  useEffect(() => {
    // Cleanup on unmount/close
    return () => {
      const cursorEl = document.querySelector('.cursor');
      if (cursorEl) {
        cursorEl.classList.remove('cursor-force-hidden');
        cursorEl.classList.remove('cursor-video-active');
      }
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle mouse movement to show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    // Hide controls after 2.5s of inactivity
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreenNative = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const appElem = document.documentElement as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vidElem = videoRef.current as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      if (appElem?.requestFullscreen) {
        appElem.requestFullscreen().catch((err: unknown) => console.log(err));
      } else if (appElem?.webkitRequestFullscreen) {
        appElem.webkitRequestFullscreen();
      } else if (vidElem?.webkitEnterFullscreen) {
        vidElem.webkitEnterFullscreen(); // fallback for iOS video direct fullscreen
      } else if (appElem?.msRequestFullscreen) {
        appElem.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch((err: unknown) => console.log(err));
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoEnd = () => {
    // Slight delay before closing to ensure final frames/audio finish properly without cutting off
    setTimeout(() => {
      onClose();
      
      // Highlight the CTA button heavily
      const ctaBtn = document.getElementById('nav-cta');
      if (ctaBtn) {
        // Apply our electric pulse animation defined in globals.css
        ctaBtn.style.animation = 'pulse-electric 1.5s infinite';
        ctaBtn.style.transform = 'scale(1.05)';
        ctaBtn.style.background = 'var(--neon)';
        ctaBtn.style.boxShadow = '0 0 30px var(--glow-electric)';
        
        // Remove it after 8 seconds
        setTimeout(() => {
          ctaBtn.style.animation = '';
          ctaBtn.style.transform = '';
          ctaBtn.style.background = 'var(--electric)';
          ctaBtn.style.boxShadow = '';
        }, 8000);
      }
      
      // Navigate home if not already there
      if (window.location.pathname !== '/') {
          router.push('/');
      }
    }, 400); // 400ms buffer
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            backgroundColor: '#06000a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={onClose}
        >
          {/* Main Container */}
          <div 
            ref={containerRef} 
            className="video-modal-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              backgroundColor: '#000', // Pitch black for video viewing
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
            onClick={(e) => {
              e.stopPropagation(); // Keep click inside container from closing
              togglePlay(); // Click anywhere on video to play/pause
            }} 
          >

            {/* Close Button (Top Right) */}
            <AnimatePresence>
              {showControls && (
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  onClick={(e) => { e.stopPropagation(); onClose(); }}
                  style={{
                    position: 'absolute',
                    top: '2rem',
                    right: '2rem',
                    zIndex: 50,
                    color: 'var(--white)',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--electric)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--white)'}
                >
                  <X size={24} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Video Element */}
            <video
              ref={videoRef}
              src={videoSrc}
              playsInline
              preload="auto"
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                outline: 'none',
                willChange: 'transform' // Performance optimization
              }}
            />

            {/* START OVERLAY for Demo Mode */}
            <AnimatePresence>
              {isAutoTriggered && !hasStarted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                    <motion.button
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (videoRef.current) {
                           videoRef.current.muted = false;
                           setIsMuted(false);
                           videoRef.current.play();
                           setHasStarted(true);
                           setIsPlaying(true);
                        }
                      }}
                      className="group relative flex flex-col items-center gap-6"
                    >
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--electric)] flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.6)] transition-all group-hover:shadow-[0_0_80px_rgba(124,58,237,0.8)]">
                           <Play size={40} className="text-[#060010] ml-2" fill="currentColor" />
                        </div>
                        <span className="font-display text-xl md:text-2xl tracking-[0.2em] text-white uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                            Spustiť skúsenosť
                        </span>
                    </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Huge Play button overlay when paused */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                  }}
                >
                  <div 
                    role="button"
                    style={{
                    width: '100px',
                    height: '100px',
                    background: 'rgba(168, 85, 247, 0.2)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    paddingLeft: '6px', // Visual balance for play icon
                    color: 'var(--electric)'
                  }}>
                     <Play size={44} fill="currentColor" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Custom Bottom Controller UI */}
            <AnimatePresence>
              {showControls && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 30,
                    padding: '3rem 2rem 2rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                  }}
                  onClick={(e) => e.stopPropagation()} // don't trigger video play/pause when clicking controls
                >
                  
                  {/* Branding watermark inside player */}
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.4)',
                    userSelect: 'none'
                  }}>
                    ARC<span style={{ color: 'var(--electric)' }}>I</span>GY
                  </div>

                  {/* Glassmorphic Controls Pill */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    background: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                  }}>
                    <button 
                      onClick={(e) => togglePlay(e)} 
                      style={{ color: 'var(--white)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--electric)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--white)'}
                      title={isPlaying ? "Pozastaviť" : "Pustiť"}
                    >
                      {isPlaying ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
                    </button>
                    
                    <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    
                    <div style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.8rem', 
                      color: 'var(--dim)',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      gap: '0.25rem',
                      alignItems: 'center'
                    }}>
                      <span style={{ color: 'var(--white)' }}>{formatTime(currentTime)}</span>
                      <span>/</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    
                    <button 
                      onClick={toggleMute} 
                      style={{ color: 'var(--white)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--electric)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--white)'}
                      title={isMuted ? "Zapnúť zvuk" : "Vypnúť zvuk"}
                    >
                      {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    </button>
                    
                    <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    
                    <button 
                      onClick={toggleFullscreenNative} 
                      style={{ color: 'var(--white)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--electric)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--white)'}
                      title={isFullscreen ? "Ukončiť celú obrazovku" : "Celá obrazovka"}
                    >
                      {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
