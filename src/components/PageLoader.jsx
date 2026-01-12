import { Spinner } from '@/components/ui/spinner';

const PageLoader = () => (
  <div className='flex h-screen w-full items-center justify-center'>
    <Spinner />
  </div>
);

export default PageLoader;
