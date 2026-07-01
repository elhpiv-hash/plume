import type { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/i18n/I18nContext';
import { ToastProvider } from '@/context/ToastContext';
import { DataProvider } from '@/context/DataContext';
import { AuthProvider } from '@/context/AuthContext';
import { NavigationProvider } from '@/context/NavigationContext';

/**
 * Provider composition. Order matters: Auth reads from Data, so it nests
 * beneath it. Data surfaces localized errors, so it nests beneath I18n. Theme,
 * I18n and Toast are otherwise independent and sit at the top.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <I18nProvider>
        <ToastProvider>
          <DataProvider>
            <AuthProvider>
              <NavigationProvider>{children}</NavigationProvider>
            </AuthProvider>
          </DataProvider>
        </ToastProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
