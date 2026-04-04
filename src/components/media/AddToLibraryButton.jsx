import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AddToLibraryButton({ isIcon = false, className, ...props }) {
  const handleClick = () => {
    toast.info('Library feature coming soon!');
  };

  return (
    <Button
      variant='secondary'
      size={isIcon ? 'icon' : 'default'}
      className={cn(className)}
      onClick={handleClick}
      {...props}
    >
      <Plus />
      {!isIcon && <span className='md:hidden'>Add to Library</span>}
    </Button>
  );
}
