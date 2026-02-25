import { Search, Tv } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import PageLoader from '@/components/PageLoader';
import { LiveTVPlayer } from '@/components/player/LiveTVPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useLiveTV, useLiveTVCategories } from '@/hooks/useLiveTV';
import { cn } from '@/lib/utils';

export default function LiveTV() {
  const { data: channels, isLoading } = useLiveTV();
  const categories = useLiveTVCategories(channels);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState(null);

  const filteredChannels = useMemo(() => {
    if (!channels) return [];
    return channels.filter((channel) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (channel.categories && channel.categories.includes(selectedCategory));
      const matchesSearch = channel.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [channels, selectedCategory, searchQuery]);

  if (isLoading) return <PageLoader />;

  if (activeChannel) {
    return (
      <div className='fixed inset-0 z-50 h-screen w-full bg-black'>
        <LiveTVPlayer
          streams={activeChannel.streams}
          title={activeChannel.name}
          logo={activeChannel.logo}
          onBack={() => setActiveChannel(null)}
        />
      </div>
    );
  }

  return (
    <div className='bg-background min-h-screen px-4 pt-20 pb-20 md:px-12 lg:px-16'>
      {/* Header Section */}
      <div className='mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center'>
        <div>
          <h1 className='flex items-center gap-3 text-4xl font-bold'>
            <Tv className='text-primary h-8 w-8' />
            Live TV
          </h1>
          <p className='text-muted-foreground mt-1'>
            Explore {channels?.length || 0} channels from around the world
          </p>
        </div>

        {/* Search */}
        <div className='relative w-full md:w-80'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Search channels...'
            className='bg-card/50 border-border/40 focus:border-primary/40 focus:ring-primary/20 pl-10 transition-all'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs'
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Categories ScrollArea */}
      <div className='mb-8'>
        <ScrollArea className='w-full whitespace-nowrap'>
          <div className='flex gap-2 pb-4'>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'secondary'}
                size='sm'
                className={cn(
                  'rounded-full px-5 transition-all duration-300',
                  selectedCategory === cat
                    ? 'shadow-primary/25 shadow-lg'
                    : 'bg-card/40 hover:bg-card/60'
                )}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>
      </div>

      {/* Channels Grid */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            className='group border-border/40 bg-card/30 hover:border-primary/40 hover:bg-card/50 hover:shadow-primary/10 relative aspect-video cursor-pointer overflow-hidden rounded-xl border transition-all duration-500 hover:shadow-2xl'
            onClick={() => setActiveChannel(channel)}
          >
            {/* Logo Area */}
            <div className='flex h-full w-full items-center justify-center p-6'>
              {channel.logo ? (
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className='max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-110'
                  loading='lazy'
                  onError={(e) => {
                    e.target.src = `https://placehold.co/200x200/1a1a1a/ffffff?text=${encodeURIComponent(channel.name)}`;
                  }}
                />
              ) : (
                <div className='flex flex-col items-center gap-2'>
                  <Tv className='text-muted-foreground h-8 w-8 opacity-50' />
                  <span className='text-muted-foreground text-xs font-medium'>
                    {channel.name}
                  </span>
                </div>
              )}
            </div>

            {/* Overlay */}
            <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

            <div className='absolute right-0 bottom-0 left-0 translate-y-2 p-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
              <div className='flex items-center gap-2'>
                <div className='bg-primary h-2 w-2 animate-pulse rounded-full' />
                <span className='truncate text-[11px] font-bold text-white'>
                  {channel.name}
                </span>
              </div>
              <div className='mt-1 flex flex-wrap gap-1'>
                {channel.categories?.slice(0, 1).map((c) => (
                  <span
                    key={c}
                    className='bg-primary/20 text-primary-foreground/90 rounded-sm px-1.5 py-0.5 text-[9px] font-medium'
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredChannels.length === 0 && !isLoading && (
        <div className='flex flex-col items-center justify-center py-32 text-center'>
          <Tv className='text-muted-foreground/30 mb-4 h-12 w-12' />
          <h2 className='text-muted-foreground text-xl font-bold'>
            No channels found
          </h2>
          <p className='text-muted-foreground/60 mt-1'>
            Try adjusting your search or category filter
          </p>
          <Button
            variant='link'
            className='mt-4'
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
}
