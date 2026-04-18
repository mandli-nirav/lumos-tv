import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { Link, useParams } from 'react-router';

import { MediaDetailContent } from '@/components/media/MediaDetailContent';
import { MediaDetailHero } from '@/components/media/MediaDetailHero';
import { Button } from '@/components/ui/button';
import { useMediaDetails } from '@/hooks/useMedia';

const NotFound = lazy(() => import('@/pages/NotFound'));

export default function MediaDetails() {
  const { type, id } = useParams();
  const { data: media, isLoading, isError, refetch } = useMediaDetails(type, id);
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailerVideo, setShowTrailerVideo] = useState(false);

  if (type !== 'movie' && type !== 'tv') {
    return (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    );
  }

  if (isLoading) {
    return (
      <div className='bg-background flex h-screen items-center justify-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className='border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4'
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='bg-background flex h-[70vh] flex-col items-center justify-center gap-4 text-center'>
        <h1 className='text-4xl font-extrabold'>Something went wrong</h1>
        <p className='text-muted-foreground text-lg'>
          Failed to load content details. Please try again.
        </p>
        <div className='flex gap-3'>
          <Button variant='outline' onClick={() => refetch()}>
            Try Again
          </Button>
          <Button asChild>
            <Link to='/'>Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!media) {
    return (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    );
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={`details-${id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className='bg-background min-h-screen'
      >
        {/* Volume control for trailer */}
        <AnimatePresence>
          {showTrailerVideo && (
            <div className='pointer-events-none absolute inset-x-0 top-20 z-50 container mx-auto md:top-24'>
              <div className='flex justify-end'>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className='pointer-events-auto'
                >
                  <Button
                    variant='outline'
                    size='icon'
                    className='bg-background/40 border-border h-10 w-10 cursor-pointer rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95'
                    onClick={() => setIsMuted((m) => !m)}
                  >
                    {isMuted ? (
                      <VolumeX className='h-5 w-5' />
                    ) : (
                      <Volume2 className='h-5 w-5' />
                    )}
                    <span className='sr-only'>{isMuted ? 'Unmute' : 'Mute'}</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

        <div className='relative pb-[calc(6rem+env(safe-area-inset-bottom,0px))]'>
          <MediaDetailHero
            media={media}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            onVideoShow={setShowTrailerVideo}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
          >
            <MediaDetailContent media={media} />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
