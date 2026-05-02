import { AnimatePresence, motion } from 'framer-motion';
import { Download, Film, Image, Play, Tv, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate, useParams, useSearchParams } from 'react-router';

import { getImageUrl } from '@/api/tmdb';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { ScrollFade } from '@/components/ui/scroll-fade';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInfiniteRecommendations, useInfiniteSimilarMedia, useSeasonDetails } from '@/hooks/useMedia';

import { MediaCard } from './MediaCard';

export function MediaDetailContent({ media }) {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const {
    data: similarData,
    fetchNextPage: fetchNextSimilar,
    hasNextPage: hasNextSimilar,
    isFetchingNextPage: isFetchingNextSimilar,
  } = useInfiniteSimilarMedia(type, id);

  const {
    data: recData,
    fetchNextPage: fetchNextRec,
    hasNextPage: hasNextRec,
    isFetchingNextPage: isFetchingNextRec,
  } = useInfiniteRecommendations(type, id);

  const { ref: similarRef, inView: similarInView } = useInView();
  const { ref: recRef, inView: recInView } = useInView();

  const [searchParams, setSearchParams] = useSearchParams();
  const isTV = !!media?.seasons;
  const tab = searchParams.get('tab') || (isTV ? 'episodes' : 'recommendations');
  const selectedSeason = parseInt(searchParams.get('season') || '1', 10);
  const [playingVideo, setPlayingVideo] = useState(null);
  const { data: seasonData, isLoading: isSeasonLoading } = useSeasonDetails(
    id,
    selectedSeason,
    { enabled: isTV }
  );

  const updateSearchParam = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        return next;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    if (similarInView && hasNextSimilar && !isFetchingNextSimilar) {
      fetchNextSimilar();
    }
  }, [similarInView, hasNextSimilar, isFetchingNextSimilar, fetchNextSimilar]);

  useEffect(() => {
    if (recInView && hasNextRec && !isFetchingNextRec) {
      fetchNextRec();
    }
  }, [recInView, hasNextRec, isFetchingNextRec, fetchNextRec]);

  if (!media) return null;

  const credits = media.aggregate_credits || media.credits;
  const cast = (credits?.cast || []).slice(0, 20);

  const keyCrewLabels = new Set([
    'Director',
    'Writer',
    'Producer',
    'Story',
    'Screenplay',
    'Music',
    'Director of Photography',
  ]);
  const crew = (credits?.crew || []).filter((c) => {
    const jobs = c.jobs?.map((j) => j.job) || [c.job];
    return jobs.some((job) => keyCrewLabels.has(job));
  });

  // Deduplicate similar items by ID
  const similarItems = Array.from(
    new Map(
      (similarData?.pages || [])
        .flatMap((page) => page.results || [])
        .map((item) => [item.id, item])
    ).values()
  );

  // Deduplicate recommendation items by ID
  const recItems = Array.from(
    new Map(
      (recData?.pages || [])
        .flatMap((page) => page.results || [])
        .map((item) => [item.id, item])
    ).values()
  );

  const videos = (media.videos?.results || []).sort(
    (a, b) => (b.type === 'Trailer' ? 1 : 0) - (a.type === 'Trailer' ? 1 : 0)
  );
  const backdrops = media.images?.backdrops || [];
  const posters = media.images?.posters || [];

  return (
    <div className='container mx-auto mt-8 space-y-12 pb-8 font-sans'>
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
                      {person.roles?.[0]?.character || person.character}
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
                      {person.jobs?.map((j) => j.job).join(', ') || person.job}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          {/* Certification */}
          {(() => {
            const usRelease = media.release_dates?.results?.find((r) => r.iso_3166_1 === 'US');
            const movieCert = usRelease?.release_dates?.map((d) => d.certification).find((c) => c);
            const tvCert = media.content_ratings?.results?.find((r) => r.iso_3166_1 === 'US')?.rating;
            const cert = movieCert || tvCert;
            return cert ? (
              <div className='space-y-1'>
                <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
                  Rating
                </span>
                <p className='text-foreground/90 text-sm font-bold'>
                  <span className='border-foreground/30 rounded border px-2 py-0.5 text-xs'>
                    {cert}
                  </span>
                </p>
              </div>
            ) : null;
          })()}
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
          {/* Created By (TV) */}
          {(media.created_by || []).length > 0 && (
            <div className='space-y-1'>
              <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
                Created By
              </span>
              <p className='text-foreground/90 text-sm font-bold'>
                {media.created_by.map((c) => c.name).join(', ')}
              </p>
            </div>
          )}
          {/* Type (TV) */}
          {media.type && (
            <div className='space-y-1'>
              <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
                Type
              </span>
              <p className='text-foreground/90 text-sm font-bold'>
                {media.type}
              </p>
            </div>
          )}
          {/* Seasons & Episodes (TV) */}
          {media.number_of_seasons && (
            <div className='space-y-1'>
              <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
                Seasons & Episodes
              </span>
              <p className='text-foreground/90 text-sm font-bold'>
                {media.number_of_seasons} Season{media.number_of_seasons > 1 ? 's' : ''}
                {media.number_of_episodes ? ` • ${media.number_of_episodes} Episodes` : ''}
              </p>
            </div>
          )}
          {/* Last Air Date (TV) */}
          {media.last_air_date && (
            <div className='space-y-1'>
              <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
                Last Aired
              </span>
              <p className='text-foreground/90 text-sm font-bold'>
                {media.last_air_date}
              </p>
            </div>
          )}
          {/* Networks (TV) */}
          {(media.networks || []).length > 0 && (
            <div className='space-y-2'>
              <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
                Networks
              </span>
              <div className='mt-2 flex flex-wrap gap-3'>
                {(media.networks || []).map((network) => (
                  <div key={network.id} title={network.name}>
                    {network.logo_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/h30${network.logo_path}`}
                        alt={network.name}
                        className='max-h-5 object-contain dark:invert'
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
          {/* Production Companies */}
          {(media.production_companies || []).length > 0 && (
            <div className='space-y-2'>
              <span className='text-muted-foreground/50 text-xs font-bold tracking-widest uppercase'>
                Production
              </span>
              <div className='mt-2 flex flex-wrap gap-3'>
                {media.production_companies.map((company) => (
                  <div key={company.id} title={company.name}>
                    {company.logo_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/h30${company.logo_path}`}
                        alt={company.name}
                        className='max-h-5 object-contain dark:invert'
                      />
                    ) : (
                      <span className='text-foreground/80 text-xs font-semibold'>
                        {company.name}
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
      <Tabs value={tab} onValueChange={(val) => updateSearchParam('tab', val)}>
        <ScrollFade>
          <TabsList>
            {isTV && <TabsTrigger value='episodes'>Episodes</TabsTrigger>}
            <TabsTrigger value='recommendations'>Recommended</TabsTrigger>
            <TabsTrigger value='more'>More Like This</TabsTrigger>
            <TabsTrigger value='trailers'>Trailers & More</TabsTrigger>
            <TabsTrigger value='photos'>Photos</TabsTrigger>
          </TabsList>
        </ScrollFade>

        {isTV && (
          <TabsContent value='episodes'>
            <div className='space-y-6'>
              <Tabs
                value={selectedSeason.toString()}
                onValueChange={(val) => updateSearchParam('season', val)}
                className='w-full'
              >
                <ScrollFade>
                  <TabsList>
                    {media.seasons
                      ?.filter((s) => s.season_number > 0)
                      .map((season) => (
                        <TabsTrigger
                          key={season.id}
                          value={season.season_number.toString()}
                        >
                          Season {season.season_number}
                        </TabsTrigger>
                      ))}
                  </TabsList>
                </ScrollFade>
              </Tabs>

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
                        <a
                          href={`https://vidvault.ru/tv/${id}/${selectedSeason}/${episode.episode_number}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          onClick={(e) => e.stopPropagation()}
                          title='Download'
                          aria-label={`Download episode ${episode.episode_number}`}
                          className='text-muted-foreground hover:bg-background/50 hover:text-foreground flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full transition-all'
                        >
                          <Download className='h-4 w-4' />
                        </a>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        )}

        <TabsContent value='recommendations' className='pt-8 outline-none'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            {recItems.map((item) => (
              <MediaCard key={item.id} item={item} explicitType={item.media_type || type} />
            ))}
          </div>
          {recItems.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'><Tv /></EmptyMedia>
                <EmptyTitle>No Recommendations</EmptyTitle>
                <EmptyDescription>We don't have any recommendations for this title yet.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          <div ref={recRef} className='flex h-20 items-center justify-center pt-8'>
            {isFetchingNextRec && (
              <div className='border-primary/20 border-t-primary h-6 w-6 animate-spin rounded-full border-2' />
            )}
          </div>
        </TabsContent>

        <TabsContent value='more' className='pt-8 outline-none'>
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            {similarItems.map((item) => (
              <MediaCard key={item.id} item={item} explicitType={type} />
            ))}
          </div>
          {similarItems.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'><Film /></EmptyMedia>
                <EmptyTitle>No Similar Titles</EmptyTitle>
                <EmptyDescription>We couldn't find any similar titles to show here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          <div ref={similarRef} className='flex h-20 items-center justify-center pt-8'>
            {isFetchingNextSimilar && (
              <div className='border-primary/20 border-t-primary h-6 w-6 animate-spin rounded-full border-2' />
            )}
          </div>
        </TabsContent>

        <TabsContent value='trailers' className='pt-8 outline-none'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {videos.map((video) => (
              <div
                key={video.id}
                className='space-y-3'
                onClick={() => setPlayingVideo(video)}
              >
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
          </div>
          {videos.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'><Video /></EmptyMedia>
                <EmptyTitle>No Videos</EmptyTitle>
                <EmptyDescription>No trailers or clips are available for this title yet.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </TabsContent>

        <TabsContent value='photos' className='pt-8 outline-none'>
          <div className='space-y-8'>
            {/* Backdrops */}
            {backdrops.length > 0 && (
              <div className='space-y-4'>
                <h3 className='text-foreground text-lg font-bold'>Backdrops</h3>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {backdrops.map((photo, index) => (
                    <div
                      key={index}
                      className='bg-muted border-border group relative aspect-video overflow-hidden rounded-xl border'
                    >
                      <img
                        src={getImageUrl(photo.file_path, 'w780')}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                        alt={`Backdrop ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Posters */}
            {posters.length > 0 && (
              <div className='space-y-4'>
                <h3 className='text-foreground text-lg font-bold'>Posters</h3>
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
                  {posters.map((poster, index) => (
                    <div
                      key={index}
                      className='bg-muted border-border group relative aspect-2/3 overflow-hidden rounded-xl border'
                    >
                      <img
                        src={getImageUrl(poster.file_path, 'w500')}
                        className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                        alt={`Poster ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {backdrops.length === 0 && posters.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant='icon'><Image /></EmptyMedia>
                  <EmptyTitle>No Photos</EmptyTitle>
                  <EmptyDescription>No backdrops or posters are available for this title yet.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Player Modal */}
      <Dialog
        open={!!playingVideo}
        onOpenChange={(open) => !open && setPlayingVideo(null)}
      >
        <DialogContent className='max-w-5xl border-none bg-transparent p-0 shadow-none outline-none'>
          <DialogTitle className='sr-only'>
            {playingVideo?.name || 'Video Player'}
          </DialogTitle>
          {playingVideo && (
            <div className='aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl'>
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.key}?autoplay=1`}
                title={playingVideo.name}
                className='h-full w-full'
                allowFullScreen
                allow='autoplay; encrypted-media'
                sandbox='allow-scripts allow-same-origin allow-presentation'
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
