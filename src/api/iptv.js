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

const HINDI_M3U_URL = 'https://iptv-org.github.io/iptv/languages/hin.m3u';

export const getLiveTVData = async () => {
  try {
    const response = await axios.get(HINDI_M3U_URL);
    const m3uData = response.data;
    console.log('Raw M3U Data Received:', m3uData.substring(0, 500) + '...');

    const channels = [];
    const lines = m3uData.split('\n');
    let currentChannel = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('#EXTINF:')) {
        // Parse metadata from #EXTINF line
        const idMatch = line.match(/tvg-id="([^"]+)"/);
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        const groupMatch = line.match(/group-title="([^"]+)"/);
        const nameMatch = line.match(/,(.+)$/);

        // Extract headers if present in EXTINF
        const referrerMatch = line.match(/http-referrer="([^"]+)"/);
        const uaMatch = line.match(/http-user-agent="([^"]+)"/);

        const name = nameMatch ? nameMatch[1].trim() : 'Unknown Channel';
        const rawCategories = groupMatch ? [groupMatch[1]] : ['General'];

        // Add network categories based on name
        const lowerName = name.toLowerCase();
        if (lowerName.includes('sony')) {
          if (!rawCategories.includes('Sony')) rawCategories.push('Sony');
        }
        if (lowerName.includes('star')) {
          if (!rawCategories.includes('Star')) rawCategories.push('Star');
        }
        if (lowerName.includes('zee')) {
          if (!rawCategories.includes('Zee')) rawCategories.push('Zee');
        }
        if (lowerName.includes('colors') || lowerName.includes('colors')) {
          if (!rawCategories.includes('Colors')) rawCategories.push('Colors');
        }
        if (lowerName.includes('aaj tak')) {
          if (!rawCategories.includes('Aaj Tak')) rawCategories.push('Aaj Tak');
        }
        if (lowerName.includes('news18')) {
          if (!rawCategories.includes('News18')) rawCategories.push('News18');
        }
        if (lowerName.includes('ndtv')) {
          if (!rawCategories.includes('NDTV')) rawCategories.push('NDTV');
        }
        if (lowerName.includes('republic')) {
          if (!rawCategories.includes('Republic'))
            rawCategories.push('Republic');
        }
        if (lowerName.includes('times')) {
          if (!rawCategories.includes('Times')) rawCategories.push('Times');
        }
        if (lowerName.includes('discovery')) {
          if (!rawCategories.includes('Discovery'))
            rawCategories.push('Discovery');
        }
        if (lowerName.includes('sun')) {
          if (!rawCategories.includes('Sun')) rawCategories.push('Sun');
        }
        if (lowerName.includes('mtv')) {
          if (!rawCategories.includes('MTV')) rawCategories.push('MTV');
        }

        currentChannel = {
          id: idMatch ? idMatch[1] : `channel-${i}`,
          name: name,
          logo: logoMatch ? logoMatch[1] : null,
          categories: rawCategories,
          referrer: referrerMatch ? referrerMatch[1] : null,
          user_agent: uaMatch ? uaMatch[1] : null,
          streams: [],
        };
      } else if (line.startsWith('#EXTVLCOPT:')) {
        // Parse VLC options for headers
        if (currentChannel) {
          const refOpt = line.match(/http-referrer=(.+)$/);
          const uaOpt = line.match(/http-user-agent=(.+)$/);
          if (refOpt) currentChannel.referrer = refOpt[1].trim();
          if (uaOpt) currentChannel.user_agent = uaOpt[1].trim();
        }
      } else if (line.startsWith('http')) {
        if (currentChannel) {
          currentChannel.streams.push({
            url: line,
            status: 'online',
            referrer: currentChannel.referrer,
            user_agent: currentChannel.user_agent,
          });
          channels.push(currentChannel);
          currentChannel = null;
        }
      }
    }

    // Inject Test Channel
    channels.unshift({
      id: 'test-sony-sab',
      name: 'TEST Sony SAB (Test Link)',
      logo: 'https://xstreamcp-assets-msp.streamready.in/assets/LIVETV/LIVECHANNEL/LIVETV_LIVETVCHANNEL_SONY_SAB/images/LOGO_HD/image.png',
      categories: ['Sony', 'TEST'],
      streams: [
        {
          url: 'http://103.229.254.25:7001/play/a0db/24354002.m3u8',
          status: 'online',
        },
      ],
    });

    console.log('Parsed Channels List:', channels);
    return channels;
  } catch (error) {
    console.error('Error fetching Hindi Live TV data:', error);
    return [];
  }
};
