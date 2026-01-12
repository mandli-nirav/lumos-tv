import 'react-lazy-load-image-component/src/effects/blur.css';

import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Play, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Slider from 'react-slick';

import { getImageUrl } from '@/api/tmdb';
import { AddToLibraryButton } from '@/components/media/AddToLibraryButton';
import { WatchNowButton } from '@/components/media/WatchNowButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGenres } from '@/hooks/useMedia';
import { cn } from '@/lib/utils';

export default function HeroSlider({ data, isLoading }) {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const { data: genreMap } = useGenres();

  const settingsMain = {
    asNavFor: nav2 || undefined,
    ref: (slider) => setNav1(slider),
    arrows: false,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    dotsClass: 'slick-dots slick-thumb-dots',
  };

  const settingsThumb = {
    asNavFor: nav1 || undefined,
    ref: (slider) => setNav2(slider),
    slidesToShow: 4,
    swipeToSlide: true,
    focusOnSelect: true,
    arrows: false,
    infinite: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  const trendingItems = data?.results?.slice(0, 5) || [];

  if (isLoading) {
    return (
      <div className='relative h-[90vh] w-full overflow-hidden bg-[#050505]'>
        {/* Background Gradients to match real slider */}
        <div className='absolute inset-0 z-10 bg-linear-to-r from-[#050505] via-[#050505]/60 to-transparent' />
        <div className='absolute inset-0 z-10 bg-linear-to-t from-[#050505] via-transparent to-transparent' />

        {/* Background Skeleton */}
        <Skeleton className='absolute inset-0 h-full w-full rounded-none bg-zinc-900/20' />

        {/* Content Skeleton */}
        <div className='relative z-20 container mx-auto flex h-full flex-col justify-center px-4 md:px-12'>
          <div className='max-w-2xl space-y-8'>
            <div className='flex items-center gap-4'>
              <Skeleton className='h-6 w-28 bg-zinc-800/40' />
              <Skeleton className='h-5 w-20 bg-zinc-800/40' />
            </div>
            <Skeleton className='h-24 w-full bg-zinc-800/40 md:h-40' />
            <div className='flex items-center gap-4'>
              <Skeleton className='h-5 w-16 bg-zinc-800/40' />
              <Skeleton className='h-5 w-40 bg-zinc-800/40' />
              <Skeleton className='h-5 w-14 bg-zinc-800/40' />
            </div>
            <div className='space-y-3'>
              <Skeleton className='h-4 w-full bg-zinc-800/20' />
              <Skeleton className='h-4 w-5/6 bg-zinc-800/20' />
              <Skeleton className='h-4 w-4/6 bg-zinc-800/20' />
            </div>
            <div className='flex items-center gap-5 pt-6'>
              <Skeleton className='h-12 w-40 rounded-lg bg-zinc-800/40' />
              <Skeleton className='h-12 w-12 rounded-lg bg-zinc-800/40' />
            </div>
          </div>
        </div>

        {/* Thumbnails Skeleton */}
        <div className='absolute bottom-12 z-30 w-full'>
          <div className='container mx-auto flex justify-end px-4'>
            <div className='flex w-full max-w-sm gap-3 md:max-w-md lg:max-w-lg'>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton
                  key={i}
                  className='aspect-video flex-1 rounded-xl bg-zinc-800/30'
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (trendingItems.length === 0) return null;

  return (
    <div className='relative h-[90vh] w-full overflow-hidden font-sans'>
      <Slider {...settingsMain} className='hero-slider h-full w-full'>
        {trendingItems.map((item) => (
          <div key={item.id} className='relative h-[90vh] w-full'>
            {/* Background Backdrop */}
            <div className='absolute inset-0'>
              <LazyLoadImage
                src={getImageUrl(item.backdrop_path, 'original')}
                alt={item.title || item.name}
                effect='blur'
                className='h-full w-full object-cover'
                wrapperClassName='h-full w-full !block'
              />
              {/* Overlays */}
              <div className='from-background via-background/60 absolute inset-0 hidden bg-linear-to-r to-transparent md:block' />
              <div className='from-background via-background/80 absolute inset-0 bg-linear-to-t to-transparent' />
              {/* Extra bottom protection for mobile content */}
              <div className='from-background absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t via-transparent to-transparent md:hidden' />
            </div>

            {/* Content */}
            <div className='relative container mx-auto flex h-full flex-col justify-end px-4 pb-24 md:justify-center md:px-12 md:pb-0'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='mx-auto max-w-3xl space-y-4 text-center md:mx-0 md:space-y-6 md:text-left'
              >
                <div className='flex items-center justify-center gap-4 md:justify-start'>
                  <Badge
                    variant='secondary'
                    className='bg-primary/15 text-primary border-none px-3 py-1 text-[10px] font-bold tracking-widest uppercase'
                  >
                    Newly Added
                  </Badge>
                  <div className='text-foreground flex items-center gap-1 text-sm font-bold'>
                    <Star className='fill-primary text-primary h-4 w-4' />
                    <span>{item.vote_average?.toFixed(1)}</span>
                  </div>
                </div>

                <h1 className='text-foreground text-3xl leading-[1.1] font-bold md:text-4xl lg:text-6xl'>
                  {item.title || item.name}
                </h1>

                <div className='text-muted-foreground flex items-center justify-center gap-3 text-xs font-bold tracking-wider uppercase md:justify-start md:text-sm'>
                  <span>
                    {item.release_date || item.first_air_date
                      ? format(
                          parseISO(item.release_date || item.first_air_date),
                          'yyyy'
                        )
                      : 'N/A'}
                  </span>
                  {item.genre_ids && genreMap && (
                    <>
                      <span className='text-primary/40'>•</span>
                      <span>
                        {item.genre_ids
                          .slice(0, 2)
                          .map((id) => genreMap[id])
                          .filter(Boolean)
                          .join(' • ')}
                      </span>
                    </>
                  )}
                  <span className='text-primary/40'>•</span>
                  <span>{item.original_language?.toUpperCase()}</span>
                </div>

                <p className='text-muted-foreground mx-auto line-clamp-2 max-w-xl text-base leading-relaxed font-medium md:mx-0 md:line-clamp-3 md:text-lg'>
                  {item.overview}
                </p>

                <div className='flex flex-col items-center gap-3 pt-4 md:flex-row md:items-start md:gap-4'>
                  <WatchNowButton
                    item={item}
                    className='w-full text-lg md:w-auto md:text-base'
                  />
                  <AddToLibraryButton />
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Thumbnail Navigation */}
      <div className='absolute bottom-12 z-10 hidden w-full md:block'>
        <div className='container mx-auto flex justify-end px-4'>
          <div className='w-full max-w-75 md:max-w-100 lg:max-w-125'>
            <Slider {...settingsThumb} className='thumbnail-slider'>
              {trendingItems.map((item, index) => (
                <div key={item.id} className='px-1 outline-none'>
                  <div
                    onClick={() => nav1?.slickGoTo(index)}
                    className={cn(
                      'thumbnail-item relative aspect-video cursor-pointer overflow-hidden rounded-md border-2 transition-all duration-300',
                      'border-transparent'
                    )}
                  >
                    <LazyLoadImage
                      src={getImageUrl(item.backdrop_path, 'w300')}
                      alt={item.title || item.name}
                      effect='blur'
                      className='h-full w-full object-cover'
                      wrapperClassName='h-full w-full !block'
                    />
                    <div className='absolute inset-0 bg-black/40' />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}
