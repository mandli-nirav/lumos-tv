import _ from 'lodash';
import { Search as SearchIcon, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLoaderData, useSearchParams } from 'react-router';

import { MediaCard } from '@/components/media/MediaCard';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { useSearchMedia } from '@/hooks/useMedia';

export default function Search() {
  const initialData = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(initialData?.q || '');
  const [debouncedQuery, setDebouncedQuery] = useState(initialData?.q || '');
  const { ref, inView } = useInView();

  // Handle debounce
  const updateDebouncedQuery = useMemo(
    () => _.debounce((q) => setDebouncedQuery(q), 500),
    []
  );

  useEffect(() => {
    updateDebouncedQuery(query);
    if (query) {
      setSearchParams({ q: query }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [query, updateDebouncedQuery, setSearchParams]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSearchMedia(debouncedQuery, {
      initialData:
        initialData?.results && debouncedQuery === initialData.q
          ? {
              pages: [initialData.results],
              pageParams: [1],
            }
          : undefined,
    });

  const results = data?.pages.flatMap((page) => page.results) || [];
  // Filter only movies and TV shows (exclude people for this view)
  const filteredResults = results.filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className='container mx-auto px-4 pt-24 pb-8 lg:px-8'>
      {/* Search Header */}
      <div className='mx-auto mb-12 max-w-2xl'>
        <div className='group relative'>
          <Input
            autoFocus
            type='text'
            placeholder='Search movies, TV shows...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='bg-background/50 border-border/50 focus:ring-primary/20 h-14 rounded-2xl pr-12 pl-12 text-lg shadow-lg backdrop-blur-md transition-all'
          />
          <div className='pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center'>
            <SearchIcon className='text-muted-foreground group-focus-within:text-primary h-5 w-5 transition-colors' />
          </div>
          {query && (
            <button
              onClick={() => setQuery('')}
              className='text-muted-foreground hover:text-foreground absolute inset-y-0 right-4 flex items-center transition-colors'
            >
              <X className='h-5 w-5' />
            </button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {debouncedQuery ? (
        <div className='space-y-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-black tracking-tight lg:text-2xl'>
              {isLoading ? 'Searching...' : `Results for "${debouncedQuery}"`}
            </h2>
            {!isLoading && (
              <span className='text-muted-foreground text-sm font-bold'>
                {filteredResults.length} items found
              </span>
            )}
          </div>

          <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {filteredResults.map((item, index) => (
              <MediaCard key={`${item.id}-${index}`} item={item} />
            ))}

            {/* Skeletons while searching or loading next page */}
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

          {!isLoading && filteredResults.length === 0 && (
            <div className='space-y-4 py-20 text-center'>
              <div className='bg-primary/5 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
                <SearchIcon className='text-primary/40 h-10 w-10' />
              </div>
              <h3 className='text-xl font-bold'>No results found</h3>
              <p className='text-muted-foreground mx-auto max-w-xs text-sm'>
                We couldn't find anything matching "{debouncedQuery}". Try a
                different keyword.
              </p>
            </div>
          )}

          {/* Load More Trigger */}
          <div ref={ref} className='h-20' />
        </div>
      ) : (
        /* Initial/Empty Search State */
        <div className='space-y-4 py-20 text-center opacity-50'>
          <div className='bg-primary/5 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
            <SearchIcon className='text-primary/40 h-10 w-10' />
          </div>
          <h3 className='text-xl font-bold'>Start Searching</h3>
          <p className='text-muted-foreground mx-auto max-w-xs text-sm'>
            Enter a movie or TV show title above to discover something new
            today.
          </p>
        </div>
      )}
    </div>
  );
}
