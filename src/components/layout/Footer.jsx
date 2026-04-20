import { Link } from 'react-router';

import { useAppStore } from '@/store/useAppStore';

const footerLinks = [
  {
    title: 'Movies',
    links: [
      { label: 'Browse', href: '/movies' },
      { label: 'Popular', href: '/movies' },
      { label: 'Top Rated', href: '/movies' },
    ],
  },
  {
    title: 'TV Shows',
    links: [
      { label: 'Browse', href: '/tv-shows' },
      { label: 'Popular', href: '/tv-shows' },
      { label: 'Top Rated', href: '/tv-shows' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Live TV', href: '/live-tv' },
      { label: 'Search', href: '/search' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'DMCA Policy', href: '#' },
      { label: 'Disclaimer', href: '#' },
      { label: 'Contact Us', href: '#' },
    ],
  },
];

export function Footer() {
  const appName = useAppStore((state) => state.appName);
  const year = new Date().getFullYear();

  return (
    <footer className='border-border/40 hidden border-t lg:block'>
      <div className='container mx-auto px-4 pt-12 pb-8'>
        {/* Top Section: Logo + Link Columns */}
        <div className='grid grid-cols-5 gap-8'>
          {/* Brand Column */}
          <div className='col-span-1'>
            <Link to='/' className='inline-block'>
              <img
                src='/assets/logos/lumos-dark.svg'
                alt={appName}
                className='h-7 w-auto dark:hidden'
              />
              <img
                src='/assets/logos/lumos-light.svg'
                alt={appName}
                className='hidden h-7 w-auto dark:block'
              />
            </Link>
            <p className='text-muted-foreground mt-4 text-sm leading-relaxed'>
              Browse movies, series, and live TV with a clean, modern interface.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className='text-foreground mb-4 text-xs font-bold tracking-widest uppercase'>
                {section.title}
              </h3>
              <ul className='space-y-2.5'>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className='text-muted-foreground hover:text-primary text-sm transition-colors'
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className='border-border/40 mt-12 border-t' />

        {/* Bottom Section */}
        <div className='mt-6 space-y-3'>
          <p className='text-muted-foreground text-sm'>
            Copyright {year} {appName}. All rights reserved.
          </p>
          <div className='flex items-center gap-3'>
            <span className='border-border text-muted-foreground rounded border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase'>
              TMDB API
            </span>
            <span className='border-border text-muted-foreground rounded border px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase'>
              IPTV-Org
            </span>
          </div>
          <p className='text-muted-foreground/60 max-w-3xl text-xs leading-relaxed'>
            {appName} does not host any video content. All media is provided by
            third-party sources. {appName} is not responsible for the accuracy,
            compliance, copyright, legality, or decency of content hosted by
            third-party services.
          </p>
        </div>
      </div>
    </footer>
  );
}
