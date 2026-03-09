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
  
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bufferingProgress, setBufferingProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsTimeoutRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const startTimeoutRef = useRef<any>(null);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setMounted(true);
  }, []);



  const startAutoplay = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Wait for a cinematic dramatic entrance
    if (startTimeoutRef.current) window.clearTimeout(startTimeoutRef.current);
    
    startTimeoutRef.current = window.setTimeout(async () => {
      const video = videoRef.current;
      if (!video || !isOpen || !isReady) return;

      try {
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Initial autoplay blocked, trying muted...', err);
        try {
          video.muted = true;
          setIsMuted(true);
          await video.play();
          setIsPlaying(true);
        } catch (e) {
          console.error('Muted autoplay also failed:', e);
        }
      }
    }, 1200);
  }, [isOpen, isReady]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isOpen && !isReady && videoRef.current) {
      interval = window.setInterval(() => {
        if (videoRef.current && videoRef.current.readyState >= 3) {
          setIsReady(true);
        }
      }, 500) as any;
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isOpen, isReady]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isOpen) {
      const video = videoRef.current;
      if (video) {
        // Safe reset
        try {
          if (video.readyState > 0) {
            video.currentTime = 0;
          }
          video.pause();
        } catch (e) {
          console.warn('Caught Safari iOS video init exception:', e);
        }
        
        window.setTimeout(() => {
          setIsPlaying(false);
          
          if (video && video.readyState >= 3) {
            setIsReady(true);
          } else if (video && video.readyState >= 2) {
             setIsReady(true);
          } else {
             setIsReady(false);
          }

          if (!isAutoTriggered) {
             startAutoplay();
          }
        }, 100);
      }
    } else {
      if (startTimeoutRef.current) window.clearTimeout(startTimeoutRef.current);
      if (videoRef.current) {
        try {
          videoRef.current.pause();
        } catch (e) {
          console.warn('Error pausing video:', e);
        }
        window.setTimeout(() => {
           setIsPlaying(false);
           setIsReady(false);
        }, 50);
      }
      
      const doc = document as any;
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        if (doc.exitFullscreen) doc.exitFullscreen().catch(() => {});
        else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
      }
      window.setTimeout(() => setIsFullscreen(false), 50);
    }
  }, [isOpen, isAutoTriggered, startAutoplay]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const cursorEl = document.querySelector('.cursor');
    if (!cursorEl) return;
    
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
    if (typeof document === 'undefined') return;
    const handleFullscreenChange = () => {
      const doc = document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle mouse movement to show/hide controls
  const handleMouseMove = () => {
    if (typeof window === 'undefined') return;
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  const togglePlay = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.warn('Play action failed:', err);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const toggleFullscreenNative = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Support for multiple browser fullscreen APIs (including Safari iOS webkit)
    const appElem = document.documentElement as HTMLElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      msRequestFullscreen?: () => void;
    };
    const vidElem = videoRef.current as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
    };
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      msFullscreenElement?: Element;
      webkitExitFullscreen?: () => void;
      msExitFullscreen?: () => void;
    };

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
    if (typeof window === 'undefined') return;
    window.setTimeout(() => {
      onClose();
      
      const ctaBtn = document.getElementById('nav-cta');
      if (ctaBtn) {
        ctaBtn.style.animation = 'pulse-electric 1.5s infinite';
        ctaBtn.style.transform = 'scale(1.05)';
        ctaBtn.style.background = 'var(--neon)';
        ctaBtn.style.boxShadow = '0 0 30px var(--glow-electric)';
        
        window.setTimeout(() => {
          ctaBtn.style.animation = '';
          ctaBtn.style.transform = '';
          ctaBtn.style.background = 'var(--electric)';
          ctaBtn.style.boxShadow = '';
        }, 8000);
      }
      
      if (window.location.pathname !== '/') {
          router.push('/');
      }
    }, 400); 
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
              muted={isMuted}
              onLoadedData={() => setIsReady(true)}
              onCanPlay={() => setIsReady(true)}
              onProgress={() => {
                const video = videoRef.current;
                if (!video) return;
                try {
                  if (video.buffered && video.buffered.length > 0) {
                    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                    const durationVal = video.duration;
                    if (durationVal > 0) {
                      setBufferingProgress(Math.round((bufferedEnd / durationVal) * 100));
                    }
                  }
                } catch {
                  // Silent catch for unexpected TimeRanges issues
                }
              }}
              onError={() => setError('Nepodarilo sa načítať video. Skontrolujte pripojenie.')}
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                outline: 'none',
                willChange: 'transform',
                opacity: (isReady && !error) ? 1 : 0,
                transition: 'opacity 0.6s ease',
                background: '#000'
              }}
            />

            {/* Premium Buffering Indicator */}
            <AnimatePresence>
              {!isReady && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'absolute',
                    zIndex: 70,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem'
                  }}
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '2px solid rgba(168, 85, 247, 0.1)',
                        borderTopColor: 'var(--electric)',
                        boxShadow: '0 0 20px var(--glow-electric)'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.8rem', 
                      letterSpacing: '0.4em',
                      color: 'var(--electric)',
                      opacity: 0.8,
                      textTransform: 'uppercase'
                    }}>
                      Synchronizácia dát...
                    </span>
                    {bufferingProgress > 0 && (
                      <span style={{ 
                        fontFamily: 'var(--font-mono)', 
                        fontSize: '0.6rem', 
                        color: 'var(--muted)',
                        letterSpacing: '0.2em'
                      }}>
                        {bufferingProgress}%
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message Case */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    position: 'absolute',
                    zIndex: 80,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '2rem',
                    textAlign: 'center'
                  }}
                >
                  <span style={{ color: 'var(--electric)', fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>UPS!</span>
                  <p style={{ color: 'var(--white)', opacity: 0.7, maxWidth: '300px' }}>{error}</p>
                  <button 
                    onClick={() => { setError(null); setIsReady(false); if(videoRef.current) videoRef.current.load(); }}
                    style={{
                      background: 'var(--electric)',
                      color: '#000',
                      border: 'none',
                      padding: '0.8rem 2rem',
                      borderRadius: '50px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    SKÚSIŤ ZNOVA
                  </button>
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
