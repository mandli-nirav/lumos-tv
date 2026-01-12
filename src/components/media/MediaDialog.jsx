import { X } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMediaDetails } from '@/hooks/useMedia';

import { MediaDetailContent } from './MediaDetailContent';
import { MediaDetailHero } from './MediaDetailHero';

export function MediaDialog() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: media, isLoading } = useMediaDetails(type, id);

  const handleClose = () => {
    if (location.state?.backgroundLocation) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  if (!id) return null;

  return (
    <Dialog open={!!id} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className='border-border bg-background text-foreground flex h-[90vh] w-[95vw] flex-col overflow-hidden border p-0 outline-none sm:max-w-5xl sm:rounded-2xl lg:max-w-6xl'
      >
        <DialogTitle className='sr-only'>
          {media?.title || media?.name || 'Media Details'}
        </DialogTitle>
        <DialogDescription className='sr-only'>
          Information about {media?.title || media?.name}
        </DialogDescription>

        {isLoading ? (
          <div className='flex h-112.5 items-center justify-center'>
            <div className='border-primary/20 border-t-primary h-8 w-8 animate-spin rounded-full border-4' />
          </div>
        ) : media ? (
          <>
            <ScrollArea key={id} className='h-full min-h-0 w-full flex-1'>
              <div className='relative pb-12'>
                <MediaDetailHero media={media} />
                <MediaDetailContent media={media} />
              </div>
            </ScrollArea>

            {/* Custom Close Button - Fixed Position */}
            <button
              onClick={handleClose}
              className='bg-background/40 hover:bg-background/60 text-foreground border-border absolute top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-transform hover:scale-110 active:scale-95'
            >
              <X className='h-6 w-6' />
            </button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
