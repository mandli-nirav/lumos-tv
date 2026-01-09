import { useParams } from 'react-router';

import HeroSlider from '@/components/home/HeroSlider';
import { MediaDialog } from '@/components/media/MediaDialog';
import { MediaSlider } from '@/components/media/MediaSlider';
import { usePopularMovies, usePopularTV, useTrending } from '@/hooks/useMedia';

export default function Home() {
  const trending = useTrending('all', 'day');
  const popularMovies = usePopularMovies();
  const popularTV = usePopularTV();

  return (
    <div className='space-y-12 pb-10'>
      <HeroSlider data={trending.data} isLoading={trending.isLoading} />

      <div className='container mx-auto space-y-12 px-4 py-6 lg:px-8'>
        <MediaSlider
          title='Popular Movies'
          items={popularMovies.data?.results}
          isLoading={popularMovies.isLoading}
        />

        <MediaSlider
          title='Popular TV Shows'
          items={popularTV.data?.results}
          isLoading={popularTV.isLoading}
        />
      </div>
      <MediaDialog />
    </div>
  );
}
