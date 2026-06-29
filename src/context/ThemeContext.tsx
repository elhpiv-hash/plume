import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Theme } from '@/types';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_COLOR: Record<Theme, string> = {
  dark: '#0d0e11',
  light: '#ffffff',
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

/**
 * Owns the active theme and reflects it onto <html data-theme> plus the
 * browser chrome color. State is kept in memory only (no localStorage), per the
 * prototype's constraints.
 */
export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[theme]);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
