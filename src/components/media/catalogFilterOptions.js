export const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity (High → Low)' },
  { value: 'popularity.asc', label: 'Popularity (Low → High)' },
  { value: 'vote_average.desc', label: 'Rating (High → Low)' },
  { value: 'vote_average.asc', label: 'Rating (Low → High)' },
  { value: 'vote_count.desc', label: 'Vote Count (High → Low)' },
  { value: 'vote_count.asc', label: 'Vote Count (Low → High)' },
  { value: 'primary_release_date.desc', label: 'Release Date (Newest)', movieOnly: true },
  { value: 'primary_release_date.asc', label: 'Release Date (Oldest)', movieOnly: true },
  { value: 'first_air_date.desc', label: 'First Air Date (Newest)', tvOnly: true },
  { value: 'first_air_date.asc', label: 'First Air Date (Oldest)', tvOnly: true },
  { value: 'revenue.desc', label: 'Revenue (High → Low)', movieOnly: true },
  { value: 'revenue.asc', label: 'Revenue (Low → High)', movieOnly: true },
  { value: 'original_title.asc', label: 'Title (A → Z)', movieOnly: true },
  { value: 'original_title.desc', label: 'Title (Z → A)', movieOnly: true },
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'sv', name: 'Swedish' },
  { code: 'pl', name: 'Polish' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'vi', name: 'Vietnamese' },
];

export const RELEASE_TYPES = [
  { value: 1, label: 'Premiere' },
  { value: 2, label: 'Theatrical (limited)' },
  { value: 3, label: 'Theatrical' },
  { value: 4, label: 'Digital' },
  { value: 5, label: 'Physical' },
  { value: 6, label: 'TV' },
];

export const TV_STATUS = [
  { value: 0, label: 'Returning Series' },
  { value: 1, label: 'Planned' },
  { value: 2, label: 'In Production' },
  { value: 3, label: 'Ended' },
  { value: 4, label: 'Cancelled' },
  { value: 5, label: 'Pilot' },
];

export const TV_TYPE = [
  { value: 0, label: 'Documentary' },
  { value: 1, label: 'News' },
  { value: 2, label: 'Miniseries' },
  { value: 3, label: 'Reality' },
  { value: 4, label: 'Scripted' },
  { value: 5, label: 'Talk Show' },
  { value: 6, label: 'Video' },
];

export const MONETIZATION_TYPES = [
  { value: 'flatrate', label: 'Subscription' },
  { value: 'free', label: 'Free' },
  { value: 'ads', label: 'Ad-Supported' },
  { value: 'rent', label: 'Rent' },
  { value: 'buy', label: 'Buy' },
];

// US movie certifications (most common reference)
export const MOVIE_CERTIFICATIONS_US = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR'];

// Popular TV networks (TMDB IDs)
export const POPULAR_NETWORKS = [
  { id: 213, name: 'Netflix' },
  { id: 49, name: 'HBO' },
  { id: 2552, name: 'Apple TV+' },
  { id: 1024, name: 'Amazon Prime Video' },
  { id: 2739, name: 'Disney+' },
  { id: 453, name: 'Hulu' },
  { id: 4330, name: 'Paramount+' },
  { id: 19, name: 'FOX' },
  { id: 6, name: 'NBC' },
  { id: 16, name: 'CBS' },
  { id: 2, name: 'ABC' },
  { id: 67, name: 'Showtime' },
  { id: 64, name: 'Discovery Channel' },
  { id: 88, name: 'Cinemax' },
  { id: 174, name: 'AMC' },
  { id: 80, name: 'Adult Swim' },
  { id: 318, name: 'Starz' },
  { id: 4, name: 'BBC One' },
  { id: 56, name: 'Cartoon Network' },
  { id: 13, name: 'Nickelodeon' },
];

const currentYear = new Date().getFullYear();
export const YEARS = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);
