import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

/**
 * A small in-memory router. URL sync is intentionally omitted — the prototype's
 * state lives in memory, so navigation is a typed route union plus a history
 * stack (to power the mobile back affordance).
 */
export type Route =
  | { name: 'feed' }
  | { name: 'search' }
  | { name: 'mind' }
  | { name: 'profile'; username: string }
  | { name: 'settings' }
  | { name: 'edit-profile' };

interface NavigationContextValue {
  route: Route;
  navigate: (route: Route) => void;
  back: () => void;
  canGoBack: boolean;
}

export const NavigationContext = createContext<NavigationContextValue | null>(null);

function sameRoute(a: Route, b: Route): boolean {
  if (a.name !== b.name) return false;
  if (a.name === 'profile' && b.name === 'profile') return a.username === b.username;
  return true;
}

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [stack, setStack] = useState<Route[]>([{ name: 'feed' }]);

  const navigate = useCallback((route: Route) => {
    setStack((prev) => {
      const top = prev[prev.length - 1];
      if (top && sameRoute(top, route)) return prev;
      return [...prev, route];
    });
  }, []);

  const back = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const value = useMemo<NavigationContextValue>(() => {
    const route = stack[stack.length - 1] ?? { name: 'feed' };
    return { route, navigate, back, canGoBack: stack.length > 1 };
  }, [stack, navigate, back]);

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
