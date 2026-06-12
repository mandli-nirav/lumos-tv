import { MediaCatalog } from '@/components/media/MediaCatalog';

export default function Movies() {
  return (
    <MediaCatalog
      mediaType='movie'
      allLabel='All Movies'
      heading='Movies'
      tagline='Browse popular and top-rated films by genre, language, and rating.'
    />
  );
}
