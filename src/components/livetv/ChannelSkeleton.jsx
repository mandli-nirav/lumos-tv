import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ChannelSkeleton() {
  return (
    <Card className='group border-border/40 bg-card/30 relative overflow-hidden p-0'>
      <CardContent className='p-0'>
        {/* Match ChannelCard AspectRatio padding so image area aligns */}
        <AspectRatio
          ratio={16 / 9}
          className='flex items-center justify-center p-4'
        >
          <Skeleton className='h-full w-full' />
        </AspectRatio>

        {/* Bottom overlay — mirror ChannelCard layout so skeleton spacing matches */}
        <div className='absolute inset-x-0 bottom-0 translate-y-1 transform bg-linear-to-t from-black/95 via-black/60 to-transparent p-3 pt-8'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2 overflow-hidden'>
              <Skeleton className='h-1.5 w-1.5 rounded-full' />
              <Skeleton className='h-4 w-3/4!' />
            </div>
          </div>

          <div className='mt-2 flex gap-1.5'>
            <Skeleton className='h-4 w-12 rounded-sm' />
            <Skeleton className='h-4 w-16 rounded-sm' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ChannelGridSkeleton({ count = 12 }) {
  return (
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {Array.from({ length: count }).map((_, i) => (
        <ChannelSkeleton key={i} />
      ))}
    </div>
  );
}
