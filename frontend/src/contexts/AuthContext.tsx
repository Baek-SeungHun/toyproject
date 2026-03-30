import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { authApi, type User } from '@/api/auth';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authApi.getMe()
      .then((data) => setUser(data))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(() => {
    window.location.href = authApi.getLoginUrl();
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    login,
    logout,
  }), [user, isLoading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
