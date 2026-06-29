import { Providers } from '@/app/Providers';
import { AppShell } from '@/components/layout/AppShell';
import { Router } from '@/app/Router';
import { AuthScreen } from '@/features/auth/AuthScreen';
import { Toaster } from '@/components/ui/Toaster';
import { useAuth } from '@/hooks/useAuth';

/**
 * The authentication gate. A signed-out visitor sees only the onboarding;
 * everything else lives inside the authenticated AppShell.
 */
function Gate() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <AuthScreen />;
  return (
    <AppShell>
      <Router />
    </AppShell>
  );
}

export function App() {
  return (
    <Providers>
      <Gate />
      <Toaster />
    </Providers>
  );
}
