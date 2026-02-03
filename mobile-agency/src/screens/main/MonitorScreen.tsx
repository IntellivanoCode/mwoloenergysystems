/**
 * Mwolo Energy Systems - Moniteur File d'Attente
 * Affichage des tickets appelés sur écran TV / grand écran
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../config/theme';
import { apiService } from '../../services/api';
import { useAgency } from '../../contexts/AgencyContext';

interface QueueTicket {
  id: string;
  ticket_number: string;
  service_type: string;
  service_name: string;
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'cancelled';
  counter?: string;
  counter_name?: string;
  created_at: string;
  called_at?: string;
  position?: number;
}

interface QueueStats {
  waiting_count: number;
  average_wait_time: number;
  serving_count: number;
  completed_today: number;
}

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

export default function MonitorScreen() {
  const { currentAgency } = useAgency();
  const [calledTickets, setCalledTickets] = useState<QueueTicket[]>([]);
  const [waitingTickets, setWaitingTickets] = useState<QueueTicket[]>([]);
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Mise à jour de l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Chargement des données
  const loadData = useCallback(async () => {
    if (!currentAgency?.id) return;

    try {
      const [calledRes, waitingRes, statsRes] = await Promise.all([
        apiService.get<QueueTicket[]>(`/appointments/queue/?agency=${currentAgency.id}&status=called`),
        apiService.get<QueueTicket[]>(`/appointments/queue/?agency=${currentAgency.id}&status=waiting`),
        apiService.get<QueueStats>(`/appointments/queue/stats/?agency=${currentAgency.id}`),
      ]);

      if (calledRes.data) {
        const data = Array.isArray(calledRes.data) ? calledRes.data : (calledRes.data as any).results || [];
        setCalledTickets(data);
      }
      if (waitingRes.data) {
        const data = Array.isArray(waitingRes.data) ? waitingRes.data : (waitingRes.data as any).results || [];
        setWaitingTickets(data.slice(0, 10)); // Top 10 en attente
      }
      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Error loading monitor data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentAgency?.id]);

  // Auto-refresh toutes les 5 secondes
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Formater l'heure
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Ticket appelé principal (le plus récent)
  const currentTicket = calledTickets[0];

  if (!currentAgency) {
    return (
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <Ionicons name="warning" size={48} color={theme.colors.warning} />
          <Text style={styles.errorText}>Aucune agence sélectionnée</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Header avec logo et heure */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="flash" size={32} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.logoText}>Mwolo Energy Systems</Text>
            <Text style={styles.agencyName}>{currentAgency.name}</Text>
          </View>
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.dateText}>
            {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Panneau principal - Ticket en cours d'appel */}
        <View style={styles.mainPanel}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="megaphone" size={24} color={theme.colors.primary} /> TICKET APPELÉ
          </Text>
          
          {currentTicket ? (
            <View style={styles.currentTicketCard}>
              <Text style={styles.currentTicketNumber}>{currentTicket.ticket_number}</Text>
              <Text style={styles.currentTicketService}>{currentTicket.service_name}</Text>
              <View style={styles.counterBadge}>
                <Ionicons name="location" size={20} color="#FFFFFF" />
                <Text style={styles.counterText}>
                  {currentTicket.counter_name || `Guichet ${currentTicket.counter}`}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noTicketCard}>
              <Ionicons name="hourglass-outline" size={64} color={theme.colors.textLight} />
              <Text style={styles.noTicketText}>En attente du prochain client</Text>
            </View>
          )}

          {/* Autres tickets appelés */}
          {calledTickets.length > 1 && (
            <View style={styles.otherCalledContainer}>
              <Text style={styles.otherCalledTitle}>Également appelés</Text>
              <View style={styles.otherCalledList}>
                {calledTickets.slice(1, 4).map((ticket) => (
                  <View key={ticket.id} style={styles.otherCalledItem}>
                    <Text style={styles.otherTicketNumber}>{ticket.ticket_number}</Text>
                    <Text style={styles.otherTicketCounter}>{ticket.counter_name || `G${ticket.counter}`}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Panneau latéral - File d'attente */}
        <View style={styles.sidePanel}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="people" size={24} color={theme.colors.secondary} /> FILE D'ATTENTE
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats?.waiting_count || 0}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats?.average_wait_time || 0} min</Text>
              <Text style={styles.statLabel}>Temps moyen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats?.completed_today || 0}</Text>
              <Text style={styles.statLabel}>Servis</Text>
            </View>
          </View>

          {/* Liste des tickets en attente */}
          <FlatList
            data={waitingTickets}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={styles.waitingTicketItem}>
                <View style={styles.waitingPosition}>
                  <Text style={styles.positionNumber}>{index + 1}</Text>
                </View>
                <View style={styles.waitingInfo}>
                  <Text style={styles.waitingTicketNumber}>{item.ticket_number}</Text>
                  <Text style={styles.waitingService}>{item.service_name}</Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Ionicons name="checkmark-circle" size={48} color={theme.colors.success} />
                <Text style={styles.emptyText}>Aucun client en attente</Text>
              </View>
            }
          />
        </View>
      </View>

      {/* Bandeau défilant */}
      <View style={styles.ticker}>
        <Text style={styles.tickerText}>
          🔋 Bienvenue chez Mwolo Energy Systems • Préparez vos documents pour faciliter le traitement • 
          Merci de votre patience • © 2026 Mwolo Energy Systems
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  agencyName: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  dateText: {
    fontSize: 16,
    color: '#94A3B8',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    flexDirection: isLandscape ? 'row' : 'column',
    padding: 16,
    gap: 16,
  },
  mainPanel: {
    flex: isLandscape ? 2 : 1,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
  },
  sidePanel: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  currentTicketCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  currentTicketNumber: {
    fontSize: 96,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  currentTicketService: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 50,
    marginTop: 24,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  noTicketCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    padding: 48,
    alignItems: 'center',
    marginBottom: 24,
  },
  noTicketText: {
    fontSize: 20,
    color: '#94A3B8',
    marginTop: 16,
  },
  otherCalledContainer: {
    marginTop: 16,
  },
  otherCalledTitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 12,
  },
  otherCalledList: {
    flexDirection: 'row',
    gap: 12,
  },
  otherCalledItem: {
    backgroundColor: 'rgba(14, 165, 233, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  otherTicketNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  otherTicketCounter: {
    fontSize: 12,
    color: '#94A3B8',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  waitingTicketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  waitingPosition: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  waitingInfo: {
    flex: 1,
  },
  waitingTicketNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  waitingService: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyList: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
  },
  ticker: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
  },
  tickerText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#94A3B8',
    marginTop: 16,
  },
});
