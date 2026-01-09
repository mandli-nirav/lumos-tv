import { motion } from 'framer-motion';
import { Activity, CircleDot, Dribbble, Dumbbell, Trophy } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sport icon mapping
const SPORT_ICONS = {
  football: CircleDot,
  basketball: Dribbble,
  tennis: Activity,
  hockey: CircleDot,
  baseball: CircleDot,
  mma: Dumbbell,
  boxing: Dumbbell,
  default: Trophy,
};

export function SportCard({ sport, isActive, onClick, matchCount = 0 }) {
  const Icon = SPORT_ICONS[sport.id] || SPORT_ICONS.default;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative flex shrink-0 flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all',
        isActive
          ? 'border-primary bg-primary/10 shadow-lg'
          : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
      )}
    >
      <div
        className={cn(
          'rounded-full p-3',
          isActive ? 'bg-primary/20' : 'bg-muted'
        )}
      >
        <Icon
          className={cn(
            'h-6 w-6',
            isActive ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
      <div className='text-center'>
        <p
          className={cn(
            'text-sm font-bold',
            isActive ? 'text-primary' : 'text-foreground'
          )}
        >
          {sport.name}
        </p>
        {matchCount > 0 && (
          <Badge variant='secondary' className='mt-1 text-xs'>
            {matchCount} live
          </Badge>
        )}
      </div>
    </motion.button>
  );
}
