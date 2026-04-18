import { Globe, Search, Tv } from 'lucide-react';

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
    <div className='mb-4 space-y-3 sm:mb-6 sm:space-y-4'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:gap-3 sm:text-3xl lg:text-4xl'>
            <Tv className='text-primary h-7 w-7 sm:h-8 sm:w-8' />
            Live TV
          </h1>
          <p className='text-muted-foreground mt-0.5 text-sm'>
            <span className='text-foreground font-semibold'>{channelCount}</span>{' '}
            channels live
          </p>
        </div>

        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className='bg-card/40 border-border/40 hover:bg-card/60 w-32 shrink-0 transition-colors sm:w-40'>
            <Globe className='text-muted-foreground mr-1.5 h-4 w-4' />
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
      </div>

      <div className='relative'>
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
  );
}
