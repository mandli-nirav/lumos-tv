import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { VideoPlayer } from '@/components/player/VideoPlayer';
import { useMediaDetails, useSeasonDetails } from '@/hooks/useMedia';

export default function Watch() {
  const { type, id, season, episode } = useParams();

  // Fetch media details for title and general info
  const { data: media, isLoading: isMediaLoading } = useMediaDetails(type, id);

  // For TV shows, we might want the specific episode name
  const { data: seasonData, isLoading: isSeasonLoading } = useSeasonDetails(
    type === 'tv' ? id : null,
    season
  );

  const episodeData = seasonData?.episodes?.find(
    (e) => e.episode_number === parseInt(episode)
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

  // Set page title for better accessibility and browser history
  const pageTitle = `${getTitle()} | Lumos TV`;

  useEffect(() => {
    const oldTitle = document.title;
    document.title = pageTitle;
    return () => {
      document.title = oldTitle;
    };
  }, [pageTitle]);

  if (isMediaLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-black'>
        <div className='border-primary/20 border-t-primary h-10 w-10 animate-spin rounded-full border-4' />
      </div>
    );
  }

  return (
    <div className='fixed inset-0 z-100 h-screen w-full overflow-hidden bg-black'>
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
