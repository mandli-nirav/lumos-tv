import axios from 'axios';

const API_BASE_URL = 'https://iptv-org.github.io/api';

export const getChannels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/channels.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    return [];
  }
};

export const getStreams = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/streams.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching streams:', error);
    return [];
  }
};

export const getLogos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/logos.json`);
    return response.data;
  } catch (error) {
    console.error('Error fetching logos:', error);
    return [];
  }
};

export const getLiveTVData = async () => {
  try {
    const [channels, streams, logos] = await Promise.all([
      getChannels(),
      getStreams(),
      getLogos(),
    ]);

    // Map data for easier consumption
    const logosMap = logos.reduce((acc, logo) => {
      acc[logo.channel] = logo.url;
      return acc;
    }, {});

    const streamsMap = streams.reduce((acc, stream) => {
      // Prioritize online streams
      if (stream.status !== 'online' && stream.status !== undefined) return acc;

      if (!acc[stream.channel]) {
        acc[stream.channel] = [];
      }
      acc[stream.channel].push({
        url: stream.url,
        status: stream.status,
        width: stream.width,
        height: stream.height,
        bitrate: stream.bitrate,
        user_agent: stream.user_agent,
      });
      return acc;
    }, {});

    return channels
      .filter((channel) => streamsMap[channel.id])
      .map((channel) => ({
        ...channel,
        logo: logosMap[channel.id] || channel.logo,
        streams: streamsMap[channel.id],
      }));
  } catch (error) {
    console.error('Error fetching Live TV data:', error);
    return [];
  }
};
