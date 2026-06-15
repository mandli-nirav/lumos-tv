import { Link } from 'react-router';

import { getImageUrl } from '@/api/tmdb';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function CollectionCard({ collection }) {
  const title = collection.name || 'Untitled Collection';
  const itemCount = collection.parts?.length || 0;
  const poster = collection.poster_path || collection.backdrop_path;
  const badgeLabel =
    itemCount > 0
      ? `${itemCount} film${itemCount === 1 ? '' : 's'}`
      : 'Collection';

  return (
    <Card className='group bg-card/30 border-border/40 hover:bg-card/50 overflow-hidden p-0 shadow-none transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-2xl'>
      <CardContent className='p-0'>
        <Link
          to={`/collections/${collection.id}`}
          aria-label={`${title} collection details`}
          className='block'
        >
          <div className='relative aspect-2/3 overflow-hidden'>
            <img
              src={getImageUrl(poster, 'w500', 'poster')}
              alt={title}
              className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
              loading='lazy'
              decoding='async'
            />
            <div className='absolute inset-0 bg-linear-to-t from-black/95 via-black/35 to-transparent' />

            <div className='absolute top-3 right-3'>
              <Badge
                variant='secondary'
                className='bg-black/60 text-white/90 backdrop-blur-md'
              >
                {badgeLabel}
              </Badge>
            </div>

            <div className='absolute inset-x-0 bottom-0 p-4 pt-12'>
              <h3 className='text-base leading-tight font-bold text-balance text-white'>
                {title}
              </h3>
              {collection.overview && (
                <p className='mt-1 line-clamp-2 text-xs leading-relaxed text-white/65'>
                  {collection.overview}
                </p>
              )}
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
