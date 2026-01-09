import { Play } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function WatchNowButton({
  item,
  type: explicitType,
  className,
  ...props
}) {
  const navigate = useNavigate();

  const handleWatch = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!item) return;

    const id = item.id;
    // Extremely robust type detection
    const isMovie = !!(
      item.title ||
      item.original_title ||
      (item.release_date && !item.first_air_date) ||
      item.video
    );
    const mediaType =
      explicitType || item.media_type || (isMovie ? 'movie' : 'tv');

    if (mediaType === 'movie') {
      navigate(`/watch/movie/${id}`);
    } else {
      // For TV shows, use provided season/episode or default to S1E1
      const s = item.season_number || 1;
      const e = item.episode_number || 1;
      navigate(`/watch/tv/${id}/${s}/${e}`);
    }
  };

  return (
    <Button className={cn(className)} onClick={handleWatch} {...props}>
      <Play className='mr-2 h-4 w-4 fill-current' />
      Watch Now
    </Button>
  );
}
