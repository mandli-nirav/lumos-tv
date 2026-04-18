import axios from 'axios';

const API_BASE_URL = 'https://iptv-org.github.io/api';

/**
 * Fetch data from IPTV API.
 * Caching is handled by TanStack Query hooks — do NOT add client-side caching here.
 * @param {string} endpoint - API endpoint path
 * @returns {Promise<Array>}
 */
const fetchIptvData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    console.error(`IPTV API error (${endpoint}):`, error.message);
    throw error;
  }
};

export const getChannels = () => fetchIptvData('channels.json');
export const getStreams = () => fetchIptvData('streams.json');
export const getLogos = () => fetchIptvData('logos.json');
export const getFeeds = () => fetchIptvData('feeds.json');
export const getCategories = () => fetchIptvData('categories.json');

/**
 * Fetches and merges channel data with stream URLs, logos, and feed languages.
 * @param {Object} filters - Filter criteria { category, language, country }
 *   language should be an ISO 639-3 code like 'hin', 'eng', 'spa', etc.
 */
export const getDetailedChannels = async (filters = {}) => {
  const results = await Promise.allSettled([
    getChannels(),
    getStreams(),
    getLogos(),
    getFeeds(),
  ]);

  const channels = results[0].status === 'fulfilled' ? results[0].value : [];
  const streams = results[1].status === 'fulfilled' ? results[1].value : [];
  const logos = results[2].status === 'fulfilled' ? results[2].value : [];
  const feeds = results[3].status === 'fulfilled' ? results[3].value : [];

  if (channels.length === 0 || streams.length === 0) {
    throw new Error('Failed to load channel data');
  }

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
export const getLiveTVData = () => getDetailedChannels({ language: 'hin' });
