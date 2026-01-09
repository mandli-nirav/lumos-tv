import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft,
  Info,
  Maximize,
  Play,
  Server,
  Settings,
} from 'lucide-react';
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
import { cn } from '@/lib/utils';

const SERVERS = [
  {
    id: 'vidsrc-cc',
    name: 'Server 1 (VidSrc.cc)',
    url: 'https://vidsrc.cc/v2/embed',
  },
  {
    id: 'vidsrc-me',
    name: 'Server 2 (VidSrc.me)',
    url: 'https://vidsrc.me/embed',
  },
  {
    id: 'vidsrc-pro',
    name: 'Server 3 (VidSrc.pro)',
    url: 'https://vidsrc.pro/embed',
  },
  { id: '2embed', name: 'Server 4 (2Embed)', url: 'https://www.2embed.cc' },
  {
    id: 'autoembed',
    name: 'Server 5 (AutoEmbed 1)',
    url: 'https://player.autoembed.cc/embed',
  },
  {
    id: 'autoembed-2',
    name: 'Server 6 (AutoEmbed 2)',
    url: 'https://player.autoembed.cc/embed',
  },
  {
    id: 'autoembed-3',
    name: 'Server 7 (AutoEmbed 3)',
    url: 'https://player.autoembed.cc/embed',
  },
];

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
  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);
  const [showControls, setShowControls] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Auto-hide controls after 3 seconds of inactivity (but not when dropdown is open)
  useEffect(() => {
    let timeout;
    if (showControls && !dropdownOpen) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, dropdownOpen]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const constructUrl = (server) => {
    const isMovie = type === 'movie';

    if (isMovie) {
      // Movie URL patterns
      if (server.id === 'vidsrc-cc') {
        return `${server.url}/movie/${id}`;
      }
      if (server.id === 'vidsrc-me') {
        return `${server.url}/movie?tmdb=${id}`;
      }
      if (server.id === 'vidsrc-pro') {
        return `${server.url}/movie/${id}`;
      }
      if (server.id === '2embed') {
        return `${server.url}/embed/${id}`;
      }
      if (server.id === 'autoembed') {
        return `${server.url}/movie/${id}`;
      }
      if (server.id === 'autoembed-2') {
        return `${server.url}/movie/${id}?server=2`;
      }
      if (server.id === 'autoembed-3') {
        return `${server.url}/movie/${id}?server=3`;
      }
    } else {
      // TV Show URL patterns
      if (server.id === 'vidsrc-cc') {
        return `${server.url}/tv/${id}/${season}/${episode}`;
      }
      if (server.id === 'vidsrc-me') {
        return `${server.url}/tv?tmdb=${id}&season=${season}&episode=${episode}`;
      }
      if (server.id === 'vidsrc-pro') {
        return `${server.url}/tv/${id}/${season}/${episode}`;
      }
      if (server.id === '2embed') {
        return `${server.url}/embedtv/${id}&s=${season}&e=${episode}`;
      }
      if (server.id === 'embed-su') {
        return `${server.url}/tv/${id}/${season}/${episode}`;
      }
      if (server.id === 'multiembed') {
        return `${server.url}/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`;
      }
      if (server.id === 'moviesapi') {
        return `${server.url}/tv/${id}/${season}/${episode}`;
      }
      if (server.id === 'vidlink') {
        return `https://vidlink.pro/tv/${id}/${season}/${episode}`;
      }
      if (server.id === 'smashystream') {
        return `${server.url}/tv?tmdb=${id}&season=${season}&episode=${episode}`;
      }
      if (server.id === 'autoembed') {
        return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;
      }
      if (server.id === 'autoembed-2') {
        return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}?server=2`;
      }
      if (server.id === 'autoembed-3') {
        return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}?server=3`;
      }
    }

    // Fallback
    return `${server.url}/movie/${id}`;
  };

  return (
    <div className='flex h-screen w-full flex-col bg-black'>
      {/* Fixed Header Bar */}
      <div className='flex items-center justify-between border-b border-white/10 bg-black/95 px-4 py-3 backdrop-blur-md'>
        <div className='flex items-center gap-4'>
          <Button
            variant='ghost'
            size='icon'
            className='rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20'
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className='h-6 w-6 text-white' />
          </Button>
          <div className='flex flex-col'>
            <h1 className='text-lg font-bold tracking-tight text-white md:text-xl'>
              {title}
            </h1>
            {metadata && (
              <p className='text-xs font-medium text-white/60'>{metadata}</p>
            )}
          </div>
        </div>

        {/* Server Selection Dropdown */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='gap-2 rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
            >
              <Server className='h-4 w-4' />
              <span className='hidden sm:inline'>{selectedServer.name}</span>
              <Settings className='ml-1 h-4 w-4 opacity-60' />
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
            {SERVERS.map((server) => (
              <DropdownMenuItem
                key={server.id}
                onClick={() => {
                  setIsReady(false);
                  setSelectedServer(server);
                }}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors',
                  selectedServer.id === server.id
                    ? 'bg-primary/20 text-primary font-bold'
                    : 'hover:bg-white/10'
                )}
              >
                <Play
                  className={cn(
                    'h-3 w-3',
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
      </div>

      {/* Player Container */}
      <div
        className='group/player relative flex-1 overflow-hidden'
        onMouseMove={handleMouseMove}
      >
        {/* Ad-Blocking Click Trap - Helps catch initial popup-generating clicks */}
        <div
          className='absolute inset-0 z-30'
          onClick={(e) => {
            // This is a subtle trick: we trap the first click which usually triggers popups
            // on some bad servers. Then we remove the trap.
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* The Player Iframe */}
        <iframe
          key={selectedServer.id}
          src={constructUrl(selectedServer)}
          className='h-full w-full border-0'
          sandbox='allow-scripts allow-same-origin allow-presentation'
          allowFullScreen
          onLoad={() => setIsReady(true)}
          onError={() => {
            // Try next server on error
            const currentIndex = SERVERS.findIndex(
              (s) => s.id === selectedServer.id
            );
            if (currentIndex < SERVERS.length - 1) {
              setIsReady(false);
              setSelectedServer(SERVERS[currentIndex + 1]);
            }
          }}
          title={title}
        />

        {/* Bottom Overlay - Only show tip */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='pointer-events-none absolute inset-x-0 bottom-0 z-50 bg-linear-to-t from-black/80 to-transparent p-6'
            >
              <div className='pointer-events-auto flex justify-end'>
                <div className='flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/50 backdrop-blur-md'>
                  <Info className='h-3 w-3' />
                  <span>
                    Tip: If video doesn't load, try switching servers from the
                    top right.
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        {!isReady && (
          <div className='absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-black'>
            <div className='border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4' />
            <p className='animate-pulse font-medium text-white/60'>
              Requesting Stream...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
