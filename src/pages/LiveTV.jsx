import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Tv } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ChannelCard } from '@/components/livetv/ChannelCard';
import { ChannelGridSkeleton } from '@/components/livetv/ChannelSkeleton';
import { LiveTVHeader } from '@/components/livetv/LiveTVHeader';
import { LiveTVPlayer } from '@/components/player/LiveTVPlayer';
import { Button } from '@/components/ui/button';
import { ScrollFade } from '@/components/ui/scroll-fade';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ALL_LANGUAGES,
  useDetailedLiveTV,
  useLanguages,
  useLiveTVCategories,
} from '@/hooks/useLiveTV';

// Matches the Tailwind grid-cols classes below
const getColumns = (width) => {
  if (width >= 1280) return 6; // xl
  if (width >= 1024) return 5; // lg
  if (width >= 768) return 4; // md
  if (width >= 640) return 3; // sm
  return 2; // mobile
};

// Rough row height including gap. Cards are 16:9, so height = columnWidth * 9/16
// Container max width ~1280px, gap ~16px.
const estimateRowHeight = (width) => {
  const cols = getColumns(width);
  const maxContainerWidth = Math.min(width, 1280) - 32; // px-4 padding
  const gap = 16;
  const colWidth = (maxContainerWidth - gap * (cols - 1)) / cols;
  return Math.round((colWidth * 9) / 16) + gap;
};

export default function LiveTV() {
  const [selectedLanguage, setSelectedLanguage] = useState(ALL_LANGUAGES);
  const {
    data: channels,
    isLoading,
    isError,
    refetch,
  } = useDetailedLiveTV({ language: selectedLanguage });
  const languages = useLanguages();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState(null);

  const categories = useLiveTVCategories(channels);

  // Responsive column tracking
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const columns = getColumns(viewportWidth);
  const rowHeight = estimateRowHeight(viewportWidth);

  const filteredChannels = useMemo(() => {
    if (!channels) return [];
    const q = searchQuery.trim().toLowerCase();
    const cat = selectedCategory.toLowerCase();
    return channels.filter((channel) => {
      if (selectedCategory !== 'All') {
        const match = channel.categories?.some((c) => c.toLowerCase() === cat);
        if (!match) return false;
      }
      if (q && !channel.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [channels, selectedCategory, searchQuery]);

  const rows = useMemo(() => {
    const rowArray = [];
    for (let i = 0; i < filteredChannels.length; i += columns) {
      rowArray.push(filteredChannels.slice(i, i + columns));
    }
    return rowArray;
  }, [filteredChannels, columns]);

  const listRef = useRef(null);
  const [listOffset, setListOffset] = useState(0);

  useEffect(() => {
    if (!listRef.current) return;
    const updateOffset = () => {
      const rect = listRef.current.getBoundingClientRect();
      setListOffset(rect.top + window.scrollY);
    };
    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, [isLoading, isError, rows.length]);

  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => rowHeight,
    overscan: 3,
    scrollMargin: listOffset,
  });

  const handleChannelClick = useCallback((channel) => {
    setActiveChannel(channel);
  }, []);

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

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className='bg-background container mx-auto min-h-screen pt-20 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:pt-24'>
      <LiveTVHeader
        channelCount={channels?.length || 0}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        languages={languages}
      />

      <div className='mb-4 sm:mb-6'>
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className='w-full'
        >
          <ScrollFade>
            <TabsList>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat}>
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </ScrollFade>
        </Tabs>
      </div>

      {isLoading ? (
        <ChannelGridSkeleton count={12} />
      ) : isError ? (
        <div className='flex flex-col items-center justify-center py-32 text-center'>
          <div className='bg-card/50 mb-6 rounded-full p-6'>
            <Tv className='text-muted-foreground/30 h-12 w-12' />
          </div>
          <h2 className='text-foreground text-xl font-bold'>
            Failed to load channels
          </h2>
          <p className='text-muted-foreground/60 mt-1'>
            Could not fetch live TV data. Please try again.
          </p>
          <Button variant='outline' className='mt-4' onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : filteredChannels.length > 0 ? (
        <div
          ref={listRef}
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${
                  virtualItem.start - virtualizer.options.scrollMargin
                }px)`,
              }}
              className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            >
              {rows[virtualItem.index]?.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onClick={handleChannelClick}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-32 text-center'>
          <div className='bg-card/50 mb-6 rounded-full p-6'>
            <Tv className='text-muted-foreground/30 h-12 w-12' />
          </div>
          <h2 className='text-foreground text-xl font-bold'>
            No channels found
          </h2>
          <p className='text-muted-foreground/60 mt-1'>
            Try adjusting your search or category filter for "{searchQuery}"
          </p>
          <Button
            variant='link'
            className='text-primary mt-4'
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
