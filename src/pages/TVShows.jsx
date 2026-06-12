import { MediaCatalog } from '@/components/media/MediaCatalog';

export default function TVShows() {
  return (
    <MediaCatalog
      mediaType='tv'
      allLabel='All TV Shows'
      heading='TV Shows'
      tagline='Explore popular and top-rated series with seasons and episode guides.'
    />
  );
}
