/**
 * Field validation. Each rule returns either null (valid) or an i18n key that
 * the UI resolves via `t(...)` in the active language. The messages themselves
 * live in the locale dictionaries, keeping the product voice per-locale while
 * these rules stay pure and language-agnostic.
 */

import type { TranslationKey } from '@/i18n/types';

export const POST_MAX = 280;

export interface FieldRule {
  validate: (value: string) => TranslationKey | null;
}

export function validateName(value: string): TranslationKey | null {
  const v = value.trim();
  if (!v) return 'validate.name.required';
  if (v.length > 40) return 'validate.name.tooLong';
  return null;
}

/** Normalizes a handle to its canonical form before validation/storage. */
export function normalizeUsername(value: string): string {
  return value.trim().replace(/^@+/, '').toLowerCase();
}

export function validateUsername(value: string): TranslationKey | null {
  const v = normalizeUsername(value);
  if (!v) return 'validate.username.required';
  if (v.length < 3) return 'validate.username.tooShort';
  if (v.length > 20) return 'validate.username.tooLong';
  if (!/^[a-z0-9_]+$/.test(v)) return 'validate.username.charset';
  if (/^[0-9]/.test(v)) return 'validate.username.startsWithLetter';
  return null;
}

export function validatePassword(value: string): TranslationKey | null {
  if (!value) return 'validate.password.required';
  if (value.length < 6) return 'validate.password.tooShort';
  return null;
}

export function validatePostText(value: string): TranslationKey | null {
  const v = value.trim();
  if (!v) return 'validate.post.empty';
  if (value.length > POST_MAX) return 'validate.post.tooLong';
  return null;
}

/** Adds a default scheme so bare domains («plume.app») становятся валидными. */
export function normalizeUrl(value: string): string {
  const v = value.trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

/** URL валиден или пуст (поле опционально). Возвращает i18n-ключ ошибки. */
export function validateUrl(value: string): TranslationKey | null {
  const v = value.trim();
  if (!v) return null;
  try {
    const url = new URL(normalizeUrl(v));
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'validate.url.scheme';
    }
    if (!url.hostname.includes('.')) return 'validate.url.invalid';
    return null;
  } catch {
    return 'validate.url.invalid';
  }
}
