import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LiveTVPlayer({ streams = [], title, logo, onBack }) {
  const artRef = useRef(null);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [error, setError] = useState(null);
  const [decoderMode, setDecoderMode] = useState('HW+');

  const stream = streams[currentStreamIndex];
  const streamUrl = stream?.url;

  // ─── Reset state for new stream ─────────
  const [prevUrl, setPrevUrl] = useState(streamUrl);
  if (streamUrl !== prevUrl) {
    setPrevUrl(streamUrl);
    setError(null);
  }

  useEffect(() => {
    if (!artRef.current || !streamUrl) return;

    const art = new Artplayer({
      container: artRef.current,
      url: streamUrl,
      title: title,
      poster: logo || '',
      isLive: true,
      autoSize: false,
      autoMini: true,
      playbackRate: true,
      aspectRatio: true,
      setting: true,
      hotkey: true,
      pip: true,
      fullscreen: true,
      fullscreenWeb: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      backdrop: true,
      playsInline: true,
      autoPlayback: true,
      airplay: true,
      theme: '#ff4d00', // Lumos Primary Orange
      customType: {
        m3u8: function (video, url) {
          if (Hls.isSupported()) {
            const hls = new Hls({
              enableWorker: true,
              lowLatencyMode: true,
              backBufferLength: 90,
            });
            hls.loadSource(url);
            hls.attachMedia(video);

            // Keep reference for cleanup
            art.hls = hls;

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
              video.play().catch(() => {
                art.notice.show = 'Autoplay blocked. Please click play.';
              });
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
              if (data.fatal) {
                switch (data.type) {
                  case Hls.ErrorTypes.NETWORK_ERROR:
                    hls.startLoad();
                    break;
                  case Hls.ErrorTypes.MEDIA_ERROR:
                    hls.recoverMediaError();
                    break;
                  default:
                    art.emit('error', data);
                    break;
                }
              }
            });
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
          } else {
            art.notice.show = 'Unsupported streaming format';
          }
        },
      },
      settings: [
        // Quality / Source Switcher (only if multiple streams)
        ...(streams.length > 1
          ? [
              {
                html: 'Quality',
                width: 250,
                tooltip: stream?.quality || 'Auto',
                selector: streams.map((s, i) => ({
                  default: i === currentStreamIndex,
                  html: `${s.title || s.quality || `Source ${i + 1}`}${s.quality ? ` (${s.quality})` : ''}`,
                  value: i,
                })),
                onSelect: function (item) {
                  setCurrentStreamIndex(item.value);
                  art.notice.show = `Switching to ${item.html}`;
                  return item.html;
                },
              },
            ]
          : []),
        {
          html: 'Decoder Mode',
          width: 200,
          tooltip: decoderMode,
          selector: [
            {
              default: decoderMode === 'HW+',
              html: 'HW+ (MSE High Perf)',
              value: 'HW+',
            },
            {
              default: decoderMode === 'HW',
              html: 'HW (Native Hardware)',
              value: 'HW',
            },
            {
              default: decoderMode === 'SW',
              html: 'SW (Software Fallback)',
              value: 'SW',
            },
          ],
          onSelect: function (item) {
            setDecoderMode(item.value);
            art.notice.show = `Switched to ${item.html}`;
            return item.html;
          },
        },
      ],
      contextmenu: [
        {
          html: 'Lumos TV Player v2.0',
        },
      ],
    });

    art.on('ready', () => {
      console.info('ArtPlayer: Ready');
      // Set volume
      art.volume = 1;
    });

    art.on('error', (err) => {
      console.error('ArtPlayer Error:', err);
      if (currentStreamIndex < streams.length - 1) {
        art.notice.show = 'Stream failed. Trying fallback...';
        setTimeout(() => {
          setCurrentStreamIndex((prev) => prev + 1);
        }, 2000);
      } else {
        setError(
          `Playback Error: ${err.message || 'The stream could not be loaded.'}`
        );
      }
    });

    return () => {
      if (art && art.destroy) {
        if (art.hls) {
          art.hls.stopLoad();
          art.hls.detachMedia();
          art.hls.destroy();
          art.hls = null;
        }
        // Also clear the video source to stop any native requests
        if (art.video) {
          art.video.pause();
          art.video.removeAttribute('src');
          art.video.load();
        }
        art.destroy(true);
      }
    };
  }, [streamUrl, currentStreamIndex, streams, title, logo]);

  return (
    <div className='font-outfit relative flex h-full w-full flex-col overflow-hidden bg-black'>
      {/* Header Bar Overlay */}
      <div className='pointer-events-none absolute top-0 right-0 left-0 z-50 flex items-center justify-between bg-linear-to-b from-black/80 to-transparent p-4'>
        <div className='pointer-events-auto flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20'
            onClick={onBack}
          >
            <ChevronLeft className='h-6 w-6 text-white' />
          </Button>
          <div className='flex flex-col'>
            <h1 className='text-lg leading-tight font-bold tracking-tight text-white'>
              {title}
            </h1>
            <div className='flex items-center gap-2'>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-black tracking-tighter',
                  decoderMode === 'HW+'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-white/20 text-white/70'
                )}
              >
                {decoderMode} DECODER
              </span>
              <span className='flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-white/50 uppercase'>
                <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-red-500' />
                Live
              </span>
            </div>
          </div>
        </div>

        {logo && (
          <div className='pointer-events-auto'>
            <img
              src={logo}
              alt=''
              className='h-10 w-10 rounded-lg border border-white/10 bg-white/5 object-contain p-1 shadow-2xl backdrop-blur-sm md:h-12 md:w-12'
            />
          </div>
        )}
      </div>

      {/* Artplayer Container */}
      <div
        ref={artRef}
        style={{ width: '100%', height: '100%' }}
        className='artplayer-app'
      />

      {/* Error Overlay */}
      {error && (
        <div className='absolute inset-0 z-60 flex flex-col items-center justify-center gap-6 bg-black/90 backdrop-blur-xl'>
          <div className='flex flex-col items-center gap-2 text-center'>
            <div className='mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10'>
              <div className='h-8 w-8 animate-pulse rounded-full bg-red-500' />
            </div>
            <h2 className='text-2xl font-bold tracking-tighter text-white uppercase'>
              Connection Lost
            </h2>
            <p className='max-w-md px-6 text-sm leading-relaxed text-white/60'>
              {error}
            </p>
          </div>

          <div className='flex gap-4'>
            <Button
              variant='outline'
              className='border-white/10 text-white hover:bg-white/10'
              onClick={onBack}
            >
              Go Back
            </Button>
            <Button
              variant='default'
              className='bg-primary hover:bg-primary/90 font-bold text-white'
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
            >
              Retry Stream
            </Button>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .artplayer-app {
            background: #000;
        }
        .art-video {
            object-fit: contain !important;
        }
        .art-control-play, .art-control-volume, .art-control-time, .art-control-fullscreen {
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
        }
        .art-bottom {
            background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%) !important;
            padding-top: 40px !important;
        }
        .art-notice {
            background: rgba(0,0,0,0.8) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 8px !important;
            font-family: 'Outfit Variable', sans-serif !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
        }
        .art-setting {
             background: rgba(20, 20, 25, 0.95) !important;
             backdrop-filter: blur(20px) !important;
             border: 1px solid rgba(255,255,255,0.1) !important;
             border-radius: 12px !important;
             box-shadow: 0 10px 40px rgba(0,0,0,0.5) !important;
        }
        .art-setting-item:hover {
            background: rgba(255,255,255,0.05) !important;
        }
        .art-setting-item.art-current {
            color: #ff4d00 !important;
        }
      `,
        }}
      />
    </div>
  );
}
