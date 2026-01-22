import { motion, useScroll, useTransform } from 'framer-motion';
import _ from 'lodash';
import { Star, Volume2 } from 'lucide-react';
import { useRef } from 'react';

import { getImageUrl } from '@/api/tmdb';
import { Button } from '@/components/ui/button';

import { AddToLibraryButton } from './AddToLibraryButton';
import { WatchNowButton } from './WatchNowButton';

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

  // Get the best logo (prefer English, then original language, then first available)
  const logos = _.get(media, 'images.logos', []);
  const logo = _.head(
    _.orderBy(
      logos,
      [
        (l) => l.iso_639_1 === 'en',
        (l) => l.iso_639_1 === media.original_language,
        'vote_average',
      ],
      ['desc', 'desc', 'desc']
    )
  );

  return (
    <div
      ref={heroRef}
      className='relative h-140 w-full overflow-hidden font-sans md:h-160'
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
          className='absolute inset-0 h-full w-full object-cover object-top'
        />
        {/* Smooth multi-layer gradients for seamless blending */}
        {/* Base gradient - bottom to top */}
        <div className='from-background via-background/80 absolute inset-0 bg-linear-to-t via-30% to-transparent to-60%' />

        {/* Additional smoothing layer for bottom edge */}
        <div className='from-background via-background/50 absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t via-20% to-transparent to-50%' />

        {/* Side gradient for desktop - left to right */}
        <div className='from-background/90 via-background/40 absolute inset-0 hidden bg-linear-to-r via-35% to-transparent to-70% md:block' />

        {/* Extra smoothing for mobile */}
        <div className='from-background absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t to-transparent md:hidden' />
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        style={{ y: contentY }}
        className='relative z-30 flex h-full items-center justify-center p-6 pb-12 md:items-end md:justify-start md:px-12 md:pb-20'
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='flex w-full max-w-3xl flex-col items-center space-y-4 text-center md:items-start md:space-y-6 md:text-left'
        >
          {/* Metadata Bar */}
          <div className='text-foreground/90 flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold md:justify-start md:gap-3 md:text-sm'>
            <span>{year}</span>
            <span className='text-foreground/30'>•</span>
            <span>{duration}</span>
            <span className='text-foreground/30'>•</span>
            <div className='bg-primary/20 text-primary flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px] tracking-wider uppercase'>
              {language}
            </div>
            <span className='text-foreground/30'>•</span>
            <div className='flex items-center gap-1 text-yellow-500'>
              <Star className='h-3.5 w-3.5 fill-yellow-500' />
              <span>{rating}</span>
            </div>
          </div>

          {/* Title / Logo */}
          {logo ? (
            <img
              src={getImageUrl(logo.file_path, 'w500')}
              alt={title}
              className='h-auto w-full max-w-45 md:max-w-60'
              style={{ aspectRatio: logo.aspect_ratio }}
            />
          ) : (
            <h1 className='text-foreground text-3xl leading-[1.1] font-bold md:text-4xl'>
              {title}
            </h1>
          )}

          {/* Genres */}
          <div className='text-muted-foreground/80 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-bold md:justify-start md:text-base'>
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
          <div className='relative z-50 flex items-center justify-center gap-4 pt-4 md:justify-start'>
            <WatchNowButton item={media} />
            <AddToLibraryButton />
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
