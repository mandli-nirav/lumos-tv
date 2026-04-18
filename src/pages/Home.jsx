import { useLoaderData } from 'react-router';

import HeroSlider from '@/components/home/HeroSlider';
import { MediaSlider } from '@/components/media/MediaSlider';
import {
  useInfinitePopularMovies,
  useInfinitePopularTV,
  useInfiniteTopRatedMovies,
  useInfiniteTopRatedTV,
  useTrending,
} from '@/hooks/useMedia';

const toPlaceholder = (data) =>
  data ? { pages: [data], pageParams: [1] } : undefined;

const flattenData = (data) =>
  data?.pages.flatMap((page) => page.results) || [];

export default function Home() {
  const initialData = useLoaderData();

  const trending = useTrending('all', 'day', {
    placeholderData: initialData?.trending,
  });

  const popularMovies = useInfinitePopularMovies({
    placeholderData: toPlaceholder(initialData?.popularMovies),
  });

  const popularTV = useInfinitePopularTV({
    placeholderData: toPlaceholder(initialData?.popularTV),
  });

  const topRatedMovies = useInfiniteTopRatedMovies({
    placeholderData: toPlaceholder(initialData?.topRatedMovies),
  });

  const topRatedTV = useInfiniteTopRatedTV({
    placeholderData: toPlaceholder(initialData?.topRatedTV),
  });

  return (
    <div className='space-y-12 pb-10'>
      <HeroSlider data={trending.data} isLoading={trending.isLoading} />

      <div className='container mx-auto space-y-12 py-6'>
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

        <MediaSlider
          title='Top Rated Movies'
          items={flattenData(topRatedMovies.data)}
          isLoading={topRatedMovies.isLoading}
          fetchNextPage={topRatedMovies.fetchNextPage}
          hasNextPage={topRatedMovies.hasNextPage}
          isFetchingNextPage={topRatedMovies.isFetchingNextPage}
          viewAllPath='/movies'
        />

        <MediaSlider
          title='Top Rated TV Shows'
          items={flattenData(topRatedTV.data)}
          isLoading={topRatedTV.isLoading}
          fetchNextPage={topRatedTV.fetchNextPage}
          hasNextPage={topRatedTV.hasNextPage}
          isFetchingNextPage={topRatedTV.isFetchingNextPage}
          viewAllPath='/tv-shows'
        />
      </div>
    </div>
  );
}
