import { useState } from 'react';

import { MatchGrid } from '@/components/sports/MatchGrid';
import { SportCard } from '@/components/sports/SportCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useLiveMatches,
  usePopularMatches,
  useSports,
  useTodayMatches,
} from '@/hooks/useSports';

export default function Sports() {
  const [selectedSport, setSelectedSport] = useState(null);

  const { data: sports, isLoading: sportsLoading } = useSports();
  const { data: liveMatches, isLoading: liveLoading } =
    useLiveMatches(selectedSport);
  const { data: popularMatches, isLoading: popularLoading } =
    usePopularMatches(selectedSport);
  const { data: todayMatches, isLoading: todayLoading } =
    useTodayMatches(selectedSport);

  return (
    <div className='bg-background min-h-screen pt-16'>
      {/* Header */}
      <div className='border-border bg-card/50 border-b backdrop-blur-sm'>
        <div className='container mx-auto px-4 py-8'>
          <h1 className='text-foreground text-4xl font-bold'>Live Sports</h1>
          <p className='text-muted-foreground mt-2'>
            Watch live sports from around the world
          </p>
        </div>
      </div>

      {/* Sport Categories */}
      <div className='border-border bg-card/30 border-b'>
        <div className='container mx-auto px-4 py-6'>
          <h2 className='text-muted-foreground mb-4 text-sm font-bold tracking-wider uppercase'>
            Select Sport
          </h2>
          <ScrollArea className='w-full'>
            <div className='flex gap-4 pb-4'>
              {/* All Sports */}
              <SportCard
                sport={{ id: 'all', name: 'All Sports' }}
                isActive={selectedSport === null}
                onClick={() => setSelectedSport(null)}
              />

              {/* Individual Sports */}
              {sportsLoading
                ? [...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className='bg-muted h-28 w-28 shrink-0 animate-pulse rounded-xl'
                    />
                  ))
                : sports?.map((sport) => (
                    <SportCard
                      key={sport.id}
                      sport={sport}
                      isActive={selectedSport === sport.id}
                      onClick={() => setSelectedSport(sport.id)}
                    />
                  ))}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>

      {/* Matches Tabs */}
      <div className='container mx-auto px-4 py-8'>
        <Tabs defaultValue='live' className='w-full'>
          <TabsList className='mb-6'>
            <TabsTrigger value='live'>Live Now</TabsTrigger>
            <TabsTrigger value='popular'>Popular</TabsTrigger>
            <TabsTrigger value='today'>Today's Matches</TabsTrigger>
          </TabsList>

          <TabsContent value='live'>
            <MatchGrid matches={liveMatches} isLoading={liveLoading} />
          </TabsContent>

          <TabsContent value='popular'>
            <MatchGrid matches={popularMatches} isLoading={popularLoading} />
          </TabsContent>

          <TabsContent value='today'>
            <MatchGrid matches={todayMatches} isLoading={todayLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
