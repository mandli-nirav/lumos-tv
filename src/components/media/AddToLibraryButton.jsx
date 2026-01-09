import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AddToLibraryButton({ isIcon = false, className, ...props }) {
  return (
    <Button
      variant='secondary'
      size={isIcon ? 'icon' : 'default'}
      className={cn(className)}
      {...props}
    >
      <Plus />
      {!isIcon && <span className='md:hidden'>Add to Library</span>}
    </Button>
  );
}
