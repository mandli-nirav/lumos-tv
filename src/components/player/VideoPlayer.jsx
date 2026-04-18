import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Info, Play, Server, Settings } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { constructPlayerUrl, PLAYER_SERVERS } from '@/config/playerServers';
import { usePlayerServer } from '@/hooks/usePlayerServer';
import { cn } from '@/lib/utils';

export function VideoPlayer({
  type,
  id,
  imdbId,
  season,
  episode,
  title,
  metadata,
}) {
  const navigate = useNavigate();
  const {
    selectedServer,
    setSelectedServer,
    handleServerError,
    allServersFailed,
    isLoading,
    setIsLoading,
    resetError,
  } = usePlayerServer();

  const [showControls, setShowControls] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Touch devices can't reveal auto-hidden controls via mousemove, and taps
  // on the <iframe> don't bubble to the parent. Keep controls always visible
  // on those devices so the server selector stays reachable.
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const timeoutRef = React.useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = (e) => setIsTouchDevice(!e.matches);
    update(mq);
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // Controls are always rendered on touch devices; the user can't otherwise
  // reveal them once hidden because taps on the iframe don't bubble.
  const effectiveShowControls = isTouchDevice || showControls;

  const resetTimer = React.useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (isTouchDevice) return; // Never auto-hide on touch devices
    if (!dropdownOpen) {
      timeoutRef.current = setTimeout(() => setShowControls(false), 10000);
    }
  }, [dropdownOpen, isTouchDevice]);

  // Initial timer and reset on dropdown change
  useEffect(() => {
    resetTimer();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetTimer, dropdownOpen]);

  const handleInteraction = () => {
    if (!showControls) setShowControls(true);
    resetTimer();
  };

  const playerUrl = constructPlayerUrl(selectedServer, type, id, season, episode);

  return (
    <div
      className='flex h-dvh w-full flex-col bg-black'
      onMouseMove={handleInteraction}
      onPointerDown={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Header Bar */}
      <AnimatePresence>
        {effectiveShowControls && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='relative z-100 flex items-center justify-between border-b border-white/10 bg-black/95 px-3 py-2.5 backdrop-blur-md sm:px-4 sm:py-3'
          >
            <div className='flex min-w-0 items-center gap-2 sm:gap-4'>
              <Button
                variant='ghost'
                size='icon'
                className='h-9 w-9 shrink-0 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 sm:h-10 sm:w-10'
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className='h-5 w-5 text-white sm:h-6 sm:w-6' />
              </Button>
              <div className='flex min-w-0 flex-col'>
                <h1 className='truncate text-base font-bold tracking-tight text-white sm:text-lg md:text-xl'>
                  {title}
                </h1>
                {metadata && (
                  <p className='truncate text-[11px] font-medium text-white/60 sm:text-xs'>
                    {metadata}
                  </p>
                )}
              </div>
            </div>

            {/* Tip */}
            <div className='hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/40 md:flex'>
              <Info className='h-3 w-3 shrink-0' />
              <span>If video doesn't load, switch servers →</span>
            </div>

            {/* Server Selection Dropdown */}
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-9 shrink-0 gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 text-white backdrop-blur-md hover:bg-white/20 sm:h-10 sm:gap-2 sm:px-4'
                >
                  <Server className='h-4 w-4' />
                  <span className='hidden sm:inline'>
                    {selectedServer.name}
                  </span>
                  <Settings className='ml-0.5 h-4 w-4 opacity-60 sm:ml-1' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='z-110 w-56 border-zinc-800 bg-zinc-900/95 text-white backdrop-blur-xl'
              >
                <DropdownMenuLabel className='px-3 py-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase'>
                  Switch Server
                </DropdownMenuLabel>
                <DropdownMenuSeparator className='bg-zinc-800' />
                {PLAYER_SERVERS.map((server) => (
                  <DropdownMenuItem
                    key={server.id}
                    onClick={() => setSelectedServer(server)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 px-3 py-2.5 text-sm transition-colors',
                      selectedServer.id === server.id
                        ? 'bg-primary/20 text-primary font-bold'
                        : 'hover:bg-white/10'
                    )}
                  >
                    <Play
                      className={cn(
                        'h-3.5 w-3.5',
                        selectedServer.id === server.id
                          ? 'fill-primary'
                          : 'opacity-0'
                      )}
                    />
                    {server.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Container — 16:9 constrained on portrait mobile, full height on landscape/desktop */}
      <div className='relative flex flex-1 items-center justify-center overflow-hidden'>
        <div className='relative aspect-video w-full max-h-full md:absolute md:inset-0 md:aspect-auto'>
          {/* Ad-Blocking Click Trap */}
          <div
            className='absolute inset-0 z-30'
            onClick={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* The Player Iframe */}
          <iframe
            key={selectedServer.id}
            src={playerUrl}
            className='h-full w-full border-0'
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={handleServerError}
            title={title}
          />

          {/* Loading Overlay */}
          {isLoading && !allServersFailed && (
            <div className='absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-black'>
              <div className='border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4' />
              <p className='animate-pulse font-medium text-white/60'>
                Requesting Stream...
              </p>
            </div>
          )}

          {/* Error Overlay */}
          {allServersFailed && (
            <div className='absolute inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-black'>
              <div className='text-center space-y-3'>
                <p className='text-xl font-semibold text-white'>
                  Unable to Load Content
                </p>
                <p className='text-sm text-white/60 max-w-xs'>
                  All streaming servers are unavailable. Please try again later.
                </p>
              </div>
              <Button
                variant='outline'
                onClick={resetError}
                className='text-white border-white/20 hover:bg-white/10'
              >
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
