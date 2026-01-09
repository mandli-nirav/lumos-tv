import { ChevronLeft, Home } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { BottomNav } from '@/components/layout/BottomNav';
import { StreamPlayer } from '@/components/sports/StreamPlayer';
import { Button } from '@/components/ui/button';
import { useMatchDetail } from '@/hooks/useSports';

export default function WatchSport() {
  const { matchId } = useParams();
  const navigate = useNavigate();
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
      <div className='flex h-screen w-full flex-col bg-black'>
        {/* Header with Back Button */}
        <div className='flex items-center justify-between border-b border-white/10 bg-black/95 px-4 py-3 backdrop-blur-md'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20'
              onClick={() => navigate('/sports')}
            >
              <ChevronLeft className='h-6 w-6 text-white' />
            </Button>
            <h1 className='text-lg font-bold tracking-tight text-white md:text-xl'>
              Match Not Found
            </h1>
          </div>
        </div>

        {/* Error Message */}
        <div className='flex flex-1 items-center justify-center pb-20'>
          <div className='px-4 text-center'>
            <div className='mb-6 flex justify-center'>
              <div className='rounded-full bg-white/5 p-6'>
                <Home className='h-12 w-12 text-white/40' />
              </div>
            </div>
            <h2 className='mb-3 text-2xl font-bold text-white'>
              Match not found
            </h2>
            <p className='mb-8 max-w-md text-white/60'>
              The match you're looking for doesn't exist or may have been
              removed.
            </p>
            <Button
              onClick={() => navigate('/sports')}
              size='lg'
              className='gap-2'
            >
              <ChevronLeft className='h-4 w-4' />
              Back to Sports
            </Button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    );
  }

  return (
    <StreamPlayer match={matchDetail} sources={matchDetail.sources || []} />
  );
}
