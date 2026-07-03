/**
 * Rich-text parsing for a feather's body. A pure display layer over the stored
 * `text: string` — it never mutates or augments how a post is stored. Entities
 * (#hashtags, @mentions, links) are *derived* on the fly.
 *
 * ── Anchor for the future Mind ──
 * `extractHashtags` / `extractMentions` expose a feather's connective tissue as
 * plain data, so a later graph builder can walk post ↔ tag ↔ post and
 * post ↔ mention ↔ user edges without touching the store or this module.
 */

import { sanitizeUrl } from '@/lib/sanitizeUrl';

export type RichToken =
  | { type: 'text'; value: string }
  | { type: 'hashtag'; value: string; tag: string }
  | { type: 'mention'; value: string; username: string }
  | { type: 'url'; value: string; href: string };

/**
 * Entity scanner. Ordered so a URL wins over any '@'/'#' it may contain.
 *
 * Rules (deliberately strict, to avoid false positives):
 *  - hashtag: `#` + Unicode letters/digits/underscore, requiring ≥1 letter
 *    (so `#123` is not a tag; `#крипта` and `#web3` are). Cyrillic + Latin.
 *  - mention: `@` + a username per the registration rules (ASCII letter, then
 *    letters/digits/underscore).
 *  - `@`/`#` only start an entity at a boundary (not preceded by a letter,
 *    digit or underscore) — this rejects emails (`a@b`) and `word#tag`.
 *  - url: http/https, validated/normalized by the shared `sanitizeUrl`.
 */
const ENTITY_RE =
  /(https?:\/\/[^\s]+)|(?<![\p{L}\p{N}_])@([A-Za-z][A-Za-z0-9_]*)|(?<![\p{L}\p{N}_])#([\p{L}\p{N}_]*\p{L}[\p{L}\p{N}_]*)/gu;

/** Trailing punctuation that should fall outside a matched URL. */
const URL_TRAILING = /[.,!?;:)\]}'"»]+$/u;

export function parseRichText(text: string): RichToken[] {
  const tokens: RichToken[] = [];
  if (!text) return tokens;

  let last = 0;
  ENTITY_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = ENTITY_RE.exec(text)) !== null) {
    const [full, urlMatch, mentionName, hashtagName] = match;
    const start = match.index;

    if (urlMatch !== undefined) {
      // Drop trailing punctuation, then confirm it's a safe, real http(s) URL.
      const trimmed = full.replace(URL_TRAILING, '');
      const result = sanitizeUrl(trimmed);
      if (!result.ok) {
        // Not a usable URL — leave it in the surrounding text run.
        ENTITY_RE.lastIndex = start + full.length;
        continue;
      }
      if (start > last) tokens.push({ type: 'text', value: text.slice(last, start) });
      tokens.push({ type: 'url', value: trimmed, href: result.value.safeUrl });
      last = start + trimmed.length;
      ENTITY_RE.lastIndex = last; // re-scan any stripped suffix as text
      continue;
    }

    if (start > last) tokens.push({ type: 'text', value: text.slice(last, start) });

    if (mentionName !== undefined) {
      tokens.push({ type: 'mention', value: full, username: mentionName.toLowerCase() });
    } else if (hashtagName !== undefined) {
      tokens.push({ type: 'hashtag', value: full, tag: hashtagName.toLowerCase() });
    }
    last = start + full.length;
  }

  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

/** Unique, lowercased hashtags in a feather. Raw material for the Mind graph. */
export function extractHashtags(text: string): string[] {
  const seen = new Set<string>();
  for (const token of parseRichText(text)) {
    if (token.type === 'hashtag') seen.add(token.tag);
  }
  return [...seen];
}

/** Unique, lowercased mentioned usernames in a feather. */
export function extractMentions(text: string): string[] {
  const seen = new Set<string>();
  for (const token of parseRichText(text)) {
    if (token.type === 'mention') seen.add(token.username);
  }
  return [...seen];
}

/** An in-progress `@mention` at the caret, for composer autocomplete. */
export interface MentionQuery {
  /** Text typed after the `@`, up to the caret (may be empty). */
  query: string;
  /** Index of the `@` in the source string. */
  start: number;
}

/**
 * Detect whether the caret sits inside an `@mention` being typed. Returns the
 * partial query and the `@` position, or null. Pure — no DOM access.
 */
export function findMentionQuery(text: string, caret: number): MentionQuery | null {
  let i = caret - 1;
  while (i >= 0) {
    const ch = text[i]!;
    if (ch === '@') {
      const before = i > 0 ? text[i - 1]! : '';
      if (before === '' || /\s/u.test(before)) {
        const query = text.slice(i + 1, caret);
        if (/^[A-Za-z0-9_]*$/.test(query)) return { query, start: i };
      }
      return null;
    }
    if (!/[A-Za-z0-9_]/.test(ch)) return null;
    i -= 1;
  }
  return null;
}
