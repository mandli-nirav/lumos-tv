import { Film, Home, Layers, Tv } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { cn } from '@/lib/utils';

const navItems = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Live TV', href: '/live-tv', icon: Tv },
  { title: 'Movies', href: '/movies', icon: Film },
  { title: 'TV Shows', href: '/tv-shows', icon: Tv },
  { title: 'Library', href: '/collections', icon: Layers },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className='bg-background/80 border-border/40 fixed bottom-0 z-40 flex w-full items-center justify-around border-t py-2 backdrop-blur-xl lg:hidden'>
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex flex-col items-center gap-1 transition-all',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon
              className={cn('h-5 w-5', isActive ? 'fill-primary/20' : '')}
            />
            <span className='text-[10px] font-bold tracking-tight'>
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
