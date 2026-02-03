'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, getCurrentUser, isAuthenticated, logout as authLogout, getDashboardUrl } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
  getDashboard: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (isAuthenticated()) {
      const userData = await getCurrentUser();
      setUser(userData);
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = () => {
    authLogout();
    setUser(null);
  };

  const getDashboard = () => {
    if (user?.role) {
      return getDashboardUrl(user.role);
    }
    return '/dashboard';
  };

  return (
    <AuthContext.Provider value={{ user, loading, isLoggedIn: !!user, logout, refreshUser, getDashboard }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
