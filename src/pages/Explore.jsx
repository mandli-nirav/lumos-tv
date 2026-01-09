import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLocation, useNavigate, useParams } from 'react-router';

import { MediaCard } from '@/components/media/MediaCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import {
  useInfinitePopularMovies,
  useInfinitePopularTV,
} from '@/hooks/useMedia';
import NotFound from '@/pages/NotFound';

export default function Explore() {
  const { type: paramType } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { ref, inView } = useInView();

  const type =
    paramType ||
    (pathname.includes('movie')
      ? 'movie'
      : pathname.includes('tv') || pathname.includes('series')
        ? 'tv'
        : null);

  const isMovie = type === 'movie' || type === 'movies';
  const isTV = type === 'tv' || type === 'series' || type === 'tv-shows';
  const hook = isMovie ? useInfinitePopularMovies : useInfinitePopularTV;
  const canonicalType = isMovie ? 'movie' : 'tv';

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    hook();

  const items = data?.pages.flatMap((page) => page.results) || [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!isMovie && !isTV) {
    return <NotFound />;
  }

  return (
    <div className='container mx-auto px-4 pt-24 pb-8 lg:px-8'>
      {/* Header */}
      <div className='mb-8 flex items-center gap-4'>
        <button
          onClick={() => navigate(-1)}
          className='bg-background/40 hover:bg-background/60 text-foreground border-border flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all hover:scale-110'
        >
          <ChevronLeft className='h-6 w-6' />
        </button>
        <div>
          <h1 className='text-2xl font-black tracking-tight lg:text-4xl'>
            Popular {isMovie ? 'Movies' : 'TV Shows'}
          </h1>
          <p className='text-muted-foreground text-sm font-medium'>
            Explore the most watched {isMovie ? 'movies' : 'series'} right now.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {items.map((item, index) => (
          <MediaCard
            key={`${item.id}-${index}`}
            item={item}
            explicitType={canonicalType}
          />
        ))}

        {/* Loading Skeletons */}
        {(isLoading || isFetchingNextPage) &&
          [...Array(12)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className='relative aspect-2/3 w-full animate-pulse overflow-hidden rounded-xl bg-white/5'
            >
              {i === 0 && isFetchingNextPage && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Spinner className='text-primary h-8 w-8' />
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Trigger for next page */}
      <div ref={ref} className='h-20' />

      {!hasNextPage && !isLoading && items.length > 0 && (
        <p className='text-muted-foreground py-10 text-center text-sm font-bold'>
          You've reached the end of the list.
        </p>
      )}
    </div>
  );
}
