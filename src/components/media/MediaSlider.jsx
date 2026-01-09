import { ChevronRight } from 'lucide-react';
import * as React from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

import { MediaCard } from './MediaCard';

export function MediaSlider({ title, items, isLoading }) {
  return (
    <div className='group/slider relative z-10 space-y-4 font-sans transition-all duration-300 hover:z-20'>
      <div className='relative z-0 flex items-center justify-between'>
        <h2 className='text-foreground/90 text-xl font-bold tracking-tight md:text-2xl'>
          {title}
        </h2>
        <button className='text-muted-foreground hover:text-foreground flex cursor-pointer items-center text-[12px] font-bold tracking-tight transition-colors'>
          View All <ChevronRight className='ml-1 h-3.5 w-3.5' />
        </button>
      </div>

      <Carousel
        className='w-full'
        opts={{ align: 'start', loop: false, slidesToScroll: 'auto' }}
      >
        <CarouselContent className='hide-scrollbar -ml-2 items-start overflow-visible sm:-ml-4'>
          {items?.map((item) => (
            <CarouselItem
              key={item.id}
              className='relative basis-1/2 overflow-visible pl-2 transition-[z-index] duration-0 hover:z-[50] sm:basis-1/3 sm:pl-4 md:basis-1/4 lg:basis-1/5 xl:basis-1/6'
            >
              <MediaCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='bg-background/40 text-foreground hover:bg-background/60 absolute top-1/2 left-1 z-60 h-10 w-10 -translate-y-1/2 rounded-full border-none opacity-0 shadow-lg backdrop-blur-md transition-all group-hover/slider:opacity-100 hover:scale-110 disabled:pointer-events-none disabled:opacity-0 md:left-2' />
        <CarouselNext className='bg-background/40 text-foreground hover:bg-background/60 absolute top-1/2 right-1 z-60 h-10 w-10 -translate-y-1/2 rounded-full border-none opacity-0 shadow-lg backdrop-blur-md transition-all group-hover/slider:opacity-100 hover:scale-110 disabled:pointer-events-none disabled:opacity-0 md:right-2' />
      </Carousel>
    </div>
  );
}
