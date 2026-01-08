import { motion, useScroll, useTransform } from 'framer-motion';
import _ from 'lodash';
import { Play, Plus, Star, Volume2 } from 'lucide-react';
import { useRef } from 'react';

import { getImageUrl } from '@/api/tmdb';
import { Button } from '@/components/ui/button';

export function MediaDetailHero({ media }) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const backdropY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  if (!media) return null;

  const title = _.get(media, 'title') || _.get(media, 'name');
  const releaseDate =
    _.get(media, 'release_date') || _.get(media, 'first_air_date');
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = _.get(media, 'vote_average')
    ? _.get(media, 'vote_average').toFixed(1)
    : 'N/A';
  const language = _.toUpper(_.get(media, 'original_language', 'EN'));

  // Format duration
  const runtime =
    _.get(media, 'runtime') || _.head(_.get(media, 'episode_run_time', []));
  const duration = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : _.get(media, 'number_of_seasons')
      ? `${_.get(media, 'number_of_seasons')} Season${
          _.get(media, 'number_of_seasons') > 1 ? 's' : ''
        }`
      : 'N/A';

  const genres = _.join(
    _.map(_.take(_.get(media, 'genres', []), 3), 'name'),
    ' • '
  );

  return (
    <div
      ref={heroRef}
      className='relative aspect-video w-full overflow-hidden font-sans md:aspect-auto md:h-135'
    >
      {/* Immersive Backdrop */}
      <motion.div
        style={{
          y: backdropY,
          scale: backdropScale,
          opacity,
        }}
        className='absolute inset-0 z-0 origin-top'
      >
        <img
          src={getImageUrl(media.backdrop_path, 'original', 'backdrop')}
          alt={title}
          className='h-full w-full object-cover object-top'
        />
        {/* Gradients to blend with content */}
        <div className='from-background via-background/40 absolute inset-0 bg-linear-to-t to-transparent' />
        <div className='from-background via-background/20 absolute inset-0 bg-linear-to-r to-transparent' />
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        style={{ y: contentY }}
        className='relative flex h-full max-w-3xl flex-col justify-end space-y-4 px-6 pb-16 md:space-y-6 md:px-12 md:pb-20'
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='space-y-4'
        >
          {/* Metadata Bar */}
          <div className='text-foreground/90 flex items-center gap-3 text-[12px] font-bold md:text-sm'>
            <span>{year}</span>
            <span className='text-foreground/30'>•</span>
            <span>{duration}</span>
            <span className='text-foreground/30'>•</span>
            <div className='bg-foreground/10 flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] tracking-wider uppercase'>
              {language}
            </div>
            <span className='text-foreground/30'>•</span>
            <div className='flex items-center gap-1 text-yellow-500'>
              <Star className='h-4 w-4 fill-yellow-500' />
              <span>{rating}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className='text-foreground text-3xl leading-tight font-bold md:text-6xl'>
            {title}
          </h1>

          {/* Genres */}
          <div className='text-muted-foreground/80 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold md:text-base'>
            {_.map(_.take(_.get(media, 'genres', []), 3), (genre, i) => (
              <div key={genre.id} className='flex items-center gap-2'>
                <span>{genre.name}</span>
                {i < Math.min(_.get(media, 'genres.length', 0), 3) - 1 && (
                  <span className='text-foreground/20 text-[10px]'>•</span>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className='flex items-center gap-4 pt-4'>
            <Button>
              <Play />
              Watch Now
            </Button>
            <Button variant='secondary' size='icon'>
              <Plus />
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Corner Controls */}
      <div className='absolute right-12 bottom-12 hidden items-center gap-4 md:flex'>
        <Button
          variant='outline'
          size='icon'
          className='bg-background/40 border-border h-10 w-10 rounded-full backdrop-blur-sm'
        >
          <Volume2 className='h-5 w-5' />
        </Button>
      </div>
    </div>
  );
}
