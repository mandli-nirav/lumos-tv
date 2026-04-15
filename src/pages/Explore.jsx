import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  useLoaderData,
  useLocation,
  useParams,
} from 'react-router';

import { MediaCard } from '@/components/media/MediaCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGenreList, useInfiniteDiscover, useInfinitePopularMedia } from '@/hooks/useMedia';
import NotFound from '@/pages/NotFound';

export default function Explore() {
  const initialData = useLoaderData();
  const { type: paramType } = useParams();
  const { pathname } = useLocation();
  const { ref, inView } = useInView();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const type =
    paramType ||
    (pathname.includes('movie')
      ? 'movie'
      : pathname.includes('tv') || pathname.includes('series')
        ? 'tv'
        : null);

  const isMovie = type === 'movie' || type === 'movies';
  const isTV = type === 'tv' || type === 'series' || type === 'tv-shows';
  const canonicalType = isMovie ? 'movie' : 'tv';

  const { data: genres } = useGenreList(canonicalType);

  // Use discover when genre is selected, popular otherwise
  const popular = useInfinitePopularMedia(canonicalType, {
    enabled: !selectedGenre,
    initialData: !selectedGenre && initialData
      ? { pages: [initialData], pageParams: [1] }
      : undefined,
  });

  const discover = useInfiniteDiscover(canonicalType, selectedGenre, {
    enabled: !!selectedGenre,
  });

  const active = selectedGenre ? discover : popular;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = active;

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
    <div className='container mx-auto pt-24 pb-8'>
      {/* Genre Filter Tabs */}
      <Tabs
        value={selectedGenre?.toString() || 'all'}
        onValueChange={(val) => setSelectedGenre(val === 'all' ? null : parseInt(val))}
      >
        <ScrollArea className='mb-6 w-full'>
          <TabsList>
            <TabsTrigger value='all'>
              All {isMovie ? 'Movies' : 'TV Shows'}
            </TabsTrigger>
            {(genres || []).map((genre) => (
              <TabsTrigger key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </Tabs>

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
