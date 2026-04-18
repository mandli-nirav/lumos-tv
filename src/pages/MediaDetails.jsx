import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router';

import { MediaDetailContent } from '@/components/media/MediaDetailContent';
import { MediaDetailHero } from '@/components/media/MediaDetailHero';
import { Button } from '@/components/ui/button';
import { useMediaDetails } from '@/hooks/useMedia';

export default function MediaDetails() {
  const { type, id } = useParams();
  const { data: media, isLoading } = useMediaDetails(type, id);
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailerVideo, setShowTrailerVideo] = useState(false);


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

  if (!media) return null;

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
