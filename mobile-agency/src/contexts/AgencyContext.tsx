import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { agencyAPI, queueAPI } from '../config/api';
import { useAuth } from './AuthContext';

interface QueueStats {
  waiting: number;
  serving: number;
  completed_today: number;
  average_wait_time: number;
}

interface AgencyConfig {
  kiosk_enabled: boolean;
  max_tickets_per_day: number;
  service_hours_start: string;
  service_hours_end: string;
  counters: number[];
}

interface AgencyContextType {
  queueStats: QueueStats | null;
  agencyConfig: AgencyConfig | null;
  isLoading: boolean;
  refreshStats: () => Promise<void>;
  refreshConfig: () => Promise<void>;
  updateConfig: (config: Partial<AgencyConfig>) => Promise<void>;
}

const AgencyContext = createContext<AgencyContextType | undefined>(undefined);

export function AgencyProvider({ children }: { children: ReactNode }) {
  const { agency, isAuthenticated } = useAuth();
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [agencyConfig, setAgencyConfig] = useState<AgencyConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && agency) {
      refreshStats();
      refreshConfig();
    }
  }, [isAuthenticated, agency]);

  const refreshStats = async () => {
    if (!agency) return;
    
    try {
      const response = await queueAPI.getStats(agency.id);
      setQueueStats(response.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const refreshConfig = async () => {
    if (!agency) return;
    
    try {
      const response = await agencyAPI.getConfig(agency.id);
      setAgencyConfig(response.data);
    } catch (error) {
      console.error('Erreur chargement config:', error);
    }
  };

  const updateConfig = async (config: Partial<AgencyConfig>) => {
    if (!agency) return;
    
    setIsLoading(true);
    try {
      const response = await agencyAPI.setConfig(agency.id, config);
      setAgencyConfig(response.data);
    } catch (error) {
      console.error('Erreur mise à jour config:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AgencyContext.Provider
      value={{
        queueStats,
        agencyConfig,
        isLoading,
        refreshStats,
        refreshConfig,
        updateConfig,
      }}
    >
      {children}
    </AgencyContext.Provider>
  );
}

export function useAgency() {
  const context = useContext(AgencyContext);
  if (context === undefined) {
    throw new Error('useAgency must be used within an AgencyProvider');
  }
  return context;
}
