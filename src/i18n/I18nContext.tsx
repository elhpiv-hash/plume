import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { DICTS, FALLBACK_LOCALE } from '@/i18n/registry';
import { detectLocale } from '@/i18n/detect';
import type { Locale, TParams, Translate, TranslationKey } from '@/i18n/types';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translate;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

/** Replaces every `{token}` in a template with its param, leaving unknowns intact. */
function interpolate(template: string, params?: TParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in params ? String(params[key]) : match,
  );
}

interface I18nProviderProps {
  children: ReactNode;
  /** Overrides browser detection — handy for tests/stories. */
  initialLocale?: Locale;
}

/**
 * Owns the active UI language. The starting locale is detected from the browser
 * once; a manual pick (from Settings) overrides it for the session. Kept in
 * memory only, mirroring the ThemeProvider's prototype constraints.
 */
export function I18nProvider({ children, initialLocale }: I18nProviderProps) {
  const [locale, setLocale] = useState<Locale>(() => initialLocale ?? detectLocale());

  const t = useCallback<Translate>(
    (key: TranslationKey, params?: TParams) => {
      const dict = DICTS[locale] ?? DICTS[FALLBACK_LOCALE];
      const template = dict[key] ?? DICTS[FALLBACK_LOCALE][key];
      if (template === undefined) {
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Missing translation key: "${key}"`);
        }
        return key;
      }
      return interpolate(template, params);
    },
    [locale],
  );

  const value = useMemo<I18nContextValue>(() => ({ locale, setLocale, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
