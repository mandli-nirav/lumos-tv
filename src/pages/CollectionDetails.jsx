import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { lazy, Suspense, useMemo } from 'react';
import { Link, useParams } from 'react-router';

import { getImageUrl } from '@/api/tmdb';
import { MediaCard } from '@/components/media/MediaCard';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { SEO } from '@/components/seo/SEO';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCollectionDetails } from '@/hooks/useMedia';
import { breadcrumbSchema } from '@/lib/structuredData';
import { truncate } from '@/lib/utils';

const NotFound = lazy(() => import('@/pages/NotFound'));

export default function CollectionDetails() {
  const { id } = useParams();
  const {
    data: collection,
    isLoading,
    isError,
    refetch,
  } = useCollectionDetails(id);

  const title = collection?.name || 'Collection';
  const canonicalPath = `/collections/${id}`;
  const seo = collection ? (
    <SEO
      title={title}
      description={
        truncate(collection.overview, 160) || `Browse the ${title} collection.`
      }
      image={
        collection.backdrop_path
          ? getImageUrl(collection.backdrop_path, 'w1280')
          : collection.poster_path
            ? getImageUrl(collection.poster_path, 'w780')
            : undefined
      }
      url={canonicalPath}
      jsonLd={breadcrumbSchema([
        { label: 'Home', href: '/' },
        { label: 'Collections', href: '/collections' },
        { label: title },
      ])}
    />
  ) : (
    <SEO url={canonicalPath} />
  );

  if (isLoading) {
    return (
      <div className='bg-background flex h-screen items-center justify-center'>
        {seo}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className='border-primary/20 border-t-primary h-12 w-12 animate-spin rounded-full border-4'
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='bg-background flex h-[70vh] flex-col items-center justify-center gap-4 text-center'>
        <h1 className='text-4xl font-extrabold'>Something went wrong</h1>
        <p className='text-muted-foreground text-lg'>
          Failed to load collection details. Please try again.
        </p>
        <div className='flex gap-3'>
          <Button variant='outline' onClick={() => refetch()}>
            Try Again
          </Button>
          <Button asChild>
            <Link to='/collections'>Back to Collections</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    );
  }

  const parts = collection.parts || [];
  const sortedParts = useMemo(() => {
    return [...parts].sort((left, right) => {
      const leftDate = left.release_date ? new Date(left.release_date) : null;
      const rightDate = right.release_date
        ? new Date(right.release_date)
        : null;

      if (!leftDate && !rightDate) return 0;
      if (!leftDate) return 1;
      if (!rightDate) return -1;

      return leftDate.getTime() - rightDate.getTime();
    });
  }, [parts]);

  const firstReleaseYear = sortedParts[0]?.release_date
    ? new Date(sortedParts[0].release_date).getFullYear()
    : null;
  const lastReleaseYear = sortedParts[sortedParts.length - 1]?.release_date
    ? new Date(sortedParts[sortedParts.length - 1].release_date).getFullYear()
    : null;
  const featuredParts = sortedParts.slice(0, 3);

  return (
    <div className='bg-background min-h-screen pb-12'>
      {seo}

      <div className='relative overflow-hidden pt-24 pb-10'>
        <div className='absolute inset-0 -z-10'>
          <img
            src={
              collection.backdrop_path
                ? getImageUrl(collection.backdrop_path, 'w1280')
                : getImageUrl(collection.poster_path, 'w1280')
            }
            alt={collection.name}
            className='h-full w-full object-cover opacity-25 blur-[2px]'
          />
          <div className='to-background to-background absolute inset-0 bg-linear-to-b from-black/92 via-black/68' />
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.18),transparent_35%)]' />
        </div>

        <div className='container mx-auto space-y-6'>
          <Button
            variant='ghost'
            asChild
            className='w-fit px-0 hover:bg-transparent'
          >
            <Link to='/collections' className='gap-2'>
              <ArrowLeft className='h-4 w-4' />
              Back to Collections
            </Link>
          </Button>

          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Collections', href: '/collections' },
              { label: title },
            ]}
          />

          <div className='grid gap-8 lg:grid-cols-[320px_1fr] lg:items-end'>
            <Card className='border-border/50 bg-card/30 overflow-hidden p-0 shadow-xl backdrop-blur-sm'>
              <CardContent className='p-0'>
                <div className='relative aspect-2/3'>
                  <img
                    src={getImageUrl(collection.poster_path, 'w780')}
                    alt={collection.name}
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/5 to-transparent' />
                  <div className='absolute inset-x-0 bottom-0 p-5'>
                    <p className='text-xs font-semibold tracking-[0.3em] text-white/60 uppercase'>
                      Collection spotlight
                    </p>
                    <h2 className='mt-2 line-clamp-2 text-xl font-black text-white xl:text-2xl'>
                      {title}
                    </h2>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className='space-y-4 xl:space-y-5'>
              <div className='flex flex-wrap items-center gap-3'>
                <Badge
                  variant='secondary'
                  className='bg-primary/15 text-primary'
                >
                  {parts.length} film{parts.length === 1 ? '' : 's'}
                </Badge>
                {(firstReleaseYear || lastReleaseYear) && (
                  <Badge
                    variant='secondary'
                    className='bg-white/10 text-white backdrop-blur-sm'
                  >
                    {firstReleaseYear}
                    {lastReleaseYear && lastReleaseYear !== firstReleaseYear
                      ? ` • ${lastReleaseYear}`
                      : ''}
                  </Badge>
                )}
              </div>

              <h1 className='max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl'>
                {title}
              </h1>

              {collection.overview && (
                <p className='text-muted-foreground max-w-3xl text-base leading-7 sm:text-lg xl:max-w-4xl'>
                  {collection.overview}
                </p>
              )}

              <div className='flex flex-wrap gap-3'>
                <div className='border-border/50 bg-card/30 rounded-2xl border px-4 py-3 backdrop-blur-sm'>
                  <p className='text-muted-foreground text-[11px] tracking-[0.24em] uppercase'>
                    Films
                  </p>
                  <p className='mt-1 text-lg font-bold'>{parts.length}</p>
                </div>
                <div className='border-border/50 bg-card/30 rounded-2xl border px-4 py-3 backdrop-blur-sm'>
                  <p className='text-muted-foreground text-[11px] tracking-[0.24em] uppercase'>
                    Years
                  </p>
                  <p className='mt-1 text-lg font-bold'>
                    {firstReleaseYear && lastReleaseYear
                      ? firstReleaseYear === lastReleaseYear
                        ? `${firstReleaseYear}`
                        : `${firstReleaseYear}–${lastReleaseYear}`
                      : '—'}
                  </p>
                </div>
                <div className='border-border/50 bg-card/30 rounded-2xl border px-4 py-3 backdrop-blur-sm'>
                  <p className='text-muted-foreground text-[11px] tracking-[0.24em] uppercase'>
                    Ordered by
                  </p>
                  <p className='mt-1 text-lg font-bold'>Year</p>
                </div>
              </div>

              {featuredParts.length > 0 && (
                <div className='space-y-3 pt-2'>
                  <p className='text-muted-foreground text-sm tracking-[0.24em] uppercase'>
                    Featured entries
                  </p>
                  <div className='flex gap-3 overflow-x-auto pb-2'>
                    {featuredParts.map((item) => (
                      <div
                        key={item.id}
                        className='bg-card/30 border-border/50 min-w-28 overflow-hidden rounded-2xl border backdrop-blur-sm'
                      >
                        <div className='aspect-2/3'>
                          <img
                            src={getImageUrl(item.poster_path, 'w342')}
                            alt={item.title}
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div className='p-3'>
                          <p className='line-clamp-2 text-sm font-semibold'>
                            {item.title}
                          </p>
                          <p className='text-muted-foreground mt-1 text-xs'>
                            {item.release_date
                              ? new Date(item.release_date).getFullYear()
                              : 'TBA'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto space-y-6'>
        <div className='flex items-end justify-between gap-4'>
          <div>
            <h2 className='text-2xl font-bold'>Movies in this collection</h2>
            <p className='text-muted-foreground text-sm'>
              Ordered by release year, oldest to newest.
            </p>
          </div>
        </div>

        {sortedParts.length > 0 ? (
          <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {sortedParts.map((item, index) => (
              <MediaCard
                key={`${item.id}-${index}`}
                item={item}
                explicitType='movie'
              />
            ))}
          </div>
        ) : (
          <div className='border-border/50 bg-card/30 flex min-h-72 items-center justify-center rounded-2xl border text-center'>
            <p className='text-muted-foreground'>
              This collection does not have movie parts listed yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
