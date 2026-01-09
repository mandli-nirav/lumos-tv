import axios from 'axios';

const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN}`,
  },
});

// Helper for image URLs
export const getImageUrl = (path, size = 'original', type = 'poster') => {
  if (!path) {
    const dimensions =
      type === 'poster'
        ? '500x750'
        : type === 'profile'
          ? '185x278'
          : '1280x720';
    return `https://placehold.co/${dimensions}/1a1a1a/ffffff?text=No+${
      type === 'poster' ? 'Poster' : type === 'profile' ? 'Avatar' : 'Image'
    }`;
  }
  const baseUrl =
    import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/';
  return `${baseUrl}${size}${path}`;
};

export default tmdb;
