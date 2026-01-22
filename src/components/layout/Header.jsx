import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 z-[100] w-full border-none font-sans transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl'
          : 'from-background/95 via-background/60 border-transparent bg-linear-to-b to-transparent dark:from-black/80 dark:via-black/40'
      )}
    >
      <div className='container mx-auto flex h-16 items-center px-4 md:px-8'>
        {/* Left: Logo */}
        <div className='flex flex-1 items-center justify-start'>
          <Link to='/' className='group flex shrink-0 items-center gap-2'>
            <img
              src='/assets/logos/lumos-dark.svg'
              alt='Lumos TV'
              className={cn('h-7 w-auto shrink-0 lg:h-8 dark:hidden')}
            />
            <img
              src='/assets/logos/lumos-light.svg'
              alt='Lumos TV'
              className='hidden h-7 w-auto shrink-0 lg:h-8 dark:block'
            />
            <span className='sr-only'>{appName}</span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <div className='flex flex-none items-center justify-center'>
          <NavigationMenu className='hidden lg:flex'>
            <NavigationMenuList className='gap-1 xl:gap-2'>
              {mainNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      active={isActive}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'text-sm font-bold tracking-tight transition-all lg:px-2 xl:px-4',
                        isActive
                          ? 'text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary'
                          : isScrolled
                            ? 'text-muted-foreground hover:text-foreground bg-transparent'
                            : 'text-foreground/80 hover:text-foreground bg-transparent dark:text-white/80 dark:hover:text-white'
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
        <div className='flex flex-1 items-center justify-end gap-1 md:gap-3'>
          <Button
            variant='ghost'
            size='icon'
            asChild
            className={cn(
              'h-10 w-10 transition-colors',
              isScrolled
                ? 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                : 'text-foreground/80 hover:bg-foreground/10 hover:text-foreground dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white'
            )}
          >
            <Link to='/search'>
              <Search className='h-5 w-5' />
              <span className='sr-only'>Search</span>
            </Link>
          </Button>
          <div
            className={cn(
              'mx-1 h-6 w-px',
              isScrolled ? 'bg-border/60' : 'bg-foreground/20 dark:bg-white/20'
            )}
          />
          <ModeToggle
            className={cn(
              isScrolled
                ? 'text-muted-foreground'
                : 'text-foreground/80 hover:bg-foreground/10 hover:text-foreground dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white'
            )}
          />
        </div>
      </div>
    </header>
  );
}
