import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

const PARAM_KEYS = [
  'genre',
  'notGenres',
  'lang',
  'sort',
  'yearFrom',
  'yearTo',
  'ratingMin',
  'ratingMax',
  'votesMin',
  'runtimeMin',
  'runtimeMax',
  'region',
  'providers',
  'monetization',
  'originCountry',
  'adult',
  'releaseTypes',
  'cert',
  'networks',
  'tvStatus',
  'tvType',
  'includeNullDates',
];

const toCsvNums = (s) =>
  (s?.split(',').filter(Boolean) || []).map((v) => Number(v)).filter((n) => !Number.isNaN(n));
const toCsvStrs = (s) => s?.split(',').filter(Boolean) || [];

export function useDiscoverFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const update = useCallback(
    (patch) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [k, v] of Object.entries(patch)) {
            const empty =
              v === null ||
              v === undefined ||
              v === '' ||
              (Array.isArray(v) && v.length === 0) ||
              v === false;
            if (empty) next.delete(k);
            else if (Array.isArray(v)) next.set(k, v.join(','));
            else if (v === true) next.set(k, '1');
            else next.set(k, String(v));
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const reset = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        PARAM_KEYS.forEach((k) => next.delete(k));
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const filters = useMemo(() => {
    const get = (k) => searchParams.get(k);
    const genre = get('genre') ? parseInt(get('genre'), 10) : null;
    return {
      // raw URL keys (for tab/select binding)
      genre,
      language: get('lang') || null,
      sortBy: get('sort') || 'popularity.desc',
      withoutGenres: toCsvNums(get('notGenres')),
      yearFrom: get('yearFrom') ? parseInt(get('yearFrom'), 10) : null,
      yearTo: get('yearTo') ? parseInt(get('yearTo'), 10) : null,
      voteAverageGte: get('ratingMin') != null && get('ratingMin') !== '' ? parseFloat(get('ratingMin')) : null,
      voteAverageLte: get('ratingMax') != null && get('ratingMax') !== '' ? parseFloat(get('ratingMax')) : null,
      voteCountGte: get('votesMin') != null && get('votesMin') !== '' ? parseInt(get('votesMin'), 10) : null,
      runtimeGte: get('runtimeMin') != null && get('runtimeMin') !== '' ? parseInt(get('runtimeMin'), 10) : null,
      runtimeLte: get('runtimeMax') != null && get('runtimeMax') !== '' ? parseInt(get('runtimeMax'), 10) : null,
      watchRegion: get('region') || null,
      watchProviders: toCsvNums(get('providers')),
      watchMonetizationTypes: toCsvStrs(get('monetization')),
      includeAdult: get('adult') === '1',
      releaseTypes: toCsvNums(get('releaseTypes')),
      certification: get('cert') || null,
      certificationCountry: get('region') || 'US',
      networks: toCsvNums(get('networks')),
      tvStatus: get('tvStatus') != null && get('tvStatus') !== '' ? parseInt(get('tvStatus'), 10) : null,
      tvType: get('tvType') != null && get('tvType') !== '' ? parseInt(get('tvType'), 10) : null,
      originCountry: get('originCountry') || null,
      includeNullFirstAirDates: get('includeNullDates') === '1',
      // derived: combine single genre into array for the discover query
      get genres() {
        return genre ? [genre] : [];
      },
    };
  }, [searchParams]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.genre) n++;
    if (filters.language) n++;
    if (filters.sortBy && filters.sortBy !== 'popularity.desc') n++;
    if (filters.withoutGenres.length) n++;
    if (filters.yearFrom || filters.yearTo) n++;
    if (filters.voteAverageGte != null || filters.voteAverageLte != null) n++;
    if (filters.voteCountGte != null) n++;
    if (filters.runtimeGte != null || filters.runtimeLte != null) n++;
    if (filters.watchRegion) n++;
    if (filters.watchProviders.length) n++;
    if (filters.watchMonetizationTypes.length) n++;
    if (filters.originCountry) n++;
    if (filters.includeAdult) n++;
    if (filters.releaseTypes.length) n++;
    if (filters.certification) n++;
    if (filters.networks.length) n++;
    if (filters.tvStatus != null) n++;
    if (filters.tvType != null) n++;
    if (filters.includeNullFirstAirDates) n++;
    return n;
  }, [filters]);

  return { filters, update, reset, activeCount };
}
