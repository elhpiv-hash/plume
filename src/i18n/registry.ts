/**
 * Locale registry. Adding a language is intentionally a two-line change here
 * plus a new dictionary file — nothing else in the app needs to know.
 */
import { ru } from '@/i18n/locales/ru';
import { en } from '@/i18n/locales/en';
import type { Dict, Locale } from '@/i18n/types';

export interface LocaleEntry {
  code: Locale;
  /** Native display name for the language switcher. */
  label: string;
  dict: Dict;
}

export const LOCALES: readonly LocaleEntry[] = [
  { code: 'ru', label: ru['locale.name.ru'], dict: ru },
  { code: 'en', label: en['locale.name.en'], dict: en },
];

/** Fallback when the browser language isn't supported. */
export const FALLBACK_LOCALE: Locale = 'en';

export const DICTS: Record<Locale, Dict> = {
  ru,
  en,
};

export const isLocale = (value: string): value is Locale =>
  LOCALES.some((l) => l.code === value);
