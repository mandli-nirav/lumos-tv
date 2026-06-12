import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate text on a character budget, appending an ellipsis.
 * Used to fit API-provided copy into meta-description length.
 *
 * @param {string} [text]
 * @param {number} [max=160]
 * @returns {string|undefined}
 */
export function truncate(text, max = 160) {
  if (!text || text.length <= max) return text || undefined;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
