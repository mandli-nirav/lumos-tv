import { Link, useRouteError } from 'react-router';

import { Button } from '@/components/ui/button';

export function RouteError() {
  const error = useRouteError();
  return (
    <div className='flex h-[70vh] flex-col items-center justify-center gap-4 text-center'>
      <h1 className='text-6xl font-extrabold'>Oops!</h1>
      <p className='text-muted-foreground text-xl'>
        {error?.status === 404
          ? "The page you're looking for doesn't exist."
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
