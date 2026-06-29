import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DataContext } from '@/context/DataContext';
import type { RegisterInput, Result, Session, User } from '@/types';

interface AuthContextValue {
  session: Session | null;
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Result<User>;
  register: (input: RegisterInput) => Result<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Session ownership. Authentication is delegated to the data layer; this
 * provider only holds *who is signed in* and exposes login/register/logout. It
 * must be mounted beneath DataProvider.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const data = useContext(DataContext);
  if (!data) throw new Error('AuthProvider must be used within a DataProvider.');

  const [session, setSession] = useState<Session | null>(null);

  const login = useCallback(
    (username: string, password: string): Result<User> => {
      const result = data.authenticate(username, password);
      if (!result.ok) return result;
      setSession({ userId: result.value.id });
      return result;
    },
    [data],
  );

  const register = useCallback(
    (input: RegisterInput): Result<User> => {
      const result = data.registerUser(input);
      if (!result.ok) return result;
      setSession({ userId: result.value.id });
      return result;
    },
    [data],
  );

  const logout = useCallback(() => setSession(null), []);

  const currentUser = session ? data.getUser(session.userId) ?? null : null;

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      currentUser,
      isAuthenticated: currentUser !== null,
      login,
      register,
      logout,
    }),
    [session, currentUser, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
