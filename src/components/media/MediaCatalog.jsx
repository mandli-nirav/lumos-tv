import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { useLoaderData } from 'react-router';

import { LANGUAGES, SORT_OPTIONS } from '@/components/media/catalogFilterOptions';
import { CatalogFilters } from '@/components/media/CatalogFilters';
import { MediaCard } from '@/components/media/MediaCard';
import { ScrollFade } from '@/components/ui/scroll-fade';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDiscoverFilters } from '@/hooks/useDiscoverFilters';
import { useGenreList, useInfiniteDiscover, useInfinitePopularMedia } from '@/hooks/useMedia';

const ALL = '__all__';

export function MediaCatalog({ mediaType, allLabel }) {
  const initialData = useLoaderData();
  const { ref, inView } = useInView();
  const { filters, update, reset, activeCount } = useDiscoverFilters();

  const { data: genres } = useGenreList(mediaType);

  const sortOptions = useMemo(
    () =>
      SORT_OPTIONS.filter((opt) => {
        if (opt.movieOnly) return mediaType === 'movie';
        if (opt.tvOnly) return mediaType === 'tv';
        return true;
      }),
    [mediaType]
  );

  // Use popular endpoint when no filters are set; discover otherwise
  const hasFilter = activeCount > 0;

  const popular = useInfinitePopularMedia(mediaType, {
    enabled: !hasFilter,
    initialData: !hasFilter && initialData
      ? { pages: [initialData], pageParams: [1] }
      : undefined,
  });

  const discover = useInfiniteDiscover(mediaType, filters, {
    enabled: hasFilter,
  });

  const active = hasFilter ? discover : popular;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = active;

  const items = data?.pages.flatMap((page) => page.results) || [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className='container mx-auto pt-24 pb-8'>
      {/* Top filter row */}
      <div className='mb-4 flex flex-wrap items-center gap-2 sm:gap-3'>
        <Select
          value={filters.sortBy}
          onValueChange={(v) =>
            update({ sort: v === 'popularity.desc' ? null : v })
          }
        >
          <SelectTrigger size='sm' className='w-44'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.language || ALL}
          onValueChange={(v) => update({ lang: v === ALL ? null : v })}
        >
          <SelectTrigger size='sm' className='w-40'>
            <SelectValue placeholder='Language' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Languages</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <CatalogFilters
          mediaType={mediaType}
          filters={filters}
          update={update}
          reset={reset}
          activeCount={activeCount}
        />

        {activeCount > 0 && (
          <button
            type='button'
            onClick={reset}
            className='text-muted-foreground hover:text-foreground text-xs font-medium underline-offset-4 hover:underline'
          >
            Clear all
          </button>
        )}
      </div>

      {/* Genre tabs */}
      <Tabs
        value={filters.genre?.toString() || 'all'}
        onValueChange={(val) =>
          update({ genre: val === 'all' ? null : parseInt(val, 10) })
        }
      >
        <ScrollFade className='mb-6'>
          <TabsList>
            <TabsTrigger value='all'>{allLabel}</TabsTrigger>
            {(genres || []).map((genre) => (
              <TabsTrigger key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollFade>
      </Tabs>

      {/* Grid */}
      <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {items.map((item, index) => (
          <MediaCard
            key={`${item.id}-${index}`}
            item={item}
            explicitType={mediaType}
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

      {!isLoading && items.length === 0 && (
        <p className='text-muted-foreground py-16 text-center text-sm font-bold'>
          No results match your filters. Try clearing some.
        </p>
      )}

      {!hasNextPage && !isLoading && items.length > 0 && (
        <p className='text-muted-foreground py-10 text-center text-sm font-bold'>
          You've reached the end of the list.
        </p>
      )}
    </div>
  );
}
