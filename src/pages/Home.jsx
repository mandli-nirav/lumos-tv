import { useParams } from 'react-router';

import HeroSlider from '@/components/home/HeroSlider';
import { MediaDialog } from '@/components/media/MediaDialog';
import { MediaSlider } from '@/components/media/MediaSlider';
import { usePopularMovies, useTrending } from '@/hooks/useMedia';

export default function Home() {
  const trending = useTrending('all', 'day');
  const popular = usePopularMovies();

  return (
    <div className='space-y-12 pb-10'>
      <HeroSlider data={trending.data} />

      <div className='container mx-auto space-y-12 px-4 py-6 lg:px-8'>
        <MediaSlider
          title='Latest Releases'
          items={trending.data?.results}
          isLoading={trending.isLoading}
        />

        <MediaSlider
          title='Popular Movies'
          items={popular.data?.results}
          isLoading={popular.isLoading}
        />
      </div>
      <MediaDialog />
    </div>
  );
}
