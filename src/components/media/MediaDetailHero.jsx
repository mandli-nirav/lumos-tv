import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Download, ExternalLink, Play, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { getImageUrl } from '@/api/tmdb';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { WatchNowButton } from './WatchNowButton';

export function MediaDetailHero({ media, isMuted, setIsMuted, onVideoShow }) {
  const heroRef = useRef(null);
  const iframeRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const backdropY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const backdropScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.25]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Auto-play trailer after 20 seconds (desktop only)
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const timer = setTimeout(() => {
      setShowVideo(true);
      onVideoShow?.(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, [onVideoShow]);

  // Sync mute state to the YouTube iframe
  const [iframeReady, setIframeReady] = useState(false);
  useEffect(() => {
    if (!iframeRef.current || !showVideo || !iframeReady) return;
    iframeRef.current.contentWindow?.postMessage(
      { event: 'command', func: isMuted ? 'mute' : 'unMute' },
      'https://www.youtube.com'
    );
  }, [isMuted, showVideo, iframeReady]);

  // Handle ESC key to close trailer modal
  useEffect(() => {
    if (!showTrailerModal) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowTrailerModal(false);
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showTrailerModal]);

  if (!media) return null;

  const title = media.title || media.name;
  const releaseDate = media.release_date || media.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = media.vote_average ? media.vote_average.toFixed(1) : 'N/A';
  const language = (media.original_language || 'EN').toUpperCase();

  // Get certification (movie: release_dates, TV: content_ratings)
  const certification = (() => {
    // Movie certification from release_dates
    const usRelease = media.release_dates?.results?.find((r) => r.iso_3166_1 === 'US');
    const movieCert = usRelease?.release_dates
      ?.map((d) => d.certification)
      .find((c) => c);
    if (movieCert) return movieCert;

    // TV content rating
    const usRating = media.content_ratings?.results?.find((r) => r.iso_3166_1 === 'US');
    return usRating?.rating || null;
  })();

  // Format duration
  const runtime = media.runtime || media.episode_run_time?.[0];
  const duration = runtime
    ? `${Math.floor(runtime / 60)}h ${runtime % 60}m`
    : media.number_of_seasons
      ? `${media.number_of_seasons} Season${
          media.number_of_seasons > 1 ? 's' : ''
        }`
      : 'N/A';

  const genres = (media.genres || [])
    .slice(0, 3)
    .map((g) => g.name)
    .join(' • ');

  // Get the best logo (prefer landscape)
  const logos = media.images?.logos || [];
  const logo = [...logos].sort((a, b) => {
    const isLandscapeA = a.aspect_ratio >= 1.5;
    const isLandscapeB = b.aspect_ratio >= 1.5;
    if (isLandscapeA && !isLandscapeB) return -1;
    if (!isLandscapeA && isLandscapeB) return 1;

    if (isLandscapeA && isLandscapeB) {
      const diffA = Math.abs(a.aspect_ratio - 2.5);
      const diffB = Math.abs(b.aspect_ratio - 2.5);
      if (diffA !== diffB) return diffA - diffB;
    }

    if (a.iso_639_1 === 'en') return -1;
    if (b.iso_639_1 === 'en') return 1;
    if (a.iso_639_1 === media.original_language) return -1;
    if (b.iso_639_1 === media.original_language) return 1;
    return (b.vote_average || 0) - (a.vote_average || 0);
  })[0];

  // Get trailer
  const trailer = (media.videos?.results || []).find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  );

  const isMovie = !!(
    media.title ||
    media.original_title ||
    (media.release_date && !media.first_air_date)
  );
  const downloadUrl = isMovie ? `https://vidvault.ru/movie/${media.id}` : null;

  const providerResults = media['watch/providers']?.results || {};
  const justWatchUrl =
    providerResults.US?.link ||
    providerResults.GB?.link ||
    providerResults.IN?.link ||
    Object.values(providerResults)[0]?.link ||
    null;

  const overviewLines = media.overview
    ? media.overview.split('\n').slice(0, 3).join('\n')
    : '';

  return (
    <>
      {/* ===== MOBILE LAYOUT — Stacked: Backdrop → Content ===== */}
      <div className='block md:hidden font-sans'>
        {/* Backdrop — fixed aspect ratio, no overlap */}
        <div className='relative aspect-4/3 w-full overflow-hidden'>
          <img
            src={getImageUrl(media.backdrop_path, 'w780', 'backdrop')}
            alt={title}
            className='h-full w-full object-cover'
          />
          {/* Bottom fade into content */}
          <div className='from-background absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t to-transparent' />
        </div>

        {/* Content — flows naturally below the image */}
        <div className='container relative z-10 mx-auto -mt-20 space-y-3 pb-4'>
          {/* Logo / Title */}
          {logo ? (
            <img
              src={getImageUrl(logo.file_path, 'w300')}
              alt={title}
              className='h-auto max-h-14 w-auto max-w-44 object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]'
              style={{ aspectRatio: logo.aspect_ratio }}
            />
          ) : (
            <h1 className='text-foreground text-2xl font-bold leading-tight'>
              {title}
            </h1>
          )}

          {/* Meta */}
          <div className='text-foreground/80 flex flex-wrap items-center gap-2 text-xs font-semibold'>
            {certification && (
              <>
                <span className='border-foreground/30 rounded border px-1.5 py-0.5 text-[10px] font-bold leading-none'>
                  {certification}
                </span>
                <span className='text-foreground/30'>•</span>
              </>
            )}
            <span>{year}</span>
            <span className='text-foreground/30'>•</span>
            <span>{duration}</span>
            <span className='text-foreground/30'>•</span>
            <div className='flex items-center gap-1 text-yellow-500'>
              <Star className='h-3.5 w-3.5 fill-yellow-500' />
              <span>{rating}</span>
            </div>
          </div>

          {/* Genres */}
          <div className='text-muted-foreground text-xs font-semibold'>
            {genres}
          </div>

          {/* Tagline */}
          {media.tagline && (
            <p className='text-muted-foreground/60 text-xs italic'>
              &ldquo;{media.tagline}&rdquo;
            </p>
          )}

          {/* Overview */}
          {overviewLines && (
            <p className='text-foreground/80 line-clamp-3 text-sm leading-relaxed'>
              {overviewLines}
            </p>
          )}

          {/* Actions — full width buttons */}
          <div className='flex flex-col gap-2 pt-2'>
            <WatchNowButton item={media} className='w-full' />
            <div className='flex gap-2'>
              {trailer && (
                <Button
                  onClick={() => setShowTrailerModal(true)}
                  variant='outline'
                  className='flex-1'
                >
                  <Play className='mr-2 h-4 w-4' />
                  Trailer
                </Button>
              )}
              {isMovie && (
                <Button asChild variant='outline' className='flex-1'>
                  <a href={downloadUrl} target='_blank' rel='noopener noreferrer'>
                    <Download className='mr-2 h-4 w-4' />
                    Download
                  </a>
                </Button>
              )}
              {justWatchUrl && (
                <Button asChild variant='outline' className='flex-1'>
                  <a href={justWatchUrl} target='_blank' rel='noopener noreferrer'>
                    <ExternalLink className='mr-2 h-4 w-4' />
                    JustWatch
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP LAYOUT — Immersive fullscreen overlay ===== */}
      <div
        ref={heroRef}
        className='relative hidden h-screen w-full overflow-hidden font-sans md:block'
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
              <motion.iframe
                key='trailer'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                ref={iframeRef}
                onLoad={() => setIframeReady(true)}
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${
                  isMuted ? 1 : 0
                }&controls=0&modestbranding=1&rel=0&showinfo=0`}
                title={trailer.name}
                className='absolute inset-0 h-full w-full'
                sandbox='allow-scripts allow-same-origin allow-presentation'
                allowFullScreen
              />
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

          {/* Blur Effect */}
          <motion.div
            animate={{ opacity: showVideo ? 0 : 1 }}
            transition={{ duration: 1 }}
            className='absolute inset-0 z-5 backdrop-blur-[2px]'
          />

          {/* Gradients */}
          <motion.div
            animate={{ opacity: showVideo ? 0.5 : 1 }}
            transition={{ duration: 1 }}
            className='pointer-events-none absolute inset-0 z-10'
          >
            <div className='from-background via-background/80 absolute inset-0 bg-linear-to-t via-30% to-transparent to-60%' />
            <div className='from-background via-background/50 absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t via-20% to-transparent to-50%' />
            <div className='from-background/90 via-background/40 absolute inset-0 bg-linear-to-r via-35% to-transparent to-70%' />
          </motion.div>
        </motion.div>

        {/* Desktop Content */}
        <motion.div
          style={{ y: contentY }}
          className={`relative z-30 flex h-full items-end transition-all duration-700 ease-in-out ${
            showVideo ? 'pb-14' : 'pb-16'
          }`}
        >
          <div className='container mx-auto'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className='grid grid-cols-[auto_1fr] items-end gap-10 lg:gap-12'
            >
              {/* Column 1: Poster */}
              <div className='hidden shrink-0 lg:block'>
                {media.poster_path && (
                  <img
                    src={getImageUrl(media.poster_path, 'w342')}
                    alt={title}
                    className='w-52 rounded-xl shadow-2xl lg:w-60 xl:w-64'
                  />
                )}
              </div>

              {/* Columns 2-3: Info */}
              <div className='space-y-5'>
                {/* Metadata Bar */}
                <div className='text-foreground/80 flex items-center gap-3 text-sm font-semibold'>
                  {certification && (
                    <>
                      <span className='border-foreground/30 rounded border px-2 py-0.5 text-xs font-bold leading-none'>
                        {certification}
                      </span>
                      <span className='text-foreground/30'>•</span>
                    </>
                  )}
                  <span>{year}</span>
                  <span className='text-foreground/30'>•</span>
                  <span>{duration}</span>
                  <span className='text-foreground/30'>•</span>
                  <div className='bg-primary/20 text-primary flex items-center gap-1.5 rounded px-2 py-1 text-xs font-bold uppercase tracking-wider'>
                    {language}
                  </div>
                  <span className='text-foreground/30'>•</span>
                  <div className='flex items-center gap-1.5 text-yellow-500'>
                    <Star className='h-4 w-4 fill-yellow-500' />
                    <span className='font-bold'>{rating}/10</span>
                  </div>
                </div>

                {/* Title / Logo */}
                <div>
                  {logo ? (
                    <img
                      src={getImageUrl(logo.file_path, 'w500')}
                      alt={title}
                      className='h-auto w-full max-w-sm'
                      style={{ aspectRatio: logo.aspect_ratio }}
                    />
                  ) : (
                    <h1 className='text-foreground text-4xl font-bold leading-[1.1] lg:text-5xl'>
                      {title}
                    </h1>
                  )}
                </div>

                {/* Genres */}
                <div className='text-muted-foreground/80 flex flex-wrap items-center gap-2 text-sm font-semibold'>
                  {(media.genres || []).slice(0, 3).map((genre, i) => (
                    <div key={genre.id} className='flex items-center gap-2'>
                      <span>{genre.name}</span>
                      {i < Math.min((media.genres || []).length, 3) - 1 && (
                        <span className='text-foreground/20'>•</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Tagline */}
                {media.tagline && (
                  <p className='text-muted-foreground/60 text-sm italic'>
                    &ldquo;{media.tagline}&rdquo;
                  </p>
                )}

                {/* Overview */}
                {overviewLines && (
                  <p className='text-foreground/90 line-clamp-3 max-w-2xl text-base leading-relaxed'>
                    {overviewLines}
                  </p>
                )}

                {/* Actions */}
                <div className='relative z-50 flex gap-4 pt-2'>
                  <WatchNowButton item={media} />
                  {trailer && (
                    <Button
                      onClick={() => setShowTrailerModal(true)}
                      variant='outline'
                      className='border-white/30 text-white transition-all hover:border-white/50 hover:bg-white/10'
                      size='lg'
                    >
                      <Play className='mr-2 h-5 w-5' />
                      Watch Trailer
                    </Button>
                  )}
                  {isMovie && (
                    <Button
                      asChild
                      variant='outline'
                      className='border-white/30 text-white transition-all hover:border-white/50 hover:bg-white/10'
                      size='lg'
                    >
                      <a href={downloadUrl} target='_blank' rel='noopener noreferrer'>
                        <Download className='mr-2 h-5 w-5' />
                        Download
                      </a>
                    </Button>
                  )}
                  {justWatchUrl && (
                    <Button
                      asChild
                      variant='outline'
                      className='border-white/30 text-white transition-all hover:border-white/50 hover:bg-white/10'
                      size='lg'
                    >
                      <a href={justWatchUrl} target='_blank' rel='noopener noreferrer'>
                        <ExternalLink className='mr-2 h-5 w-5' />
                        JustWatch
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Trailer Modal */}
      <Dialog open={showTrailerModal} onOpenChange={setShowTrailerModal}>
        <DialogContent className='max-w-6xl border-none bg-black p-0 shadow-2xl'>
          <DialogTitle className='sr-only'>Watch Trailer</DialogTitle>
          {trailer && showTrailerModal && (
            <div className='aspect-video w-full overflow-hidden rounded-lg bg-black'>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={trailer.name}
                className='h-full w-full'
                allowFullScreen
                allow='autoplay; encrypted-media'
                sandbox='allow-scripts allow-same-origin allow-presentation'
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
