import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface AuthUser {
  id?: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (authUser: AuthUser, token?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((authUser: AuthUser, token?: string) => {
    setUser(authUser);
    localStorage.setItem('user', JSON.stringify(authUser));
    if (token) localStorage.setItem('token', token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
