import { AnimatePresence, motion } from 'framer-motion';
import { Tv } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { ChannelCard } from '@/components/livetv/ChannelCard';
import { ChannelGridSkeleton } from '@/components/livetv/ChannelSkeleton';
import { LiveTVHeader } from '@/components/livetv/LiveTVHeader';
import { LiveTVPlayer } from '@/components/player/LiveTVPlayer';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useDetailedLiveTV,
  useLanguages,
  useLiveTVCategories,
} from '@/hooks/useLiveTV';

export default function LiveTV() {
  const [selectedLanguage, setSelectedLanguage] = useState('hin');
  const { data: channels, isLoading } = useDetailedLiveTV({
    language: selectedLanguage,
  });
  const languages = useLanguages();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChannel, setActiveChannel] = useState(null);

  const categories = useLiveTVCategories(channels);

  const filteredChannels = useMemo(() => {
    if (!channels) return [];
    return channels.filter((channel) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (channel.categories &&
          channel.categories.some(
            (cat) => cat.toLowerCase() === selectedCategory.toLowerCase()
          ));
      const matchesSearch = channel.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [channels, selectedCategory, searchQuery]);

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
    <div className='bg-background min-h-screen px-4 pt-24 pb-20 md:px-12 lg:px-16'>
      <div className=''>
        <LiveTVHeader
          channelCount={channels?.length || 0}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          languages={languages}
        />

        {/* Categories Section */}
        <div className='mb-8'>
          <Tabs
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className='w-full'
          >
            <ScrollArea className='w-full'>
              <TabsList className='bg-background/50 border-border/40 inline-flex h-12 w-full justify-start gap-2 rounded-full border p-1.5 backdrop-blur-sm'>
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-full rounded-full px-6 text-sm font-semibold transition-all duration-300'
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation='horizontal' className='invisible' />
            </ScrollArea>
          </Tabs>
        </div>

        {/* Content Area */}
        <AnimatePresence mode='wait'>
          {isLoading ? (
            <motion.div
              key='loading'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChannelGridSkeleton count={12} />
            </motion.div>
          ) : filteredChannels.length > 0 ? (
            <motion.div
              key='grid'
              className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {filteredChannels.map((channel) => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  onClick={setActiveChannel}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key='empty'
              className='flex flex-col items-center justify-center py-32 text-center'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
