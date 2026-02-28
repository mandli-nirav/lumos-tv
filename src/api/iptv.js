import axios from 'axios';

const API_BASE_URL = 'https://iptv-org.github.io/api';

/**
 * Cache for API responses to avoid redundant network requests
 */
const cache = {
  channels: null,
  streams: null,
  logos: null,
  feeds: null,
  categories: null,
};

const fetchAndCache = async (key, endpoint) => {
  if (cache[key]) return cache[key];
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
    cache[key] = response.data;
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${key}:`, error);
    return [];
  }
};

export const getChannels = () => fetchAndCache('channels', 'channels.json');
export const getStreams = () => fetchAndCache('streams', 'streams.json');
export const getLogos = () => fetchAndCache('logos', 'logos.json');
export const getFeeds = () => fetchAndCache('feeds', 'feeds.json');
export const getCategories = () =>
  fetchAndCache('categories', 'categories.json');

/**
 * Fetches and merges channel data with stream URLs, logos, and feed languages.
 * @param {Object} filters - Filter criteria { category, language, country }
 *   language should be an ISO 639-3 code like 'hin', 'eng', 'spa', etc.
 */
export const getDetailedChannels = async (filters = {}) => {
  const [channels, streams, logos, feeds] = await Promise.all([
    getChannels(),
    getStreams(),
    getLogos(),
    getFeeds(),
  ]);

  // Stream lookup: channel ID → array of stream objects
  const streamMap = streams.reduce((acc, stream) => {
    if (!acc[stream.channel]) acc[stream.channel] = [];
    acc[stream.channel].push(stream);
    return acc;
  }, {});

  // Logo lookup: channel ID → first logo URL
  const logoMap = logos.reduce((acc, logo) => {
    if (!acc[logo.channel]) acc[logo.channel] = logo.url;
    return acc;
  }, {});

  // Feed language lookup: channel ID → Set of language codes (from feeds.json)
  const langMap = feeds.reduce((acc, feed) => {
    if (!acc[feed.channel]) acc[feed.channel] = new Set();
    if (feed.languages) {
      feed.languages.forEach((lang) => acc[feed.channel].add(lang));
    }
    return acc;
  }, {});

  let detailedChannels = channels
    .filter((channel) => streamMap[channel.id]) // Only channels with streams
    .map((channel) => ({
      ...channel,
      logo: logoMap[channel.id] || null,
      streams: streamMap[channel.id],
      languages: langMap[channel.id] ? [...langMap[channel.id]] : [],
    }));

  // Apply filters
  if (filters.category && filters.category !== 'All') {
    detailedChannels = detailedChannels.filter((c) =>
      c.categories?.some(
        (cat) => cat.toLowerCase() === filters.category.toLowerCase()
      )
    );
  }

  if (filters.language) {
    const langCode = filters.language.toLowerCase();
    detailedChannels = detailedChannels.filter((c) =>
      c.languages?.some((l) => l.toLowerCase() === langCode)
    );
  }

  if (filters.country) {
    detailedChannels = detailedChannels.filter(
      (c) => c.country?.toLowerCase() === filters.country.toLowerCase()
    );
  }

  return detailedChannels;
};

/**
 * Fetches Hindi live TV channels with streams
 */
export const getLiveTVData = async () => {
  try {
    const channels = await getDetailedChannels({ language: 'hin' });
    return channels;
  } catch (error) {
    console.error('Error fetching Live TV data:', error);
    return [];
  }
};
