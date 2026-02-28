import { useQuery } from '@tanstack/react-query';

import { getDetailedChannels, getLiveTVData } from '@/api/iptv';

// Fetch popular languages (hardcoded list for fast load + clean UX)
const LANGUAGES = [
  { code: 'hin', name: 'Hindi' },
  { code: 'eng', name: 'English' },
  { code: 'tam', name: 'Tamil' },
  { code: 'tel', name: 'Telugu' },
  { code: 'kan', name: 'Kannada' },
  { code: 'mar', name: 'Marathi' },
  { code: 'ben', name: 'Bengali' },
  { code: 'mal', name: 'Malayalam' },
  { code: 'guj', name: 'Gujarati' },
  { code: 'pan', name: 'Punjabi' },
  { code: 'urd', name: 'Urdu' },
  { code: 'spa', name: 'Spanish' },
  { code: 'fra', name: 'French' },
  { code: 'por', name: 'Portuguese' },
  { code: 'ara', name: 'Arabic' },
  { code: 'rus', name: 'Russian' },
  { code: 'deu', name: 'German' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'zho', name: 'Chinese' },
  { code: 'ita', name: 'Italian' },
  { code: 'tur', name: 'Turkish' },
  { code: 'tha', name: 'Thai' },
  { code: 'ind', name: 'Indonesian' },
  { code: 'vie', name: 'Vietnamese' },
];

export function useLiveTV() {
  return useQuery({
    queryKey: ['live-tv'],
    queryFn: getLiveTVData,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useDetailedLiveTV(filters = {}) {
  return useQuery({
    queryKey: ['live-tv-detailed', filters],
    queryFn: () => getDetailedChannels(filters),
    staleTime: 1000 * 60 * 30,
  });
}

export function useLiveTVCategories(channels = []) {
  const categories = new Set();
  channels.forEach((channel) => {
    if (channel.categories && Array.isArray(channel.categories)) {
      channel.categories.forEach((cat) => {
        const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
        categories.add(formattedCat);
      });
    }
  });
  return ['All', ...Array.from(categories)].sort();
}

export function useLanguages() {
  return LANGUAGES;
}
