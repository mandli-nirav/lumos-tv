import { useEffect } from 'react';
import { Link, useParams } from 'react-router';

import { VideoPlayer } from '@/components/player/VideoPlayer';
import { Button } from '@/components/ui/button';
import { useMediaDetails, useSeasonDetails } from '@/hooks/useMedia';

export default function Watch() {
  const { type, id, season, episode } = useParams();

  const {
    data: media,
    isLoading: isMediaLoading,
    isError: isMediaError,
  } = useMediaDetails(type, id);

  const { data: seasonData } = useSeasonDetails(
    type === 'tv' ? id : null,
    season
  );

  const episodeData = seasonData?.episodes?.find(
    (e) => e.episode_number === parseInt(episode, 10)
  );

  const getTitle = () => {
    if (isMediaLoading) return 'Loading...';
    if (!media) return `Content (${id})`;

    if (type === 'movie')
      return media.title || media.original_title || 'Unknown Movie';

    const baseTitle = media.name || media.original_name || 'Unknown Show';
    if (episodeData) {
      return `${baseTitle} - ${episodeData.name}`;
    }
    return `${baseTitle} - S${season} E${episode}`;
  };

  const getMetadata = () => {
    if (type === 'movie') return media?.release_date?.split('-')[0] || '';
    return `Season ${season}, Episode ${episode}`;
  };

  const pageTitle = `${getTitle()} | Lumos TV`;

  useEffect(() => {
    const oldTitle = document.title;
    document.title = pageTitle;
    return () => {
      document.title = oldTitle;
    };
  }, [pageTitle]);

  if (type !== 'movie' && type !== 'tv') {
    return (
      <div className='flex h-dvh w-full flex-col items-center justify-center gap-4 bg-black text-white'>
        <h1 className='text-4xl font-extrabold'>Not Found</h1>
        <p className='text-white/60'>Invalid content type.</p>
        <Button asChild variant='outline'>
          <Link to='/'>Go Home</Link>
        </Button>
      </div>
    );
  }

  if (isMediaLoading) {
    return (
      <div className='flex h-dvh w-full items-center justify-center bg-black'>
        <div className='border-primary/20 border-t-primary h-10 w-10 animate-spin rounded-full border-4' />
      </div>
    );
  }

  if (isMediaError || !media) {
    return (
      <div className='flex h-dvh w-full flex-col items-center justify-center gap-4 bg-black text-white'>
        <h1 className='text-4xl font-extrabold'>
          {isMediaError ? 'Something went wrong' : 'Not Found'}
        </h1>
        <p className='text-white/60'>
          {isMediaError
            ? 'Failed to load content. Please try again.'
            : 'This content does not exist.'}
        </p>
        <div className='flex gap-3'>
          {isMediaError && (
            <Button
              variant='outline'
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          )}
          <Button asChild>
            <Link to='/'>Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='fixed inset-0 z-100 h-dvh w-full overflow-hidden bg-black'>
      <VideoPlayer
        type={type}
        id={id}
        imdbId={
          type === 'movie' ? media?.imdb_id : media?.external_ids?.imdb_id
        }
        season={season}
        episode={episode}
        title={getTitle()}
        metadata={getMetadata()}
      />
    </div>
  );
}
