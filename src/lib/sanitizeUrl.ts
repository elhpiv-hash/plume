/**
 * URL safety — the front-end anti-phishing layer.
 *
 * Accepts only http/https, hard-blocks dangerous schemes (javascript:, data:,
 * file:, vbscript:, …), and normalizes a bare domain to https. On success it
 * returns both the safe href and the real host, so the UI can show the true
 * destination rather than trusting a link's label text.
 *
 * This does not check a URL against threat intelligence (Google Safe Browsing
 * and friends live on the backend) — it only closes off the obvious local
 * attack surface. Errors are returned as i18n keys for the caller to render.
 */

import type { TranslationKey } from '@/i18n/types';

export interface SafeUrl {
  /** A fully-qualified, http(s) href safe to place in an anchor. */
  safeUrl: string;
  /** The display host (without a leading "www."). */
  host: string;
}

export type SanitizeResult =
  | { ok: true; value: SafeUrl }
  | { ok: false; error: TranslationKey };

/** Schemes we explicitly permit. Everything else is rejected. */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);

/** Matches a leading `scheme:` per RFC 3986 (letter, then letter/digit/+/-/.). */
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

export function sanitizeUrl(raw: string): SanitizeResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: 'validate.url.invalid' };

  // Add https:// only when there's no scheme at all; never rewrite an explicit
  // (and possibly dangerous) scheme into a safe-looking one.
  const candidate = HAS_SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, error: 'validate.url.invalid' };
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) {
    return { ok: false, error: 'validate.url.scheme' };
  }
  if (!url.hostname.includes('.')) {
    return { ok: false, error: 'validate.url.invalid' };
  }

  return {
    ok: true,
    value: { safeUrl: url.href, host: url.hostname.replace(/^www\./, '') },
  };
}
