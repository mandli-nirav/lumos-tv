import { Search } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { mainNav } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';

export function Header() {
  const appName = useAppStore((state) => state.appName);
  const location = useLocation();

  return (
    <header className='border-border/40 bg-background/80 sticky top-0 z-40 w-full border-b font-sans backdrop-blur-xl'>
      <div className='container mx-auto flex h-16 items-center px-4 md:px-8'>
        {/* Left: Logo */}
        <div className='flex flex-1 items-center justify-start'>
          <Link to='/' className='group flex shrink-0 items-center gap-2'>
            <img
              src='/assets/logos/lumos-dark.svg'
              alt='Lumos TV'
              className='h-7 w-auto shrink-0 transition-transform group-hover:scale-105 lg:h-8 dark:hidden'
            />
            <img
              src='/assets/logos/lumos-light.svg'
              alt='Lumos TV'
              className='hidden h-7 w-auto shrink-0 transition-transform group-hover:scale-105 lg:h-8 dark:block'
            />
            <span className='sr-only'>{appName}</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className='flex flex-none items-center justify-center lg:flex-1'>
          <NavigationMenu className='hidden lg:flex'>
            <NavigationMenuList className='gap-2'>
              {mainNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      active={isActive}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'px-4 text-sm font-bold tracking-tight transition-all',
                        isActive
                          ? 'text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary'
                          : 'text-muted-foreground hover:text-foreground bg-transparent'
                      )}
                    >
                      <Link to={item.href}>{item.title}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right: Actions */}
        <div className='flex flex-1 items-center justify-end gap-3'>
          <Button
            variant='ghost'
            size='icon'
            asChild
            className='text-muted-foreground hover:text-primary hover:bg-primary/10 h-10 w-10 transition-colors'
          >
            <Link to='/search'>
              <Search className='h-5 w-5' />
              <span className='sr-only'>Search</span>
            </Link>
          </Button>
          <div className='bg-border/60 mx-1 h-6 w-px' />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
