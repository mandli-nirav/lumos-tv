import 'react-lazy-load-image-component/src/effects/blur.css';

import { AnimatePresence, motion } from 'framer-motion';
import { Play, Plus, Star } from 'lucide-react';
import { useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useLocation, useNavigate } from 'react-router';

import { getImageUrl } from '@/api/tmdb';
import { Button } from '@/components/ui/button';

export function MediaCard({ item, explicitType }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const cardRef = useRef(null);
  const [origin, setOrigin] = useState('center'); // 'left', 'right', 'center'

  if (!item) return;

  const id = item.id;
  const title = item.title || item.name;
  const isMovie = !!(
    item.title ||
    item.original_title ||
    (item.release_date && !item.first_air_date) ||
    item.video
  );
  const mediaType =
    explicitType || item.media_type || (isMovie ? 'movie' : 'tv');
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const language = item.original_language?.toUpperCase() || 'EN';

  const handleCardClick = () => {
    navigate(`/${mediaType}/${item.id}`, {
      state: { backgroundLocation: location },
    });
  };

  const handleMouseEnter = () => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const threshold = 100; // Distance from edge to trigger edge-case popout

      if (rect.left < threshold) {
        setOrigin('left');
      } else if (windowWidth - rect.right < threshold) {
        setOrigin('right');
      } else {
        setOrigin('center');
      }
    }

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(false);
  };

  const getAnimateProps = () => {
    if (!isHovered) {
      return {
        scale: 1,
        width: '100%',
        x: '-50%',
        y: '-50%',
        left: '50%',
        top: '50%',
      };
    }

    return {
      scale: 1.35,
      width: '145%',
      y: '-50%',
      top: '50%',
      x: origin === 'left' ? '0%' : origin === 'right' ? '-100%' : '-50%',
      left: origin === 'left' ? '0%' : origin === 'right' ? '100%' : '50%',
    };
  };

  return (
    <div
      ref={cardRef}
      className={`relative w-full font-sans ${isHovered ? 'z-50' : 'z-10'}`}
    >
      {/* Static Placeholder to maintain layout and prevent shifting */}
      <div className='aspect-2/3 w-full' />

      {/* Animated Card Content */}
      <motion.div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        initial={false}
        animate={getAnimateProps()}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 35,
          width: { duration: 0.25 },
          scale: { duration: 0.25 },
        }}
        className='group bg-card ring-border/50 absolute cursor-pointer overflow-hidden rounded-xl shadow-2xl ring-1'
      >
        {/* Media Content */}
        <div className='relative w-full overflow-hidden'>
          {/* Aspect ratio container that changes */}
          <motion.div
            className='relative w-full'
            animate={{
              aspectRatio: isHovered ? '16/9' : '2/3',
            }}
            transition={{ duration: 0.3 }}
          >
            <LazyLoadImage
              src={
                isHovered
                  ? getImageUrl(item.backdrop_path, 'w780', 'backdrop')
                  : getImageUrl(item.poster_path, 'w500', 'poster')
              }
              alt={title}
              effect='blur'
              className='h-full w-full object-cover'
              wrapperClassName='h-full w-full !block'
            />
          </motion.div>

          {/* Title gradient - smooth multi-stop for seamless blending */}
          <div className='from-background via-background/80 absolute inset-x-0 bottom-0 bg-linear-to-t via-30% to-transparent to-70% p-3 pt-12'>
            <h3 className='text-foreground mb-0.5 line-clamp-1 text-[11px] font-bold'>
              {title}
            </h3>
            {!isHovered && (
              <p className='text-muted-foreground text-[9px] font-semibold'>
                {year}
              </p>
            )}
          </div>
        </div>

        {/* Hover Content Details */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='bg-card p-4'
            >
              {/* Buttons Row */}
              <div className='mb-4 flex gap-2'>
                <Button
                  className='flex-1'
                  onClick={(e) => {
                    e.stopPropagation();
                    if (mediaType === 'movie') {
                      navigate(`/watch/movie/${item.id}`);
                    } else {
                      navigate(`/watch/tv/${item.id}/1/1`);
                    }
                  }}
                >
                  <Play className='mr-2 h-4 w-4 fill-current' />
                  Watch Now
                </Button>
                <Button size='icon' variant='outline'>
                  <Plus />
                </Button>
              </div>

              {/* Meta Row */}
              <div className='text-foreground/80 mb-3 flex items-center gap-2 text-[10px] font-bold'>
                <span>{year}</span>
                <span className='text-border'>•</span>
                <div className='bg-muted flex items-center gap-1 rounded px-1.5 py-0.5 text-[8px] uppercase'>
                  {language}
                </div>
                <span className='text-border'>•</span>
                <div className='flex items-center gap-0.5'>
                  <Star className='h-3 w-3 fill-yellow-500 text-yellow-500' />
                  <span>{rating}</span>
                </div>
              </div>

              {/* Description */}
              <p className='text-muted-foreground line-clamp-2 text-[10px] leading-relaxed font-medium'>
                {item.overview}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
