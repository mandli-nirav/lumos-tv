import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className='flex h-[70vh] flex-col items-center justify-center gap-4 text-center'>
      <h1 className='text-6xl font-extrabold'>404</h1>
      <p className='text-muted-foreground text-xl'>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to='/'>Go back Home</Link>
      </Button>
    </div>
  );
}
