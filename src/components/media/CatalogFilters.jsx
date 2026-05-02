import { SlidersHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useCountries, useGenreList, useWatchProviders } from '@/hooks/useMedia';

import {
  MONETIZATION_TYPES,
  MOVIE_CERTIFICATIONS_US,
  POPULAR_NETWORKS,
  RELEASE_TYPES,
  TV_STATUS,
  TV_TYPE,
  YEARS,
} from './catalogFilterOptions';

const NONE = '__none__';

function Section({ title, children }) {
  return (
    <div className='space-y-3'>
      <h3 className='text-foreground text-sm font-bold tracking-wide uppercase'>
        {title}
      </h3>
      {children}
    </div>
  );
}

function CheckboxList({ options, values, onChange, getLabel, getKey }) {
  return (
    <div className='grid grid-cols-2 gap-2'>
      {options.map((opt) => {
        const key = getKey(opt);
        const checked = values.includes(key);
        return (
          <label
            key={key}
            className='hover:bg-muted/50 flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm'
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(c) => {
                const next = c
                  ? [...values, key]
                  : values.filter((v) => v !== key);
                onChange(next);
              }}
            />
            <span className='leading-none'>{getLabel(opt)}</span>
          </label>
        );
      })}
    </div>
  );
}

export function CatalogFilters({ mediaType, filters, update, reset, activeCount }) {
  const { data: genres = [] } = useGenreList(mediaType);
  const { data: countries = [] } = useCountries();
  const { data: providers = [] } = useWatchProviders(
    mediaType,
    filters.watchRegion || 'US'
  );

  const ratingMin = filters.voteAverageGte ?? 0;
  const ratingMax = filters.voteAverageLte ?? 10;
  const runtimeMin = filters.runtimeGte ?? 0;
  const runtimeMax = filters.runtimeLte ?? 300;
  const votesMin = filters.voteCountGte ?? 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <SlidersHorizontal className='h-4 w-4' />
          Filters
          {activeCount > 0 && (
            <Badge variant='secondary' className='ml-1 h-5 px-1.5 text-xs'>
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='flex w-full flex-col gap-0 p-0 sm:max-w-md'
      >
        <SheetHeader className='border-b'>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Refine the catalog by release year, rating, providers, and more.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className='min-h-0 flex-1'>
          <div className='space-y-6 p-4'>
            {/* Year Range */}
            <Section title='Release Year'>
              <div className='grid grid-cols-2 gap-3'>
                <div className='space-y-1.5'>
                  <Label className='text-muted-foreground text-xs'>From</Label>
                  <Select
                    value={filters.yearFrom?.toString() || NONE}
                    onValueChange={(v) =>
                      update({ yearFrom: v === NONE ? null : v })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Any</SelectItem>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <Label className='text-muted-foreground text-xs'>To</Label>
                  <Select
                    value={filters.yearTo?.toString() || NONE}
                    onValueChange={(v) =>
                      update({ yearTo: v === NONE ? null : v })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Any</SelectItem>
                      {YEARS.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Section>

            <Separator />

            {/* Rating Range */}
            <Section title={`Rating: ${ratingMin} – ${ratingMax}`}>
              <Slider
                min={0}
                max={10}
                step={0.5}
                value={[ratingMin, ratingMax]}
                onValueChange={([lo, hi]) =>
                  update({
                    ratingMin: lo === 0 ? null : lo,
                    ratingMax: hi === 10 ? null : hi,
                  })
                }
              />
            </Section>

            <Separator />

            {/* Min Vote Count */}
            <Section title={`Min Votes: ${votesMin}`}>
              <Slider
                min={0}
                max={10000}
                step={50}
                value={[votesMin]}
                onValueChange={([v]) => update({ votesMin: v === 0 ? null : v })}
              />
            </Section>

            <Separator />

            {/* Runtime Range */}
            <Section title={`Runtime: ${runtimeMin} – ${runtimeMax} min`}>
              <Slider
                min={0}
                max={300}
                step={5}
                value={[runtimeMin, runtimeMax]}
                onValueChange={([lo, hi]) =>
                  update({
                    runtimeMin: lo === 0 ? null : lo,
                    runtimeMax: hi === 300 ? null : hi,
                  })
                }
              />
            </Section>

            <Separator />

            {/* Without Genres */}
            <Section title='Exclude Genres'>
              {genres.length === 0 ? (
                <p className='text-muted-foreground text-xs'>Loading…</p>
              ) : (
                <CheckboxList
                  options={genres}
                  values={filters.withoutGenres}
                  getKey={(g) => g.id}
                  getLabel={(g) => g.name}
                  onChange={(v) => update({ notGenres: v })}
                />
              )}
            </Section>

            <Separator />

            {/* Where to Watch */}
            <Section title='Where to Watch'>
              <div className='space-y-1.5'>
                <Label className='text-muted-foreground text-xs'>Region</Label>
                <Select
                  value={filters.watchRegion || NONE}
                  onValueChange={(v) =>
                    update({ region: v === NONE ? null : v })
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Any' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NONE}>Any</SelectItem>
                    {countries.map((c) => (
                      <SelectItem key={c.iso_3166_1} value={c.iso_3166_1}>
                        {c.english_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-1.5'>
                <Label className='text-muted-foreground text-xs'>
                  Monetization
                </Label>
                <CheckboxList
                  options={MONETIZATION_TYPES}
                  values={filters.watchMonetizationTypes}
                  getKey={(o) => o.value}
                  getLabel={(o) => o.label}
                  onChange={(v) => update({ monetization: v })}
                />
              </div>

              <div className='space-y-1.5'>
                <Label className='text-muted-foreground text-xs'>
                  Providers (in {filters.watchRegion || 'US'})
                </Label>
                {providers.length === 0 ? (
                  <p className='text-muted-foreground text-xs'>
                    No providers loaded yet.
                  </p>
                ) : (
                  <div className='max-h-56 overflow-y-auto pr-1'>
                    <CheckboxList
                      options={providers.slice(0, 40)}
                      values={filters.watchProviders}
                      getKey={(p) => p.provider_id}
                      getLabel={(p) => p.provider_name}
                      onChange={(v) => update({ providers: v })}
                    />
                  </div>
                )}
              </div>
            </Section>

            <Separator />

            {/* Origin Country */}
            <Section title='Origin Country'>
              <Select
                value={filters.originCountry || NONE}
                onValueChange={(v) =>
                  update({ originCountry: v === NONE ? null : v })
                }
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Any' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Any</SelectItem>
                  {countries.map((c) => (
                    <SelectItem key={c.iso_3166_1} value={c.iso_3166_1}>
                      {c.english_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Section>

            <Separator />

            {/* Movie-only filters */}
            {mediaType === 'movie' && (
              <>
                <Section title='Release Type'>
                  <CheckboxList
                    options={RELEASE_TYPES}
                    values={filters.releaseTypes}
                    getKey={(o) => o.value}
                    getLabel={(o) => o.label}
                    onChange={(v) => update({ releaseTypes: v })}
                  />
                </Section>

                <Separator />

                <Section title='Certification (US)'>
                  <Select
                    value={filters.certification || NONE}
                    onValueChange={(v) =>
                      update({ cert: v === NONE ? null : v })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Any</SelectItem>
                      {MOVIE_CERTIFICATIONS_US.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Section>

                <Separator />

                <Section title='Adult Content'>
                  <label className='flex items-center justify-between gap-3 text-sm'>
                    <span>Include adult titles</span>
                    <Switch
                      checked={filters.includeAdult}
                      onCheckedChange={(c) => update({ adult: c })}
                    />
                  </label>
                </Section>
              </>
            )}

            {/* TV-only filters */}
            {mediaType === 'tv' && (
              <>
                <Section title='Networks'>
                  <CheckboxList
                    options={POPULAR_NETWORKS}
                    values={filters.networks}
                    getKey={(n) => n.id}
                    getLabel={(n) => n.name}
                    onChange={(v) => update({ networks: v })}
                  />
                </Section>

                <Separator />

                <Section title='Status'>
                  <Select
                    value={filters.tvStatus?.toString() || NONE}
                    onValueChange={(v) =>
                      update({ tvStatus: v === NONE ? null : v })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Any</SelectItem>
                      {TV_STATUS.map((s) => (
                        <SelectItem key={s.value} value={s.value.toString()}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Section>

                <Separator />

                <Section title='Type'>
                  <Select
                    value={filters.tvType?.toString() || NONE}
                    onValueChange={(v) =>
                      update({ tvType: v === NONE ? null : v })
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='Any' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Any</SelectItem>
                      {TV_TYPE.map((t) => (
                        <SelectItem key={t.value} value={t.value.toString()}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Section>

                <Separator />

                <Section title='Air Dates'>
                  <label className='flex items-center justify-between gap-3 text-sm'>
                    <span>Include shows without air dates</span>
                    <Switch
                      checked={filters.includeNullFirstAirDates}
                      onCheckedChange={(c) => update({ includeNullDates: c })}
                    />
                  </label>
                </Section>
              </>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className='border-t flex-row gap-2'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={reset}
            disabled={activeCount === 0}
          >
            Reset all
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
