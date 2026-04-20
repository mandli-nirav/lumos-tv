import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';
import { Link } from 'react-router';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';

import { MediaCard } from './MediaCard';

export function MediaSlider({
  title,
  items,
  isLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  viewAllPath,
}) {
  const [api, setApi] = React.useState(null);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const updateFades = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateFades();
    api.on('select', updateFades);
    api.on('reInit', updateFades);
    api.on('scroll', updateFades);

    return () => {
      api.off('select', updateFades);
      api.off('reInit', updateFades);
      api.off('scroll', updateFades);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || !fetchNextPage || !hasNextPage || isFetchingNextPage) return;

    const onScroll = () => {
      const scrollProgress = api.scrollProgress();
      // If we've scrolled more than 90%, load more
      if (scrollProgress > 0.9) {
        fetchNextPage();
      }
    };

    api.on('scroll', onScroll);
    return () => api.off('scroll', onScroll);
  }, [api, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className='group/slider relative z-10 space-y-4 font-sans transition-all duration-300 hover:z-30'>
      <div className='relative z-0 flex items-center justify-between'>
        <h2 className='text-foreground/90 text-xl font-bold tracking-tight md:text-2xl'>
          {title}
        </h2>
        {viewAllPath && (
          <Link
            to={viewAllPath}
            className='text-muted-foreground hover:text-foreground flex items-center text-[12px] font-bold tracking-tight transition-colors'
          >
            View All <ChevronRight className='ml-1 h-3.5 w-3.5' />
          </Link>
        )}
      </div>

      <div className='relative'>
        <Carousel
          setApi={setApi}
          className='w-full'
          opts={{ align: 'start', loop: false, slidesToScroll: 'auto' }}
        >
          <CarouselContent className='hide-scrollbar -ml-2 items-start overflow-visible sm:-ml-4'>
            {items?.map((item, index) => (
              <CarouselItem
                key={`${item.id}-${index}`}
                className='relative basis-1/2 overflow-visible pl-2 transition-[z-index] duration-0 hover:z-30 sm:basis-1/3 sm:pl-4 md:basis-1/4 lg:basis-1/5 xl:basis-1/6'
              >
                <MediaCard item={item} />
              </CarouselItem>
            ))}
            {isFetchingNextPage &&
              [...Array(2)].map((_, i) => (
                <CarouselItem
                  key={`skeleton-${i}`}
                  className='relative basis-1/2 overflow-visible pl-2 sm:basis-1/3 sm:pl-4 md:basis-1/4 lg:basis-1/5 xl:basis-1/6'
                >
                  <div className='relative aspect-2/3 w-full overflow-hidden rounded-xl'>
                    <Skeleton className='h-full w-full bg-white/5' />
                    {i === 0 && (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <Spinner className='text-primary h-8 w-8' />
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className='bg-background/40 text-foreground hover:bg-background/60 absolute top-1/2 left-1 z-30 h-10 w-10 -translate-y-1/2 rounded-full border-none opacity-0 shadow-lg backdrop-blur-md transition-all group-hover/slider:opacity-100 hover:scale-110 disabled:pointer-events-none disabled:opacity-0 md:left-2' />
          <CarouselNext className='bg-background/40 text-foreground hover:bg-background/60 absolute top-1/2 right-1 z-30 h-10 w-10 -translate-y-1/2 rounded-full border-none opacity-0 shadow-lg backdrop-blur-md transition-all group-hover/slider:opacity-100 hover:scale-110 disabled:pointer-events-none disabled:opacity-0 md:right-2' />
        </Carousel>

        {/* Edge fades — appear when there's content scrolled off-screen */}
        <motion.div
          aria-hidden
          animate={{ opacity: canScrollPrev ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className='from-background pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r to-transparent sm:w-16'
        />
        <motion.div
          aria-hidden
          animate={{ opacity: canScrollNext ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className='from-background pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l to-transparent sm:w-16'
        />
      </div>
    </div>
  );
}
