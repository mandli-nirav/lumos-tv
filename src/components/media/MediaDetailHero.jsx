import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import _ from 'lodash';
import { Star, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { getImageUrl } from '@/api/tmdb';
import { Button } from '@/components/ui/button';

import { AddToLibraryButton } from './AddToLibraryButton';
import { WatchNowButton } from './WatchNowButton';

export function MediaDetailHero({ media }) {
  const heroRef = useRef(null);
  const iframeRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const backdropY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 20000); // 20 seconds delay

    return () => clearTimeout(timer);
  }, []);

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

  // Get the best logo
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

  // Get trailer
  const trailer = _.find(
    _.get(media, 'videos.results', []),
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
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
        <AnimatePresence mode='wait'>
          {showVideo && trailer ? (
            <motion.div
              key='trailer'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className='absolute inset-0 z-0'
            >
              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
                className='pointer-events-none h-full w-full scale-135 object-cover'
                allow='autoplay; encrypted-media'
                title='Trailer'
              />
            </motion.div>
          ) : (
            <motion.img
              key='backdrop'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              src={getImageUrl(media.backdrop_path, 'original', 'backdrop')}
              alt={title}
              className='absolute inset-0 h-full w-full object-cover object-top'
            />
          )}
        </AnimatePresence>

        {/* Gradients */}
        <div className='from-background via-background/80 absolute inset-0 z-10 bg-linear-to-t via-30% to-transparent to-60%' />
        <div className='from-background via-background/50 absolute inset-x-0 bottom-0 z-10 h-3/4 bg-linear-to-t via-20% to-transparent to-50%' />
        <div className='from-background/90 via-background/40 absolute inset-0 z-10 hidden bg-linear-to-r via-35% to-transparent to-70% md:block' />
        <div className='from-background absolute inset-x-0 bottom-0 z-10 h-1/3 bg-linear-to-t to-transparent md:hidden' />
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        style={{ y: contentY }}
        className='relative z-30 flex h-full items-center justify-center pb-12 md:items-end md:pb-20'
      >
        <div className='container mx-auto px-6 md:px-12'>
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
        </div>
      </motion.div>

      {/* Corner Controls */}
      <div className='pointer-events-none absolute inset-x-0 bottom-12 z-40 container mx-auto hidden px-6 md:block md:px-12'>
        <div className='pointer-events-auto flex justify-end'>
          <AnimatePresence>
            {showVideo && trailer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    const newMuted = !isMuted;
                    setIsMuted(newMuted);
                    if (iframeRef.current) {
                      iframeRef.current.contentWindow.postMessage(
                        JSON.stringify({
                          event: 'command',
                          func: newMuted ? 'mute' : 'unMute',
                        }),
                        '*'
                      );
                      if (!newMuted) {
                        iframeRef.current.contentWindow.postMessage(
                          JSON.stringify({
                            event: 'command',
                            func: 'setVolume',
                            args: [100],
                          }),
                          '*'
                        );
                      }
                    }
                  }}
                  className='bg-background/40 border-border hover:bg-background/60 h-10 w-10 rounded-full backdrop-blur-sm transition-all active:scale-95'
                >
                  {isMuted ? (
                    <VolumeX className='h-5 w-5' />
                  ) : (
                    <Volume2 className='h-5 w-5' />
                  )}
                  <span className='sr-only'>
                    {isMuted ? 'Unmute' : 'Mute'} trailer
                  </span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
