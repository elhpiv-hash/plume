/**
 * Profanity word stems for the front-end guard, split by language.
 *
 * These are deliberately short stem lists — a first, easily-bypassed barrier
 * meant to catch the obvious cases in usernames, names, posts and school. Real
 * moderation (context-aware ML, e.g. Perspective API) is a backend concern and
 * is intentionally NOT attempted here.
 *
 * Matching (see lib/profanity.ts): input is lowercased, leet is expanded, and
 * Cyrillic is transliterated to Latin, so a single normalized pipeline covers
 * both scripts. Stems are therefore stored already in that normalized Latin
 * form and are matched at a word-start boundary (a token may carry inflection
 * suffixes, but a stem never triggers mid-word — so "class" or "Scunthorpe"
 * stay clean).
 */

/** Russian stems, transliterated to Latin per lib/profanity's CYRILLIC_MAP. */
export const PROFANITY_RU: readonly string[] = [
  'hui',
  'huya',
  'hue',
  'pizd',
  'ebat',
  'eban',
  'ebl',
  'ebn',
  'zaeb',
  'vyeb',
  'blyad',
  'blyat',
  'blya',
  'suka',
  'mudak',
  'pidor',
  'pidar',
  'pidr',
  'gandon',
  'gondon',
  'zalup',
  'manda',
  'mraz',
  'debil',
];

/** English stems. */
export const PROFANITY_EN: readonly string[] = [
  'fuck',
  'motherfuck',
  'shit',
  'bitch',
  'asshole',
  'bastard',
  'cunt',
  'dick',
  'pussy',
  'slut',
  'whore',
  'faggot',
  'nigger',
  'wank',
];

/** Combined stem list used by the matcher. */
export const PROFANITY_STEMS: readonly string[] = [...PROFANITY_RU, ...PROFANITY_EN];
