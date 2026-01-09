import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Eye, Info, Radio, Server, Settings } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function StreamPlayer({ match, sources }) {
  const navigate = useNavigate();

  // Get the default stream (HD if available, otherwise first stream)
  const defaultStream = useMemo(() => {
    if (!sources || sources.length === 0) return null;
    const hdStream = sources.find((s) => s.hd);
    return hdStream || sources[0];
  }, [sources]);

  const [selectedStream, setSelectedStream] = useState(defaultStream);
  const [showControls, setShowControls] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [showSourceDialog, setShowSourceDialog] = useState(false);

  // Update selected stream when sources change (e.g., when navigating to a new match)
  useEffect(() => {
    setSelectedStream(defaultStream);
  }, [defaultStream]);

  // Group sources by provider
  const groupedSources = sources?.reduce((acc, source) => {
    if (!acc[source.source]) {
      acc[source.source] = [];
    }
    acc[source.source].push(source);
    return acc;
  }, {});

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    let timeout;
    if (showControls && !showSourceDialog) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, showSourceDialog]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  if (!sources || sources.length === 0) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-black'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-white'>
            No streams available
          </h2>
          <p className='mt-2 text-white/60'>
            This match doesn't have any active streams yet
          </p>
          <Button
            onClick={() => navigate('/sports')}
            className='mt-6'
            variant='outline'
          >
            <ChevronLeft className='mr-2 h-4 w-4' />
            Back to Sports
          </Button>
        </div>
      </div>
    );
  }

  const getQualityBadge = (hd) => {
    return hd ? (
      <Badge variant='destructive' className='text-xs'>
        HD
      </Badge>
    ) : (
      <Badge variant='secondary' className='text-xs'>
        SD
      </Badge>
    );
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
            onClick={() => navigate('/sports')}
          >
            <ChevronLeft className='h-6 w-6 text-white' />
          </Button>
          <div className='flex flex-col gap-2'>
            <h1 className='text-lg font-bold tracking-tight text-white md:text-xl'>
              {match?.title || 'Live Match'}
            </h1>
            <div className='flex items-center gap-2'>
              {/* LIVE Badge */}
              <div className='flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold'>
                <Radio className='h-2.5 w-2.5 animate-pulse text-red-500' />
                <span className='text-red-500'>LIVE</span>
              </div>

              {/* Viewer Count */}
              {selectedStream?.viewers !== undefined && (
                <div className='flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px]'>
                  <Eye className='h-2.5 w-2.5 text-white/60' />
                  <span className='text-white/60'>
                    {selectedStream.viewers} watching
                  </span>
                </div>
              )}

              {/* Category */}
              {match?.category && (
                <span className='text-xs font-medium text-white/60 capitalize'>
                  • {match.category}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stream Source Button */}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowSourceDialog(true)}
          className='gap-2 rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
        >
          <Server className='h-4 w-4' />
          <span className='hidden capitalize sm:inline'>
            {selectedStream?.source || 'Select Source'}
          </span>
          {selectedStream?.hd && (
            <Badge variant='destructive' className='ml-1 text-[10px]'>
              HD
            </Badge>
          )}
          <Settings className='ml-1 h-4 w-4 opacity-60' />
        </Button>
      </div>

      {/* Player Container */}
      <div
        className='relative flex-1 overflow-hidden'
        onMouseMove={handleMouseMove}
      >
        {/* The Stream Iframe */}
        {selectedStream && (
          <iframe
            key={selectedStream.id}
            src={selectedStream.embedUrl}
            className='h-full w-full border-0'
            allowFullScreen
            onLoad={() => setIsReady(true)}
            title={match?.title || 'Live Stream'}
          />
        )}

        {/* Bottom Overlay - Only show tip on hover */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='pointer-events-none absolute inset-x-0 bottom-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-6'
            >
              <div className='pointer-events-auto flex justify-end'>
                <div className='flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/50 backdrop-blur-md'>
                  <Info className='h-3 w-3' />
                  <span>
                    Tip: If stream doesn't load, try switching to a different
                    source.
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
              Loading Stream...
            </p>
          </div>
        )}
      </div>

      {/* Stream Source Selection Dialog */}
      <Dialog open={showSourceDialog} onOpenChange={setShowSourceDialog}>
        <DialogContent className='max-w-2xl border-zinc-800 bg-zinc-900 text-white'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>
              Available Streams
            </DialogTitle>
            <DialogDescription className='text-zinc-400'>
              Select a stream source and quality
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className='max-h-[60vh]'>
            <div className='space-y-4 pr-4'>
              {groupedSources &&
                Object.entries(groupedSources).map(([provider, streams]) => (
                  <div
                    key={provider}
                    className='rounded-lg border border-zinc-800 bg-zinc-800/50 p-4'
                  >
                    <div className='mb-3 flex items-center justify-between'>
                      <h3 className='text-lg font-bold capitalize'>
                        {provider}
                      </h3>
                      <Badge variant='outline' className='text-xs'>
                        {streams.length} stream{streams.length > 1 ? 's' : ''}
                      </Badge>
                    </div>

                    <div className='space-y-2'>
                      {streams.map((stream) => (
                        <button
                          key={stream.id + stream.streamNo}
                          onClick={() => {
                            setIsReady(false);
                            setSelectedStream(stream);
                            setShowSourceDialog(false);
                          }}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg border p-3 transition-all',
                            selectedStream?.id === stream.id &&
                              selectedStream?.streamNo === stream.streamNo
                              ? 'border-primary bg-primary/20 text-primary font-bold'
                              : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600 hover:bg-zinc-800'
                          )}
                        >
                          <div className='flex items-center gap-3'>
                            {selectedStream?.id === stream.id &&
                              selectedStream?.streamNo === stream.streamNo && (
                                <Radio className='text-primary h-4 w-4 animate-pulse' />
                              )}
                            <span className='font-medium'>
                              Stream {stream.streamNo}
                            </span>
                            <Badge
                              variant={stream.hd ? 'destructive' : 'secondary'}
                              className='text-xs'
                            >
                              {stream.hd ? 'HD' : 'SD'}
                            </Badge>
                          </div>
                          <div className='flex items-center gap-3 text-sm text-zinc-400'>
                            <span>{stream.language}</span>
                            {stream.viewers !== undefined && (
                              <div className='flex items-center gap-1'>
                                <Eye className='h-3 w-3' />
                                <span>{stream.viewers}</span>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
