import axios from 'axios';

const API_BASE_URL = 'https://iptv-org.github.io/api';

const iptvClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

const fetchEndpoint = (endpoint) =>
  iptvClient.get(`/${endpoint}`).then((r) => r.data);

let cachedBaseData = null;

/**
 * Fetch and merge the core IPTV datasets (channels, streams, feeds, logos).
 * Cached in memory so switching language/category doesn't re-download ~27 MB.
 */
const getBaseData = async () => {
  if (cachedBaseData) return cachedBaseData;

  const [channelsRes, streamsRes, feedsRes, logosRes] =
    await Promise.allSettled([
      fetchEndpoint('channels.json'),
      fetchEndpoint('streams.json'),
      fetchEndpoint('feeds.json'),
      fetchEndpoint('logos.json'),
    ]);

  const channels =
    channelsRes.status === 'fulfilled' ? channelsRes.value : [];
  const streams = streamsRes.status === 'fulfilled' ? streamsRes.value : [];
  const feeds = feedsRes.status === 'fulfilled' ? feedsRes.value : [];
  const logos = logosRes.status === 'fulfilled' ? logosRes.value : [];

  if (channels.length === 0 || streams.length === 0) {
    throw new Error('Failed to load channel data from IPTV API');
  }

  const streamMap = new Map();
  for (const s of streams) {
    if (!s.channel) continue;
    if (!streamMap.has(s.channel)) streamMap.set(s.channel, []);
    streamMap.get(s.channel).push(s);
  }

  const logoMap = new Map();
  for (const l of logos) {
    if (l.channel && !logoMap.has(l.channel)) logoMap.set(l.channel, l.url);
  }

  const langMap = new Map();
  for (const f of feeds) {
    if (!f.channel || !f.languages) continue;
    if (!langMap.has(f.channel)) langMap.set(f.channel, new Set());
    for (const lang of f.languages) langMap.get(f.channel).add(lang);
  }

  const merged = [];
  for (const ch of channels) {
    const chStreams = streamMap.get(ch.id);
    if (!chStreams) continue;
    merged.push({
      ...ch,
      logo: logoMap.get(ch.id) || null,
      streams: chStreams,
      languages: langMap.has(ch.id) ? [...langMap.get(ch.id)] : [],
    });
  }

  cachedBaseData = merged;
  return merged;
};

/**
 * Get channels filtered by language, category, or country.
 * Base data is fetched once and reused across filter changes.
 */
export const getDetailedChannels = async (filters = {}) => {
  let channels = await getBaseData();

  if (filters.category && filters.category !== 'All') {
    const cat = filters.category.toLowerCase();
    channels = channels.filter((c) =>
      c.categories?.some((cc) => cc.toLowerCase() === cat)
    );
  }

  if (filters.language) {
    const lang = filters.language.toLowerCase();
    channels = channels.filter((c) =>
      c.languages?.some((l) => l.toLowerCase() === lang)
    );
  }

  if (filters.country) {
    const country = filters.country.toLowerCase();
    channels = channels.filter((c) => c.country?.toLowerCase() === country);
  }

  return channels;
};
