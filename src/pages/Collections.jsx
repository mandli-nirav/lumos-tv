import { Search, SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

import { CollectionCard } from '@/components/collections/CollectionCard';
import { SEO } from '@/components/seo/SEO';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { ScrollFade } from '@/components/ui/scroll-fade';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchCollections } from '@/hooks/useMedia';

const QUICK_PICKS = [
  'Star Wars',
  'Marvel',
  'DC Comics',
  'Harry Potter',
  'Fast & Furious',
  'X-Men',
];

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Start empty: the page lands on a "search or pick a franchise" prompt
  // rather than a pre-filled query. A `?q=` in the URL still seeds the search.
  const initialQuery = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q && q !== activeQuery) {
      setActiveQuery(q);
      setInputValue(q);
    }
  }, [activeQuery, searchParams]);

  const collectionsQuery = useSearchCollections(activeQuery, {
    keepPreviousData: true,
  });

  const collections = collectionsQuery.data?.results || [];

  const submitSearch = (event) => {
    event.preventDefault();
    const next = inputValue.trim();
    setActiveQuery(next);
    // Empty submit returns to the prompt state and drops the URL param.
    setSearchParams(next ? { q: next } : {}, { replace: true });
  };

  const selectQuickPick = (pick) => {
    setInputValue(pick);
    setActiveQuery(pick);
    setSearchParams({ q: pick }, { replace: true });
  };

  const seo = (
    <SEO
      title='Movie Collections'
      description='Search and browse movie collections, franchises, and universes like Star Wars, Marvel, DC, Harry Potter, Fast & Furious, and X-Men.'
      url='/collections'
    />
  );

  return (
    <div className='bg-background min-h-screen pt-24 pb-12'>
      {seo}
      <div className='container mx-auto space-y-8'>
        <header className='space-y-4'>
          <div className='space-y-2'>
            <Badge variant='secondary' className='bg-primary/15 text-primary'>
              Movie Collections
            </Badge>
            <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>
              Browse movie collections
            </h1>
            <p className='text-muted-foreground max-w-2xl text-sm leading-7 sm:text-base'>
              Find franchises and grouped films like Star Wars, Marvel, DC,
              Harry Potter, Fast & Furious, and more.
            </p>
          </div>

          <Card>
            <CardContent className='p-4 sm:p-5'>
              <form onSubmit={submitSearch}>
                <Field>
                  <FieldLabel htmlFor='collection-search' className='sr-only'>
                    Search movie collections
                  </FieldLabel>
                  <InputGroup className='h-11'>
                    <InputGroupInput
                      id='collection-search'
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder='Search collections like Marvel, Star Wars, X-Men...'
                    />
                    <InputGroupAddon align='inline-end'>
                      <InputGroupButton
                        type='submit'
                        size='icon-sm'
                        variant='default'
                        aria-label='Search'
                      >
                        <Search />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              </form>

              {/* Quick-pick franchises — same Tabs pattern as the genre /
                  category rows elsewhere. A free-text search that isn't one of
                  these simply leaves no tab selected. */}
              <Tabs
                value={activeQuery}
                onValueChange={selectQuickPick}
                className='mt-4 w-full'
              >
                <ScrollFade>
                  <TabsList>
                    {QUICK_PICKS.map((pick) => (
                      <TabsTrigger key={pick} value={pick}>
                        {pick}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </ScrollFade>
              </Tabs>
            </CardContent>
          </Card>
        </header>

        <section className='space-y-4'>
          {!activeQuery ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant='icon'>
                  <Search />
                </EmptyMedia>
                <EmptyTitle>Search for a collection</EmptyTitle>
                <EmptyDescription>
                  Enter a franchise name above — like Marvel or Star Wars — or
                  pick one of the suggestions to get started.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <div className='flex items-end justify-between gap-4'>
                <div>
                  <h2 className='text-foreground text-xl font-bold'>
                    Results for “{activeQuery}”
                  </h2>
                  <p className='text-muted-foreground text-sm'>
                    TMDB collection search results
                  </p>
                </div>
              </div>

              {collectionsQuery.isLoading ? (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card
                      key={i}
                      className='bg-card/30 border-border/40 overflow-hidden p-0'
                    >
                      <CardContent className='p-0'>
                        <Skeleton className='aspect-2/3 w-full rounded-none' />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : collections.length > 0 ? (
                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                  {collections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                    />
                  ))}
                </div>
              ) : (
                <Empty className='border-border/50 bg-card/30 min-h-72 rounded-2xl border border-solid'>
                  <EmptyHeader>
                    <EmptyMedia variant='icon'>
                      <SearchX />
                    </EmptyMedia>
                    <EmptyTitle>No collections found</EmptyTitle>
                    <EmptyDescription>
                      Try a different franchise name, or pick one of the quick
                      suggestions above.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
