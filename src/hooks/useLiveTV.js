import { useQuery } from '@tanstack/react-query';

import { getLiveTVData } from '@/api/iptv';

export function useLiveTV() {
  return useQuery({
    queryKey: ['live-tv'],
    queryFn: getLiveTVData,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useLiveTVCategories(channels = []) {
  const categories = new Set();
  channels.forEach((channel) => {
    if (channel.categories && Array.isArray(channel.categories)) {
      channel.categories.forEach((cat) => categories.add(cat));
    }
  });
  return ['All', ...Array.from(categories)].sort();
}
