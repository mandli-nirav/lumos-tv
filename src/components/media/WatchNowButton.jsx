import { Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function WatchNowButton({ className, ...props }) {
  return (
    <Button className={cn(className)} {...props}>
      <Play />
      Watch Now
    </Button>
  );
}
