import { Globe, Search, Tv } from 'lucide-react';
import React from 'react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LiveTVHeader({
  channelCount,
  searchQuery,
  setSearchQuery,
  selectedLanguage,
  setSelectedLanguage,
  languages = [],
}) {
  return (
    <div className='mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center'>
      <div>
        <h1 className='flex items-center gap-3 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          <Tv className='text-primary h-10 w-10' />
          Live TV
        </h1>
        <p className='text-muted-foreground mt-2'>
          Watch{' '}
          <span className='text-foreground font-semibold'>{channelCount}</span>{' '}
          premium channels live
        </p>
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        {/* Language Dropdown */}
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className='bg-card/40 border-border/40 hover:bg-card/60 w-40 transition-colors'>
            <Globe className='text-muted-foreground mr-2 h-4 w-4' />
            <SelectValue placeholder='Language' />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search */}
        <div className='relative w-full max-sm:order-first md:w-72'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Search channels...'
            className='bg-card/40 border-border/40 focus:border-primary/40 focus:ring-primary/20 pl-10 transition-all'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-[10px] font-bold tracking-wider uppercase'
              onClick={() => setSearchQuery('')}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
