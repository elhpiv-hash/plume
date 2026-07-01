/**
 * Start-up locale detection from the browser. We match only the primary
 * subtag (`ru-RU` → `ru`); country-level detection by IP is a backend concern
 * and intentionally out of scope. Unsupported languages fall back.
 */
import { FALLBACK_LOCALE, isLocale } from '@/i18n/registry';
import type { Locale } from '@/i18n/types';

export function detectLocale(): Locale {
  if (typeof navigator === 'undefined') return FALLBACK_LOCALE;
  const candidates = [navigator.language, ...(navigator.languages ?? [])];
  for (const tag of candidates) {
    const primary = tag.toLowerCase().split('-')[0];
    if (primary && isLocale(primary)) return primary;
  }
  return FALLBACK_LOCALE;
}
