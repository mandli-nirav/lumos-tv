import { Link, useRouteError } from 'react-router';

import { Button } from '@/components/ui/button';

/**
 * Detect a failed lazy-route chunk download.
 *
 * A blocked or missing route module throws a TypeError mentioning the dynamic
 * import. The usual causes are an ad blocker blocking the request
 * (net::ERR_BLOCKED_BY_CLIENT), a dropped connection, or a stale chunk hash
 * after a new deploy.
 *
 * @param {unknown} error
 * @returns {boolean}
 */
function isChunkLoadError(error) {
  const msg = error?.message || String(error || '');
  return (
    /dynamically imported module/i.test(msg) ||
    /importing a module script failed/i.test(msg) ||
    /failed to fetch/i.test(msg)
  );
}

export function RouteError() {
  const error = useRouteError();
  const chunkError = isChunkLoadError(error);

  return (
    <div className='flex h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center'>
      <h1 className='text-6xl font-extrabold'>Oops!</h1>
      <p className='text-muted-foreground max-w-md text-xl'>
        {error?.status === 404
          ? "The page you're looking for doesn't exist."
          : chunkError
            ? 'This page could not load. If you use an ad blocker, please allow this site — it may be blocking part of the page. A weak connection can also cause this.'
            : 'Something went wrong. Please try again.'}
      </p>
      <div className='flex gap-3'>
        <Button variant='outline' onClick={() => window.location.reload()}>
          Retry
        </Button>
        <Button asChild>
          <Link to='/'>Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
