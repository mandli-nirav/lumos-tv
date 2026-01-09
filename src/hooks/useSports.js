import { useQuery } from '@tanstack/react-query';

import livesport from '@/api/livesport';

// Get all available sports
export function useSports() {
  return useQuery({
    queryKey: ['sports'],
    queryFn: async () => {
      try {
        const response = await livesport.get('/sports');
        const data = response.data?.data || response.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching sports:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Get live matches (optionally filtered by sport)
export function useLiveMatches(sportId = null) {
  return useQuery({
    queryKey: ['matches', 'live', sportId],
    queryFn: async () => {
      try {
        const endpoint = sportId ? `/matches/${sportId}` : '/matches/live';
        const response = await livesport.get(endpoint);
        const data = response.data?.data || response.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching live matches:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Get popular matches (optionally filtered by sport)
export function usePopularMatches(sportId = null) {
  return useQuery({
    queryKey: ['matches', 'popular', sportId],
    queryFn: async () => {
      try {
        const endpoint = sportId
          ? `/matches/${sportId}/popular`
          : '/matches/popular';
        const response = await livesport.get(endpoint);
        const data = response.data?.data || response.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching popular matches:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get today's matches (optionally filtered by sport)
export function useTodayMatches(sportId = null) {
  return useQuery({
    queryKey: ['matches', 'today', sportId],
    queryFn: async () => {
      try {
        const endpoint = sportId ? `/matches/${sportId}` : '/matches/all-today';
        const response = await livesport.get(endpoint);
        const data = response.data?.data || response.data;
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching today matches:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get match detail with stream sources
export function useMatchDetail(matchId) {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const response = await livesport.get(`/matches/${matchId}/detail`);
      return response.data?.data || response.data;
    },
    enabled: !!matchId,
  });
}
