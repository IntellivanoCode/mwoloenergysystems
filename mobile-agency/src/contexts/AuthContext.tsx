import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import storage from '../utils/storage';
import { authAPI, agencyAPI } from '../config/api';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  post_name?: string;
  role: string;
  agency?: string;
  agency_name?: string;
  agency_code?: string;
  employee_number?: string;
  position?: string;
  position_display?: string;
  department?: string;
  can_manage_queue?: boolean;
  accessible_dashboards?: string[];
}

interface Agency {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  agency: Agency | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithBadge: (badgeCode: string) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentAgency: (agency: Agency) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier l'authentification au démarrage
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await storage.getItem('access_token');
      const userData = await storage.getItem('user_data');
      const agencyData = await storage.getItem('agency_data');

      if (token && userData) {
        setUser(JSON.parse(userData));
        if (agencyData) {
          setAgency(JSON.parse(agencyData));
        }
        
        // Rafraîchir les données utilisateur
        try {
          const response = await authAPI.me();
          setUser(response.data);
          await storage.setItem('user_data', JSON.stringify(response.data));
        } catch (error) {
          // Token expiré - sera géré par l'intercepteur
        }
      }
    } catch (error) {
      console.error('Erreur vérification auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access, refresh, user: userData } = response.data;

      // Vérifier que c'est un employé ou admin
      if (!['admin', 'super_admin', 'staff', 'agent'].includes(userData.role)) {
        throw new Error("Accès non autorisé. Cette application est réservée au personnel des agences.");
      }

      await storage.setItem('access_token', access);
      await storage.setItem('refresh_token', refresh);
      await storage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);

      // Charger l'agence si disponible
      if (userData.agency) {
        try {
          const agencyResponse = await agencyAPI.get(userData.agency);
          setAgency(agencyResponse.data);
          await storage.setItem('agency_data', JSON.stringify(agencyResponse.data));
        } catch (e) {
          console.warn('Impossible de charger l\'agence');
        }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Email ou mot de passe incorrect');
      }
      throw error;
    }
  };

  const loginWithBadge = async (badgeCode: string) => {
    try {
      const response = await authAPI.loginWithBadge(badgeCode);
      const { access, refresh, user: userData } = response.data;

      await storage.setItem('access_token', access);
      await storage.setItem('refresh_token', refresh);
      await storage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);

      // Charger l'agence
      if (userData.agency) {
        const agencyResponse = await agencyAPI.get(userData.agency);
        setAgency(agencyResponse.data);
        await storage.setItem('agency_data', JSON.stringify(agencyResponse.data));
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Badge non reconnu');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignorer les erreurs de logout
    } finally {
      await storage.removeItem('access_token');
      await storage.removeItem('refresh_token');
      await storage.removeItem('user_data');
      await storage.removeItem('agency_data');
      setUser(null);
      setAgency(null);
    }
  };

  const setCurrentAgency = async (newAgency: Agency) => {
    setAgency(newAgency);
    await storage.setItem('agency_data', JSON.stringify(newAgency));
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.me();
      setUser(response.data);
      await storage.setItem('user_data', JSON.stringify(response.data));
    } catch (error) {
      console.error('Erreur rafraîchissement utilisateur:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        agency,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithBadge,
        logout,
        setCurrentAgency,
        refreshUser,
      }}
    >
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
