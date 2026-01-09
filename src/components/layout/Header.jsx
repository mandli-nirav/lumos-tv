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
        'fixed top-0 z-40 w-full font-sans transition-all duration-300',
        isScrolled
          ? 'border-border/40 bg-background/80 border-b backdrop-blur-xl'
          : 'border-transparent bg-linear-to-b from-black/80 via-black/40 to-transparent'
      )}
    >
      <div className='container mx-auto flex h-16 items-center px-4 md:px-8'>
        {/* Left: Logo */}
        <div className='flex flex-1 items-center justify-start'>
          <Link to='/' className='group flex shrink-0 items-center gap-2'>
            <img
              src='/assets/logos/lumos-dark.svg'
              alt='Lumos TV'
              className={cn(
                'h-7 w-auto shrink-0 transition-transform group-hover:scale-105 lg:h-8 dark:hidden',
                !isScrolled && 'brightness-0 invert'
              )}
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
                            : 'bg-transparent text-white/80 hover:text-white'
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
                : 'text-white/80 hover:bg-white/10 hover:text-white'
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
              isScrolled ? 'bg-border/60' : 'bg-white/20'
            )}
          />
          <ModeToggle
            className={cn(
              isScrolled
                ? 'text-muted-foreground'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          />
        </div>
      </div>
    </header>
  );
}
