import { Frown } from 'lucide-react';

import { MatchCard } from './MatchCard';

export function MatchGrid({ matches, isLoading }) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='bg-muted h-48 animate-pulse rounded-xl' />
        ))}
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-center'>
        <Frown className='text-muted-foreground mb-4 h-16 w-16' />
        <h3 className='text-foreground text-xl font-bold'>No matches found</h3>
        <p className='text-muted-foreground mt-2 text-sm'>
          Check back later for upcoming matches
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
