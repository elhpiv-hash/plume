import type { ReactNode } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { DataProvider } from '@/context/DataContext';
import { AuthProvider } from '@/context/AuthContext';
import { NavigationProvider } from '@/context/NavigationContext';

/**
 * Provider composition. Order matters: Auth reads from Data, so it nests
 * beneath it. Theme and Toast are independent and sit at the top.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <ToastProvider>
        <DataProvider>
          <AuthProvider>
            <NavigationProvider>{children}</NavigationProvider>
          </AuthProvider>
        </DataProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
