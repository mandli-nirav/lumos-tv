import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Play, Plus, Star } from 'lucide-react';
import { useState } from 'react';
import Slider from 'react-slick';

import { getImageUrl } from '@/api/tmdb';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGenres } from '@/hooks/useMedia';
import { cn } from '@/lib/utils';

export default function HeroSlider({ data }) {
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

  if (trendingItems.length === 0) return null;

  return (
    <div className='relative h-[85vh] w-full overflow-hidden font-sans'>
      <Slider {...settingsMain} className='hero-slider h-full w-full'>
        {trendingItems.map((item) => (
          <div key={item.id} className='relative h-[85vh] w-full'>
            {/* Background Backdrop */}
            <div className='absolute inset-0'>
              <img
                src={getImageUrl(item.backdrop_path, 'original')}
                alt={item.title || item.name}
                className='h-full w-full object-cover'
              />
              {/* Overlays */}
              <div className='from-background via-background/60 absolute inset-0 bg-linear-to-r to-transparent' />
              <div className='from-background absolute inset-0 bg-linear-to-t via-transparent to-transparent' />
            </div>

            {/* Content */}
            <div className='relative z-10 container mx-auto flex h-full flex-col justify-center px-4 md:px-12'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className='max-w-2xl space-y-6'
              >
                <div className='flex items-center gap-4'>
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

                <h1 className='text-foreground text-4xl leading-[0.9] font-black tracking-tighter md:text-6xl lg:text-8xl'>
                  {item.title || item.name}
                </h1>

                <div className='text-muted-foreground flex items-center gap-3 text-sm font-bold tracking-wider uppercase'>
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

                <p className='text-muted-foreground line-clamp-3 max-w-xl text-lg leading-relaxed font-medium'>
                  {item.overview}
                </p>

                <div className='flex items-center gap-4 pt-4'>
                  <Button>
                    <Play />
                    Watch Now
                  </Button>
                  <Button size='icon' variant='outline'>
                    <Plus />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Thumbnail Navigation */}
      <div className='absolute bottom-12 z-20 w-full'>
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
                    <img
                      src={getImageUrl(item.backdrop_path, 'w300')}
                      alt={item.title || item.name}
                      className='h-full w-full object-cover'
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
