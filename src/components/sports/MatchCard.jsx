import { motion } from 'framer-motion';
import { Calendar, Clock, Radio } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function MatchCard({ match }) {
  const navigate = useNavigate();

  // Format date
  const matchDate = new Date(match.date);
  const isLive = matchDate.getTime() <= Date.now();
  const timeString = matchDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/sports/watch/${match.id}`)}
      className='group border-border bg-card hover:border-primary/50 relative cursor-pointer overflow-hidden rounded-xl border transition-all hover:shadow-lg'
    >
      {/* Live indicator */}
      {isLive && (
        <div className='absolute top-3 right-3 z-10'>
          <Badge variant='destructive' className='animate-pulse gap-1'>
            <Radio className='h-3 w-3' />
            LIVE
          </Badge>
        </div>
      )}

      <div className='p-4'>
        {/* Teams */}
        {match.teams ? (
          <div className='space-y-3'>
            {/* Home Team */}
            <div className='flex items-center gap-3'>
              {match.teams.home?.badge && (
                <img
                  src={match.teams.home.badge}
                  alt={match.teams.home.name}
                  className='h-8 w-8 object-contain'
                />
              )}
              <span className='text-foreground font-semibold'>
                {match.teams.home?.name || 'TBD'}
              </span>
            </div>

            {/* VS Divider */}
            <div className='flex items-center justify-center'>
              <span className='text-muted-foreground text-xs font-bold'>
                VS
              </span>
            </div>

            {/* Away Team */}
            <div className='flex items-center gap-3'>
              {match.teams.away?.badge && (
                <img
                  src={match.teams.away.badge}
                  alt={match.teams.away.name}
                  className='h-8 w-8 object-contain'
                />
              )}
              <span className='text-foreground font-semibold'>
                {match.teams.away?.name || 'TBD'}
              </span>
            </div>
          </div>
        ) : (
          <h3 className='text-foreground text-center font-bold'>
            {match.title}
          </h3>
        )}

        {/* Match Info */}
        <div className='border-border mt-4 flex items-center justify-between border-t pt-3'>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <Clock className='h-3 w-3' />
            <span>{timeString}</span>
          </div>
          <Badge variant='outline' className='text-xs capitalize'>
            {match.category}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
