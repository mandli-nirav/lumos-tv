import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

import { MediaDetailContent } from '@/components/media/MediaDetailContent';
import { MediaDetailHero } from '@/components/media/MediaDetailHero';
import { Button } from '@/components/ui/button';
import { useMediaDetails } from '@/hooks/useMedia';

export default function MediaDetails() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { data: media, isLoading } = useMediaDetails(type, id);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

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
        {/* Back Button - Fixed/Absolute with glassmorphism */}
        <div className='pointer-events-none absolute inset-x-0 top-20 z-50 w-full px-4 md:top-24 md:px-12 lg:px-16'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className='pointer-events-auto'
          >
            <Button
              onClick={handleBack}
              variant='outline'
              size='icon'
              className='bg-background/40 border-border h-10 w-10 cursor-pointer rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-95'
            >
              <ChevronLeft className='h-6 w-6' />
              <span className='sr-only'>Back</span>
            </Button>
          </motion.div>
        </div>

        <div className='relative pb-24'>
          <MediaDetailHero media={media} />

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
