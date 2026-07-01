/**
 * Front-end profanity guard — a first, deliberately simple barrier.
 *
 * It normalizes input to defeat the most common evasions (case, leet-speak,
 * padded repeats, mixed scripts) and matches known stems at a word-start
 * boundary so inflected forms are caught while innocent substrings are not.
 *
 * This is easily bypassed and NOT a substitute for real moderation: a
 * context-aware ML service (e.g. Perspective API) belongs on the backend and is
 * intentionally out of scope here.
 */

import { PROFANITY_STEMS } from '@/data/profanity';

/** Cyrillic → Latin, matching the transliteration used to author the stems. */
const CYRILLIC_MAP: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh',
  з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
  п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c',
  ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};

/** Common leet substitutions mapped back to letters. */
const LEET_MAP: Record<string, string> = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't',
  '@': 'a', '$': 's', '!': 'i', '|': 'i',
};

/**
 * Normalize text for matching: lowercase, expand leet, transliterate Cyrillic,
 * drop non-letters to spaces, collapse repeated letters and whitespace.
 * Exposed for tests and reuse.
 */
export function normalizeForMatch(text: string): string {
  const lower = text.toLowerCase();
  let out = '';
  for (const ch of lower) {
    if (ch in CYRILLIC_MAP) out += CYRILLIC_MAP[ch];
    else if (ch in LEET_MAP) out += LEET_MAP[ch];
    else if (/[a-z]/.test(ch)) out += ch;
    else out += ' ';
  }
  return out
    .replace(/(.)\1+/g, '$1') // squ_ash padded repeats: "fuuuck" → "fuck"
    .replace(/\s+/g, ' ')
    .trim();
}

// Longest stems first so the alternation prefers the most specific match.
const STEM_PATTERN = [...PROFANITY_STEMS]
  .sort((a, b) => b.length - a.length)
  .map((stem) => stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');

// Word-start boundary + stem: catches inflected forms, ignores mid-word substrings.
const PROFANITY_RE = new RegExp(`\\b(?:${STEM_PATTERN})`, 'i');

/** True when the text contains a known profanity stem after normalization. */
export function containsProfanity(text: string): boolean {
  if (!text) return false;
  return PROFANITY_RE.test(normalizeForMatch(text));
}

/**
 * Replace whole offending words (any token containing a stem) with a mask.
 * Operates on the original words so surrounding text/punctuation is preserved.
 */
export function maskProfanity(text: string, mask = '•••'): string {
  return text.replace(/\S+/g, (word) => (containsProfanity(word) ? mask : word));
}
