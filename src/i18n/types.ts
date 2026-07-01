/**
 * i18n primitive types. The `ru` dictionary is the canonical key set: every
 * other locale is typed as `Dict = Record<TranslationKey, string>`, so a missing
 * or misspelled key fails the build rather than silently falling through.
 */
import { ru } from '@/i18n/locales/ru';

/** Supported UI languages. Add a locale = add a file + a registry entry. */
export type Locale = 'ru' | 'en';

/** Every valid translation key, derived from the canonical dictionary. */
export type TranslationKey = keyof typeof ru;

/** The shape each locale dictionary must fully satisfy. */
export type Dict = Record<TranslationKey, string>;

/** Interpolation values for `{placeholder}` tokens in a string. */
export type TParams = Record<string, string | number>;

/** Translator: resolves a key to the active locale's string, interpolated. */
export type Translate = (key: TranslationKey, params?: TParams) => string;
