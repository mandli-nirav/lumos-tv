import React from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ChannelSkeleton() {
  return (
    <Card className='border-border/40 bg-card/30 overflow-hidden'>
      <CardContent className='p-0'>
        <AspectRatio ratio={16 / 9}>
          <Skeleton className='h-full w-full' />
        </AspectRatio>
        <div className='p-3'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-3 w-3 rounded-full' />
            <Skeleton className='h-4 w-3/4' />
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
    <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
      {Array.from({ length: count }).map((_, i) => (
        <ChannelSkeleton key={i} />
      ))}
    </div>
  );
}
