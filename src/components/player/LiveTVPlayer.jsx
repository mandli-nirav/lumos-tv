import {
  ChevronLeft,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player/dist/shaka-player.compiled';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

// Helper to check for Shaka support safely
const checkShakaSupport = () => {
  if (typeof window === 'undefined') return false;
  try {
    return !!(window.shaka || shaka)?.Player?.isBrowserSupported();
  } catch (e) {
    return false;
  }
};

let polyfillsInstalled = false;
const installPolyfills = () => {
  if (typeof window !== 'undefined' && !polyfillsInstalled) {
    shaka.polyfill.installAll();
    polyfillsInstalled = true;
  }
};

export function LiveTVPlayer({ streams = [], title, logo, onBack }) {
  const isMobile = useIsMobile();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isSupported] = useState(() => checkShakaSupport());
  const [error, setError] = useState(() =>
    !checkShakaSupport() ? 'This browser is not supported by our player' : null
  );
  const [prevStreamUrl, setPrevStreamUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playerKey, setPlayerKey] = useState(0);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const lastRecoveryTimeRef = useRef(0);
  const controlsTimeoutRef = useRef(null);
  const seekSliderRef = useRef(null);
  const volSliderRef = useRef(null);

  const stream = streams[currentStreamIndex];
  const streamUrl = stream?.url;

  // Adjust state during render to avoid cascading renders in useEffect
  if (streamUrl !== prevStreamUrl) {
    setPrevStreamUrl(streamUrl);
    setIsReady(false);
    setError(null);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  }

  // ─── Handlers declared before useEffect hooks that reference them ────────────

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current
        ?.requestFullscreen()
        .then(() => {
          if (isMobile && screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {});
          }
        })
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message}`
          );
        });
    } else {
      if (isMobile && screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
      document.exitFullscreen();
    }
  }, [isMobile]);

  const handleVolumeChange = useCallback((e) => {
    const newVolume = typeof e === 'number' ? e : parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  }, []);

  const formatTime = (time) => {
    if (!isFinite(time) || isNaN(time)) return 'Live';
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    if (h > 0)
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (!isDragging && videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration !== duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeekChange = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  // ─── Effects ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    let isMounted = true;
    const video = videoRef.current;

    if (video && streamUrl && isSupported) {
      installPolyfills();

      const handlePlay = async () => {
        if (!isMounted || !video) return;
        try {
          video.muted = true;
          setIsMuted(true);

          if (video.paused) {
            console.log('Shaka: Attempting playback...');
            await video.play();
            console.log('Shaka: Playback successful!');
          }

          // Fullscreen and Landscape for Mobile
          if (isMobile && containerRef.current && !document.fullscreenElement) {
            try {
              await containerRef.current.requestFullscreen();
              if (screen.orientation && screen.orientation.lock) {
                await screen.orientation.lock('landscape').catch(() => {});
              }
            } catch (err) {
              console.warn('Auto-fullscreen/orientation-lock blocked:', err);
            }
          }
          if (isMounted) {
            setIsReady(true);
            setIsPlaying(true);
          }
        } catch (e) {
          console.error('Shaka: Playback Error:', e.name, e.message);
          if (isMounted) setIsReady(true);
        }
      };

      const initPlayer = async () => {
        if (playerRef.current) {
          try {
            await playerRef.current.destroy();
          } catch (e) {
            console.error('Shaka: Error destroying previous instance', e);
          }
          playerRef.current = null;
        }

        if (!isMounted || !video) return;

        const player = new shaka.Player(video);
        playerRef.current = player;

        if (!isMounted) {
          player.destroy();
          return;
        }

        player.configure({
          streaming: {
            bufferingGoal: 45,
            rebufferingGoal: 5,
            bufferBehind: 30,
            jumpLargeGaps: true,
            smallGapLimit: 5,
            driftTolerance: 5,
            stallThreshold: 2,
            stallTimeout: 1,
            stallSkip: 0.1,
            retryParameters: {
              maxAttempts: 10,
              baseDelay: 1000,
              backoffFactor: 2,
              timeout: 30000,
            },
          },
          manifest: {
            retryParameters: {
              maxAttempts: 10,
              baseDelay: 1000,
              backoffFactor: 2,
              timeout: 30000,
            },
          },
          hls: {
            ignoreTextStreamFailures: true,
            useFullSegmentsForStartTime: false,
          },
        });

        if (import.meta.env.DEV && shaka.log) {
          shaka.log.setLevel(shaka.log.Level.DEBUG);
        }

        player.getNetworkingEngine().registerRequestFilter((type, request) => {
          if (stream?.referrer) {
            request.headers['Referer'] = stream.referrer;
          }
          if (stream?.user_agent) {
            request.headers['X-Requested-With'] = 'XMLHttpRequest';
          }
        });

        player.addEventListener('error', async (event) => {
          const shakaError = event.detail;
          if (!isMounted) return;
          console.error(
            'Shaka Error:',
            shakaError.code,
            shakaError.message,
            shakaError.data
          );

          if (shakaError.code === 3014 || shakaError.code === 3015) {
            const now = Date.now();
            const timeSinceLastRecovery = now - lastRecoveryTimeRef.current;

            if (recoveryAttempts >= 3 && timeSinceLastRecovery < 30000) {
              console.error('Shaka: Critical recovery failure loop detected');
              setError(
                'Stream is too unstable to play (Repeated Buffer Errors)'
              );
              setIsReady(true);
              return;
            }

            console.warn(
              `Shaka: Triggering Hard Recovery (Error ${shakaError.code}). Attempt ${recoveryAttempts + 1}...`
            );
            lastRecoveryTimeRef.current = now;
            setRecoveryAttempts((prev) => prev + 1);

            if (isMounted && playerRef.current) {
              try {
                await playerRef.current.detach();
                await playerRef.current.attach(video);
                await playerRef.current.load(streamUrl);
                console.log('Shaka: Hard Recovery Successful');
              } catch (e) {
                console.error('Shaka: Hard Recovery Failed', e);
              }
            }
            return;
          }

          if (shakaError.severity === shaka.util.Error.Severity.CRITICAL) {
            if (currentStreamIndex < streams.length - 1 && isMounted) {
              console.log('Shaka: Attempting fallback to next stream...');
              setCurrentStreamIndex((prev) => prev + 1);
            } else if (isMounted) {
              setError(
                `Stream Error (${shakaError.code}): ${shakaError.message}`
              );
              setIsReady(true);
            }
          }
        });

        player.addEventListener('buffering', (event) => {
          if (event.fetching && isMounted) {
            console.log('Shaka: Buffering data...');
          }
        });

        try {
          if (!isMounted) return;
          console.log(`Shaka: Loading stream: ${streamUrl}`);
          await player.load(streamUrl);
          console.log('Shaka: Content loaded!');
          if (isMounted) handlePlay();
        } catch (e) {
          if (!isMounted) return;
          console.error('Shaka Load Error:', e.code, e.message);
          if (isMounted) {
            if (currentStreamIndex < streams.length - 1) {
              setCurrentStreamIndex((prev) => prev + 1);
            } else {
              setError(
                'The server refused to share data (CORS or Network Error)'
              );
              setIsReady(true);
            }
          }
        }
      };

      initPlayer();

      return () => {
        isMounted = false;
        if (playerRef.current) {
          playerRef.current
            .destroy()
            .then(() => {
              playerRef.current = null;
            })
            .catch((e) =>
              console.error('Shaka: Destroy error during cleanup', e)
            );
        }
      };
    }

    return () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current.destroy().then(() => {
          playerRef.current = null;
        });
      }
    };
  }, [
    streamUrl,
    currentStreamIndex,
    streams.length,
    stream?.user_agent,
    stream?.referrer,
    isSupported,
    recoveryAttempts,
    isMobile,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
        return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, toggleFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Sync seek slider fill (--pct custom property) without React re-renders
  useEffect(() => {
    if (seekSliderRef.current) {
      const pct =
        isFinite(duration) && duration > 0 ? (currentTime / duration) * 100 : 0;
      seekSliderRef.current.style.setProperty('--pct', `${pct}%`);
    }
  }, [currentTime, duration]);

  // Sync volume slider fill
  useEffect(() => {
    if (volSliderRef.current) {
      volSliderRef.current.style.setProperty(
        '--pct',
        `${(isMuted ? 0 : volume) * 100}%`
      );
    }
  }, [volume, isMuted]);

  return (
    <TooltipProvider>
      <div
        key={`${streamUrl}-${playerKey}`}
        ref={containerRef}
        className='group relative flex h-full w-full flex-col overflow-hidden bg-black'
        onMouseMove={handleMouseMove}
      >
        {/* Header controls overlay */}
        <div
          className={cn(
            'absolute top-0 right-0 left-0 z-50 flex items-center justify-between bg-linear-to-b from-black/80 to-transparent p-4 transition-opacity duration-300',
            showControls ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className='flex items-center gap-4'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20'
                  onClick={onBack}
                >
                  <ChevronLeft className='h-6 w-6 text-white' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Go Back</TooltipContent>
            </Tooltip>
            <div className='flex items-center gap-3'>
              {logo && (
                <img
                  src={logo}
                  alt=''
                  className='h-8 w-8 rounded-sm bg-white/10 object-contain'
                />
              )}
              <h1 className='text-lg font-bold text-white'>{title}</h1>
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className='relative flex flex-1 items-center justify-center overflow-hidden bg-black'>
          <video
            ref={videoRef}
            className='h-full w-full object-contain'
            playsInline
            onClick={togglePlay}
            onDoubleClick={toggleFullscreen}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onDurationChange={handleLoadedMetadata}
          />

          {/* Custom Controls Overlay — Frosted Glass Pill Bar */}
          <div
            className={cn(
              'absolute inset-0 z-40 flex flex-col items-center justify-end pb-8 transition-opacity duration-300',
              showControls ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
          >
            {/* Glass Pill Control Bar */}
            <div
              style={{
                background: 'rgba(30, 30, 40, 0.55)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow:
                  '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
              className='mx-auto flex w-[min(760px,90vw)] items-center gap-3 rounded-2xl px-4 py-3'
            >
              {/* Play / Pause */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={togglePlay}
                    className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/90 transition-all duration-150 hover:scale-110 hover:text-white focus:outline-none'
                  >
                    {isPlaying ? (
                      <Pause className='h-5 w-5 fill-white/90' />
                    ) : (
                      <Play className='h-5 w-5 fill-white/90' />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  {isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                </TooltipContent>
              </Tooltip>

              {/* Seek Slider — fills available space */}
              <div className='relative flex flex-1 items-center'>
                <input
                  ref={seekSliderRef}
                  type='range'
                  min={0}
                  max={isFinite(duration) && duration > 0 ? duration : 100}
                  step={0.1}
                  value={isFinite(currentTime) ? currentTime : 0}
                  onChange={handleSeekChange}
                  onPointerDown={() => setIsDragging(true)}
                  onPointerUp={() => setIsDragging(false)}
                  className='seek-slider w-full cursor-pointer'
                />
              </div>

              {/* Time Display */}
              <span
                style={{ fontVariantNumeric: 'tabular-nums' }}
                className='shrink-0 font-mono text-sm font-medium tracking-tight text-white/80'
              >
                {formatTime(currentTime)}
                <span className='mx-1 text-white/40'>/</span>
                {isFinite(duration) && duration > 0
                  ? formatTime(duration)
                  : 'Live'}
              </span>

              {/* Divider */}
              <div className='h-5 w-px shrink-0 bg-white/20' />

              {/* Volume */}
              <div className='group/volume flex shrink-0 items-center gap-2'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={toggleMute}
                      className='flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition-all duration-150 hover:scale-110 hover:text-white focus:outline-none'
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className='h-5 w-5' />
                      ) : (
                        <Volume2 className='h-5 w-5' />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side='top'>
                    {isMuted || volume === 0 ? 'Unmute (m)' : 'Mute (m)'}
                  </TooltipContent>
                </Tooltip>

                {/* Expanding volume slider on hover */}
                <div className='flex w-0 items-center overflow-hidden transition-all duration-300 ease-in-out group-hover/volume:w-20'>
                  <input
                    ref={volSliderRef}
                    type='range'
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(e) =>
                      handleVolumeChange(parseFloat(e.target.value))
                    }
                    className='vol-slider w-20 cursor-pointer'
                  />
                </div>
              </div>

              {/* Fullscreen */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={toggleFullscreen}
                    className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition-all duration-150 hover:scale-110 hover:text-white focus:outline-none'
                  >
                    {isFullscreen ? (
                      <Minimize className='h-5 w-5' />
                    ) : (
                      <Maximize className='h-5 w-5' />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side='top'>
                  {isFullscreen ? 'Exit Fullscreen (f)' : 'Fullscreen (f)'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Loading/Error State */}
          {(!isReady || error) && (
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black'>
              {error ? (
                <div className='p-6 text-center'>
                  <p className='mb-2 text-lg font-bold text-red-500'>{error}</p>
                  <div className='flex gap-3'>
                    <Button
                      variant='outline'
                      size='sm'
                      className='border-white/20 text-white hover:bg-white/10'
                      onClick={() => window.location.reload()}
                    >
                      Restart App
                    </Button>
                    <Button
                      variant='default'
                      size='sm'
                      onClick={() => {
                        setError(null);
                        setIsReady(false);
                        setPrevStreamUrl(null);
                        setPlayerKey((prev) => prev + 1);
                      }}
                    >
                      Refresh Stream
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className='border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4' />
                  <p className='animate-pulse font-medium text-white/60'>
                    Loading Live Stream...
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
