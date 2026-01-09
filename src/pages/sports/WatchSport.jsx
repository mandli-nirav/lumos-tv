import { useParams } from 'react-router';

import { StreamPlayer } from '@/components/sports/StreamPlayer';
import { useMatchDetail } from '@/hooks/useSports';

export default function WatchSport() {
  const { matchId } = useParams();
  const { data: matchDetail, isLoading } = useMatchDetail(matchId);

  if (isLoading) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-black'>
        <div className='flex flex-col items-center gap-4'>
          <div className='border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4' />
          <p className='animate-pulse font-medium text-white/60'>
            Loading match details...
          </p>
        </div>
      </div>
    );
  }

  if (!matchDetail) {
    return (
      <div className='flex h-screen w-full items-center justify-center bg-black'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-white'>Match not found</h2>
          <p className='mt-2 text-white/60'>
            The match you're looking for doesn't exist
          </p>
        </div>
      </div>
    );
  }

  return (
    <StreamPlayer match={matchDetail} sources={matchDetail.sources || []} />
  );
}
