import Hls from 'hls.js';
import { ChevronLeft } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

const checkHlsSupport = () => {
  if (typeof window === 'undefined') return { hlsJs: false, native: false };
  const hlsJs = Hls.isSupported();
  const video = document.createElement('video');
  const native = video.canPlayType('application/vnd.apple.mpegurl').length > 0;
  return { hlsJs, native };
};

const HLS_SUPPORT = checkHlsSupport();

export function LiveTVPlayer({ streams = [], title, logo, onBack }) {
  const videoRef = useRef(null);
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(() =>
    !HLS_SUPPORT.hlsJs && !HLS_SUPPORT.native
      ? 'HLS is not supported in this browser'
      : null
  );
  const [prevStreamUrl, setPrevStreamUrl] = useState(null);

  const stream = streams[currentStreamIndex];
  const streamUrl = stream?.url;

  // Adjust state during render to avoid cascading renders in useEffect
  if (streamUrl !== prevStreamUrl) {
    setPrevStreamUrl(streamUrl);
    setIsReady(false);
    setError(null);
  }

  useEffect(() => {
    let hls = null;

    if (videoRef.current && streamUrl) {
      const hlsConfig = {
        xhrSetup: (xhr) => {
          if (stream.user_agent) {
            xhr.setRequestHeader('User-Agent', stream.user_agent);
          }
        },
      };

      if (Hls.isSupported()) {
        hls = new Hls(hlsConfig);
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current
            .play()
            .catch((e) => console.error('Auto-play failed:', e));
          setIsReady(true);
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            console.warn(`Stream error (Index ${currentStreamIndex}):`, data);
            if (currentStreamIndex < streams.length - 1) {
              console.log('Attempting fallback to next stream...');
              setCurrentStreamIndex((prev) => prev + 1);
            } else {
              hls.destroy();
              setError('Failed to load all available streams');
            }
          }
        });
      } else if (
        videoRef.current.canPlayType('application/vnd.apple.mpegurl')
      ) {
        // For Safari
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current.play();
          setIsReady(true);
        });
        videoRef.current.addEventListener('error', () => {
          if (currentStreamIndex < streams.length - 1) {
            setCurrentStreamIndex((prev) => prev + 1);
          } else {
            setError('Failed to load all available streams');
          }
        });
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl, currentStreamIndex, streams.length, stream?.user_agent]);

  return (
    <div className='relative flex h-full w-full flex-col overflow-hidden bg-black'>
      {/* Header controls overlay */}
      <div className='absolute top-0 right-0 left-0 z-50 flex items-center justify-between bg-linear-to-b from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100 hover:opacity-100'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20'
            onClick={onBack}
          >
            <ChevronLeft className='h-6 w-6 text-white' />
          </Button>
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
      <div className='group relative flex-1'>
        <video
          ref={videoRef}
          className='h-full w-full object-contain'
          controls
          autoPlay
          playsInline
        />

        {/* Loading/Error State */}
        {(!isReady || error) && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black'>
            {error ? (
              <div className='p-6 text-center'>
                <p className='mb-2 text-lg font-bold text-red-500'>{error}</p>
                <Button
                  variant='outline'
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
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
  );
}
