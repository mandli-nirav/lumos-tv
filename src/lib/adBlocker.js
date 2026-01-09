/**
 * AdBlocker Utility
 * Contains common ad domain patterns and detection logic
 */

export const AD_DOMAINS = [
  'doubleclick.net',
  'googleadservices.com',
  'googlesyndication.com',
  'moatads.com',
  'taboola.com',
  'outbrain.com',
  'adroll.com',
  'adnxs.com',
  'popads.net',
  'popcash.net',
  'propellerads.com',
  'onclickads.net',
  'exoclick.com',
  'juicyads.com',
  'ero-advertising.com',
  'bet365.com',
  '1xbet.com',
  'vulkan.com',
  'fastads.io',
  'ad-score.com',
  'leadbolt.com',
  'applovin.com',
  'unityads.com',
  'ironsrc.com',
];

export const AD_SELECTORS = [
  '[id*="google_ads_"]',
  '[class*="ad-container"]',
  '[class*="ad-wrapper"]',
  '[class*="advertisement"]',
  '[id*="ad-"]',
  '.overlay-ad',
  '.popup-ad',
  '#pop-ad',
  '.fixed-ad',
  '.floating-ad',
  'iframe[src*="ads"]',
  'iframe[src*="pop"]',
  'div[class*="pop-under"]',
  'div[id*="pop-under"]',
];

/**
 * Checks if a URL potentially belongs to an ad network
 * @param {string} url - The URL to check
 * @returns {boolean} - True if it's likely an ad
 */
export const isAdUrl = (url) => {
  if (!url) return false;
  return AD_DOMAINS.some((domain) => url.includes(domain));
};

/**
 * Detects if an ad blocker is already present in the browser
 * @returns {Promise<boolean>}
 */
export const detectAdBlocker = async () => {
  try {
    const url = 'https://www.google-analytics.com/analytics.js';
    const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
    return false; // If fetch succeeds, ad blocker might be disabled (or allowing GA)
  } catch (error) {
    return true; // If fetch fails, ad blocker is likely active
  }
};
