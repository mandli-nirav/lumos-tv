import { useLoaderData } from 'react-router';

import HeroSlider from '@/components/home/HeroSlider';
import { MediaSlider } from '@/components/media/MediaSlider';
import {
  useInfinitePopularMovies,
  useInfinitePopularTV,
  useTrending,
} from '@/hooks/useMedia';

export default function Home() {
  const initialData = useLoaderData();

  const trending = useTrending('all', 'day', {
    initialData: initialData?.trending,
  });

  const popularMovies = useInfinitePopularMovies({
    initialData: initialData?.popularMovies
      ? {
          pages: [initialData.popularMovies],
          pageParams: [1],
        }
      : undefined,
  });

  const popularTV = useInfinitePopularTV({
    initialData: initialData?.popularTV
      ? {
          pages: [initialData.popularTV],
          pageParams: [1],
        }
      : undefined,
  });

  // Helper to flatten infinite query data
  const flattenData = (data) =>
    data?.pages.flatMap((page) => page.results) || [];

  return (
    <div className='space-y-12 pb-10'>
      <HeroSlider data={trending.data} isLoading={trending.isLoading} />

      <div className='w-full space-y-12 px-4 py-6 md:px-12 lg:px-16'>
        <MediaSlider
          title='Popular Movies'
          items={flattenData(popularMovies.data)}
          isLoading={popularMovies.isLoading}
          fetchNextPage={popularMovies.fetchNextPage}
          hasNextPage={popularMovies.hasNextPage}
          isFetchingNextPage={popularMovies.isFetchingNextPage}
          viewAllPath='/movies'
        />

        <MediaSlider
          title='Popular TV Shows'
          items={flattenData(popularTV.data)}
          isLoading={popularTV.isLoading}
          fetchNextPage={popularTV.fetchNextPage}
          hasNextPage={popularTV.hasNextPage}
          isFetchingNextPage={popularTV.isFetchingNextPage}
          viewAllPath='/tv-shows'
        />
      </div>
    </div>
  );
}
