import { AnimatePresence, motion } from 'framer-motion';
import _ from 'lodash';
import { Check, ChevronsUpDown, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams } from 'react-router';

import { getImageUrl } from '@/api/tmdb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInfiniteSimilarMedia, useSeasonDetails } from '@/hooks/useMedia';
import { cn } from '@/lib/utils';

import { MediaCard } from './MediaCard';

export function MediaDetailContent({ media }) {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const {
    data: similarData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSimilarMedia(type, id);

  const { ref, inView } = useInView();

  const isTV = !!media?.seasons;
  const [selectedSeason, setSelectedSeason] = useState(1);
  const { data: seasonData, isLoading: isSeasonLoading } = useSeasonDetails(
    id,
    selectedSeason,
    { enabled: isTV }
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!media) return null;

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
    <div className='mt-8 space-y-12 px-6 pb-8 font-sans md:px-12'>
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
                        className='max-h-5 object-contain opacity-80 brightness-0 dark:invert'
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
      <Tabs defaultValue={isTV ? 'episodes' : 'more'}>
        <ScrollArea className='w-full'>
          <TabsList>
            {isTV && <TabsTrigger value='episodes'>Episodes</TabsTrigger>}
            <TabsTrigger value='more'>More Like This</TabsTrigger>
            <TabsTrigger value='trailers'>Trailers & More</TabsTrigger>
            <TabsTrigger value='photos'>Photos</TabsTrigger>
          </TabsList>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        {isTV && (
          <TabsContent value='episodes'>
            <div className='space-y-6'>
              <div className='flex items-center gap-4'>
                <label className='text-foreground text-sm font-semibold'>
                  Select Season:
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant='outline'
                      role='combobox'
                      className='w-50 justify-between'
                    >
                      Season {selectedSeason}
                      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-50 p-0'
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <Command>
                      <CommandInput placeholder='Search season...' />
                      <ScrollArea className='h-75'>
                        <CommandList>
                          <CommandEmpty>No season found.</CommandEmpty>
                          <CommandGroup>
                            {media.seasons
                              ?.filter((s) => s.season_number > 0)
                              .map((season) => (
                                <CommandItem
                                  key={season.id}
                                  value={season.season_number.toString()}
                                  onSelect={() => {
                                    setSelectedSeason(season.season_number);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      selectedSeason === season.season_number
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  Season {season.season_number}
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </ScrollArea>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <AnimatePresence mode='wait'>
                {isSeasonLoading ? (
                  <div className='flex h-64 items-center justify-center'>
                    <div className='border-primary/20 border-t-primary h-8 w-8 animate-spin rounded-full border-2' />
                  </div>
                ) : (
                  <motion.div
                    key={selectedSeason}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className='grid grid-cols-1 gap-4'
                  >
                    {seasonData?.episodes?.map((episode) => (
                      <div
                        key={episode.id}
                        className='group hover:bg-muted/50 flex cursor-pointer gap-3 rounded-2xl p-2 transition-all md:gap-5 md:p-3'
                        onClick={() =>
                          navigate(
                            `/watch/tv/${id}/${selectedSeason}/${episode.episode_number}`
                          )
                        }
                      >
                        <div className='bg-muted relative aspect-video h-20 shrink-0 overflow-hidden rounded-xl md:h-28'>
                          <img
                            src={getImageUrl(
                              episode.still_path,
                              'w300',
                              'backdrop'
                            )}
                            alt={episode.name}
                            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                          />
                          <div className='bg-background/20 absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100'>
                            <Play className='fill-foreground text-foreground h-7 w-7' />
                          </div>
                        </div>
                        <div className='flex min-w-0 flex-1 flex-col justify-center'>
                          <div className='mb-1.5 flex flex-wrap items-center gap-2'>
                            <span className='text-primary text-[10px] font-black tracking-tighter uppercase'>
                              Episode {episode.episode_number}
                            </span>
                            <h4 className='text-foreground/90 truncate text-sm font-bold md:text-base'>
                              {episode.name}
                            </h4>
                          </div>
                          <p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed md:text-sm'>
                            {episode.overview || 'No description available.'}
                          </p>
                          <div className='text-muted-foreground/60 mt-2 flex items-center gap-3 text-[10px] font-bold md:text-[11px]'>
                            <span>{episode.air_date}</span>
                            <span className='bg-muted-foreground/20 h-1 w-1 rounded-full' />
                            <span>{episode.runtime || 0}m</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        )}

        <TabsContent value='more' className='pt-8 outline-none'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            {similarItems.map((item) => (
              <MediaCard key={item.id} item={item} explicitType={type} />
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
