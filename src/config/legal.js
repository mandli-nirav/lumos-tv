import { SITE } from './site';

/**
 * Legal / contact configuration.
 *
 * Centralizes the values that appear across the Privacy, Terms, DMCA,
 * Disclaimer and Contact pages so they can be changed in one place.
 *
 * IMPORTANT: The copy on those pages is a good-faith template, NOT legal
 * advice. Replace the placeholder email addresses below with real, monitored
 * inboxes and have the final text reviewed by a qualified attorney before
 * relying on it (especially the DMCA designated-agent details).
 *
 * @typedef {Object} LegalConfig
 * @property {string} entity - Public-facing owner/operator name used in the documents.
 * @property {string} effectiveDate - ISO date the documents took effect.
 * @property {string} effectiveDateLabel - Human-readable form of effectiveDate.
 * @property {string} contactEmail - General contact inbox.
 * @property {string} dmcaEmail - Copyright / DMCA notices inbox (designated agent).
 * @property {string} jurisdiction - Governing-law jurisdiction for the Terms.
 */

/** @type {LegalConfig} */
export const LEGAL = {
  entity: SITE.name,
  effectiveDate: '2026-06-16',
  effectiveDateLabel: 'June 16, 2026',
  contactEmail: 'contact@lumos-tv.in',
  dmcaEmail: 'dmca@lumos-tv.in',
  jurisdiction: 'India',
};
