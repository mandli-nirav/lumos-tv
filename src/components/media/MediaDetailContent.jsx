import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import { Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'react-router';

import { getImageUrl } from '@/api/tmdb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInfiniteSimilarMedia, useSeasonDetails } from '@/hooks/useMedia';

import { MediaCard } from './MediaCard';

export function MediaDetailContent({ media }) {
  const { type, id } = useParams();
  const {
    data: similarData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSimilarMedia(type, id);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!media) return null;

  const isTV = !!media.seasons;
  const cast = _.take(_.get(media, 'credits.cast', []), 20);
  const crew = _.filter(_.get(media, 'credits.crew', []), (c) =>
    _.includes(
      [
        'Director',
        'Writer',
        'Producer',
        'Story',
        'Screenplay',
        'Music',
        'Director of Photography',
      ],
      c.job
    )
  );
  const similarItems = _.flatMap(_.get(similarData, 'pages', []), (page) =>
    _.get(page, 'results', [])
  );
  const videos = _.orderBy(
    _.get(media, 'videos.results', []),
    [(v) => v.type === 'Trailer'],
    ['desc']
  );
  const photos = _.take(_.get(media, 'images.backdrops', []), 12);

  return (
    <div className='space-y-12 px-6 py-8 font-sans md:px-12'>
      {/* TV Episode Section */}
      {isTV && <TVEpisodeSection media={media} />}
      {/* Overview & Main Meta */}
      <section className='grid grid-cols-1 gap-12 md:grid-cols-3'>
        <div className='space-y-6 md:col-span-2'>
          <div className='space-y-4'>
            <h3 className='text-foreground text-xl font-bold'>Description</h3>
            <p className='text-muted-foreground max-w-3xl text-base leading-relaxed'>
              {media.overview}
            </p>
          </div>

          {/* Cast Section */}
          <div className='space-y-4 pt-4'>
            <h3 className='text-foreground text-lg font-bold'>Cast</h3>
            <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4'>
              {cast.map((person) => (
                <div key={person.id} className='flex items-center gap-3'>
                  <Avatar className='border-border h-10 w-10 border'>
                    <AvatarImage
                      src={getImageUrl(person.profile_path, 'w185', 'profile')}
                      alt={person.name}
                      className='object-cover'
                    />
                    <AvatarFallback className='bg-muted text-[10px] font-bold'>
                      {person.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex min-w-0 flex-col'>
                    <span className='text-foreground/90 truncate text-xs font-bold'>
                      {person.name}
                    </span>
                    <span className='text-muted-foreground truncate text-[10px]'>
                      {person.character}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crew Section */}
          <div className='text-foreground space-y-4 pt-6 text-lg font-bold'>
            <h3>Crew</h3>
            <div className='grid grid-cols-2 gap-4 font-normal sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4'>
              {crew.map((person, index) => (
                <div
                  key={`${person.id}-${person.job}-${index}`}
                  className='flex items-center gap-3'
                >
                  <Avatar className='border-border h-10 w-10 border'>
                    <AvatarImage
                      src={getImageUrl(person.profile_path, 'w185', 'profile')}
                      alt={person.name}
                      className='object-cover'
                    />
                    <AvatarFallback className='bg-muted text-[10px] font-bold'>
                      {person.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex min-w-0 flex-col'>
                    <span className='text-foreground/90 truncate text-xs font-bold'>
                      {person.name}
                    </span>
                    <span className='text-muted-foreground truncate text-[10px]'>
                      {person.job}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Secondary Meta details */}
          <div className='space-y-1'>
            <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
              Released
            </span>
            <p className='text-foreground/90 text-sm font-bold'>
              {media.release_date || media.first_air_date}
            </p>
          </div>
          <div className='space-y-1'>
            <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
              Original Language
            </span>
            <p className='text-foreground/90 text-sm font-bold uppercase'>
              {media.original_language}
            </p>
          </div>
          <div className='space-y-1'>
            <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
              Status
            </span>
            <p className='text-foreground/90 text-sm font-bold'>
              {media.status}
            </p>
          </div>
          {_.get(media, 'networks', []).length > 0 && (
            <div className='space-y-2'>
              <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
                Networks
              </span>
              <div className='mt-2 flex flex-wrap gap-3'>
                {_.map(_.get(media, 'networks'), (network) => (
                  <div key={network.id} title={network.name}>
                    {network.logo_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/h30${network.logo_path}`}
                        alt={network.name}
                        className='max-h-5 object-contain opacity-80 brightness-0 invert'
                      />
                    ) : (
                      <span className='text-foreground/80 text-[10px] font-black tracking-tight'>
                        {network.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tabs Section */}
      <Tabs defaultValue='more'>
        <TabsList>
          <TabsTrigger value='more'>More Like This</TabsTrigger>
          <TabsTrigger value='trailers'>Trailers & More</TabsTrigger>
          <TabsTrigger value='photos'>Photos</TabsTrigger>
        </TabsList>

        <TabsContent value='more' className='pt-8 outline-none'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            {similarItems.map((item) => (
              <div key={item.id} className='group relative'>
                <div className='bg-muted border-border aspect-2/3 overflow-hidden rounded-lg border transition-transform group-hover:scale-[1.02]'>
                  <img
                    src={getImageUrl(item.poster_path, 'w342', 'poster')}
                    alt={item.title || item.name}
                    className='h-full w-full object-cover'
                  />
                </div>
                <p className='text-foreground/80 mt-2 line-clamp-1 text-[11px] font-bold'>
                  {item.title || item.name}
                </p>
              </div>
            ))}
          </div>

          {/* Intersection Observer Trigger */}
          <div ref={ref} className='flex h-20 items-center justify-center pt-8'>
            {isFetchingNextPage && (
              <div className='border-primary/20 border-t-primary h-6 w-6 animate-spin rounded-full border-2' />
            )}
          </div>
        </TabsContent>

        <TabsContent value='trailers' className='pt-8 outline-none'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {videos.map((video) => (
              <div key={video.id} className='space-y-3'>
                <div className='bg-muted border-border group relative aspect-video cursor-pointer overflow-hidden rounded-xl border'>
                  <img
                    src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                    className='h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-100'
                    alt={video.name}
                  />
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='bg-background/20 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-transform group-hover:scale-110'>
                      <Play className='fill-foreground text-foreground h-6 w-6' />
                    </div>
                  </div>
                  <div className='absolute top-3 right-3'>
                    <Badge
                      variant='secondary'
                      className='bg-background/80 font-bold backdrop-blur-sm'
                    >
                      {video.type}
                    </Badge>
                  </div>
                </div>
                <p className='text-foreground/90 line-clamp-1 text-sm font-bold'>
                  {video.name}
                </p>
              </div>
            ))}
            {videos.length === 0 && (
              <p className='text-muted-foreground italic'>
                No videos available for this title.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value='photos' className='pt-8 outline-none'>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {photos.map((photo, index) => (
              <div
                key={index}
                className='bg-muted border-border group relative aspect-video overflow-hidden rounded-xl border'
              >
                <img
                  src={getImageUrl(photo.file_path, 'w780')}
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                  alt={`Photo ${index + 1}`}
                />
              </div>
            ))}
            {photos.length === 0 && (
              <p className='text-muted-foreground italic'>
                No photos available for this title.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TVEpisodeSection({ media }) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const { data: seasonData, isLoading } = useSeasonDetails(
    media.id,
    selectedSeason
  );

  const seasons = media.seasons?.filter((s) => s.season_number > 0) || [];

  return (
    <section className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-foreground text-xl font-bold'>Episodes</h3>
        <div className='scrollbar-hide flex max-w-[70%] items-center gap-3 overflow-x-auto pb-2'>
          {seasons.map((season) => (
            <Button
              key={season.id}
              variant={
                selectedSeason === season.season_number
                  ? 'default'
                  : 'secondary'
              }
              size='sm'
              onClick={() => setSelectedSeason(season.season_number)}
              className='h-9 rounded-full px-5 font-bold'
            >
              Season {season.season_number}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className='h-112 w-full pr-4'>
        <AnimatePresence mode='wait'>
          {isLoading ? (
            <div className='flex h-40 items-center justify-center'>
              <div className='border-primary/20 border-t-primary h-6 w-6 animate-spin rounded-full border-2' />
            </div>
          ) : (
            <motion.div
              key={selectedSeason}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className='space-y-4'
            >
              {seasonData?.episodes?.map((episode) => (
                <div
                  key={episode.id}
                  className='group hover:bg-muted/50 hover:border-border flex cursor-pointer gap-4 rounded-xl border border-transparent p-3 transition-colors'
                >
                  <div className='bg-muted relative h-20 w-36 shrink-0 overflow-hidden rounded-lg'>
                    <img
                      src={getImageUrl(episode.still_path, 'w185', 'backdrop')}
                      alt={episode.name}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='bg-background/40 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100'>
                      <Play className='fill-foreground text-foreground h-6 w-6' />
                    </div>
                  </div>
                  <div className='flex min-w-0 flex-1 flex-col justify-center'>
                    <div className='mb-1 flex items-center gap-2'>
                      <Badge
                        variant='outline'
                        className='text-muted-foreground h-5 px-1.5 text-[10px] font-bold'
                      >
                        E{episode.episode_number}
                      </Badge>
                      <h4 className='text-foreground/90 truncate text-base font-bold'>
                        {episode.name}
                      </h4>
                    </div>
                    <p className='text-muted-foreground line-clamp-2 text-xs'>
                      {episode.overview || 'No description available.'}
                    </p>
                    <div className='text-muted-foreground/50 mt-1 truncate text-[11px] font-medium'>
                      {episode.air_date} • {episode.runtime || 0}m
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </section>
  );
}
