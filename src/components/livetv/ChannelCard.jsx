import 'react-lazy-load-image-component/src/effects/blur.css';

import { motion } from 'framer-motion';
import { capitalize } from 'lodash';
import { Play, Tv } from 'lucide-react';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function ChannelCard({ channel, onClick }) {
  const mainStream = channel.streams?.[0];
  const streamCount = channel.streams?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className='group border-border/40 bg-card/30 hover:border-primary/40 hover:bg-card/50 hover:shadow-primary/10 relative cursor-pointer overflow-hidden p-0 transition-all duration-300 hover:shadow-2xl'
        onClick={() => onClick(channel)}
      >
        <CardContent className='p-0'>
          <AspectRatio
            ratio={16 / 9}
            className='flex items-center justify-center p-4'
          >
            {channel.logo ? (
              <LazyLoadImage
                src={channel.logo}
                alt={channel.name}
                effect='blur'
                wrapperClassName='h-full w-full flex items-center justify-center'
                className='h-full w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110'
                onError={(e) => {
                  e.target.src = `https://placehold.co/400x225/1a1a1a/ffffff?text=${encodeURIComponent(channel.name)}`;
                }}
              />
            ) : (
              <div className='text-muted-foreground/50 flex flex-col items-center gap-2'>
                <Tv className='h-12 w-12' />
                <span className='text-xs font-semibold'>{channel.name}</span>
              </div>
            )}

            {/* Quality Badge */}
            {mainStream?.quality && (
              <div className='absolute top-2 right-2 z-10'>
                <Badge
                  variant='secondary'
                  className='border-none bg-black/60 px-1.5 py-0 text-[10px] text-white/90 uppercase backdrop-blur-md'
                >
                  {mainStream.quality}
                </Badge>
              </div>
            )}

            {/* Hover Play Button */}
            <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              <div className='bg-primary text-primary-foreground scale-90 transform rounded-full p-3 shadow-lg transition-transform duration-300 group-hover:scale-100'>
                <Play className='h-6 w-6 fill-current' />
              </div>
            </div>
          </AspectRatio>

          {/* Bottom Info Overlay */}
          <div className='absolute inset-x-0 bottom-0 translate-y-1 transform bg-linear-to-t from-black/95 via-black/60 to-transparent p-3 pt-8 transition-transform duration-300 group-hover:translate-y-0'>
            <div className='flex items-center justify-between gap-2'>
              <div className='flex items-center gap-2 overflow-hidden'>
                <div className='bg-primary h-1.5 w-1.5 shrink-0 animate-pulse rounded-full' />
                <h3 className='truncate text-sm leading-none font-bold text-white'>
                  {channel.name}
                </h3>
              </div>
            </div>

            <div className='mt-2 flex items-center gap-1.5'>
              {channel.categories?.slice(0, 1).map((cat) => (
                <Badge key={cat} variant='secondary' className='text-xs'>
                  {capitalize(cat)}
                </Badge>
              ))}
              {streamCount > 1 && (
                <span className='text-[9px] font-medium text-white/40'>
                  {streamCount} sources
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
