import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStaffAuth } from '../../contexts/StaffAuthContext';
import staffApiService from '../../services/api';
import { Colors, Spacing, BorderRadius, Fonts, Shadows } from '../../config/theme';

interface DashboardStats {
  waitingCount: number;
  inProgressCount: number;
  completedToday: number;
  averageWaitTime: number;
  todayAppointments: number;
  pendingTickets: number;
}

export default function StaffDashboardScreen({ navigation }: any) {
  const { user } = useStaffAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    waitingCount: 0,
    inProgressCount: 0,
    completedToday: 0,
    averageWaitTime: 0,
    todayAppointments: 0,
    pendingTickets: 0,
  });
  const [currentTicket, setCurrentTicket] = useState<any>(null);

  const loadData = async () => {
    try {
      const [queueStatus, dashboardStats] = await Promise.all([
        staffApiService.getQueueStatus().catch(() => ({})),
        staffApiService.getDashboardStats().catch(() => ({})),
      ]);

      setStats({
        waitingCount: queueStatus.waiting_count || 0,
        inProgressCount: queueStatus.in_progress_count || 0,
        completedToday: dashboardStats.completed_today || 0,
        averageWaitTime: queueStatus.average_wait_time || 0,
        todayAppointments: dashboardStats.today_appointments || 0,
        pendingTickets: dashboardStats.pending_tickets || 0,
      });

      setCurrentTicket(queueStatus.current_ticket || null);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const handleCallNext = async () => {
    try {
      const result = await staffApiService.callNextTicket(user?.counter_id);
      if (result.ticket) {
        setCurrentTicket(result.ticket);
        loadData();
      }
    } catch (error) {
      console.error('Error calling next ticket:', error);
    }
  };

  const StatCard = ({ icon, label, value, color, onPress }: any) => (
    <TouchableOpacity 
      style={styles.statCard}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const QuickAction = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color={Colors.white} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.first_name || 'Agent'} 👋</Text>
            {user?.counter_name && (
              <Text style={styles.counterInfo}>
                <Ionicons name="desktop-outline" size={14} color={Colors.gray[500]} />
                {' '}{user.counter_name}
              </Text>
            )}
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('ProfileTab')}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {user?.first_name?.[0] || 'A'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Ticket en cours */}
        {currentTicket ? (
          <View style={styles.currentTicketCard}>
            <View style={styles.currentTicketHeader}>
              <Text style={styles.currentTicketLabel}>Client en cours</Text>
              <View style={styles.currentTicketBadge}>
                <Text style={styles.currentTicketBadgeText}>En cours</Text>
              </View>
            </View>
            <View style={styles.currentTicketNumber}>
              <Text style={styles.ticketPrefix}>{currentTicket.service_prefix || 'A'}</Text>
              <Text style={styles.ticketNumber}>{currentTicket.number || '000'}</Text>
            </View>
            <Text style={styles.currentTicketService}>{currentTicket.service_name || 'Service général'}</Text>
            <View style={styles.currentTicketActions}>
              <TouchableOpacity 
                style={[styles.ticketActionButton, styles.ticketActionComplete]}
                onPress={() => navigation.navigate('CompleteTicket', { ticket: currentTicket })}
              >
                <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
                <Text style={styles.ticketActionText}>Terminer</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.ticketActionButton, styles.ticketActionTransfer]}
                onPress={() => navigation.navigate('TransferTicket', { ticket: currentTicket })}
              >
                <Ionicons name="arrow-redo" size={20} color={Colors.primary} />
                <Text style={[styles.ticketActionText, { color: Colors.primary }]}>Transférer</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.callNextCard} onPress={handleCallNext}>
            <Ionicons name="hand-right-outline" size={48} color={Colors.primary} />
            <Text style={styles.callNextText}>Appeler le prochain client</Text>
            <Text style={styles.callNextSubtext}>
              {stats.waitingCount} client{stats.waitingCount > 1 ? 's' : ''} en attente
            </Text>
          </TouchableOpacity>
        )}

        {/* Statistiques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aujourd'hui</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="people-outline"
              label="En attente"
              value={stats.waitingCount}
              color={Colors.status.waiting}
              onPress={() => navigation.navigate('QueueTab')}
            />
            <StatCard
              icon="time-outline"
              label="Temps moyen"
              value={`${Math.round(stats.averageWaitTime)} min`}
              color={Colors.info}
            />
            <StatCard
              icon="checkmark-done-outline"
              label="Traités"
              value={stats.completedToday}
              color={Colors.status.completed}
            />
            <StatCard
              icon="calendar-outline"
              label="RDV"
              value={stats.todayAppointments}
              color={Colors.secondary}
              onPress={() => navigation.navigate('AppointmentsTab')}
            />
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActions}>
            <QuickAction
              icon="search-outline"
              label="Chercher client"
              color={Colors.primary}
              onPress={() => navigation.navigate('SearchClient')}
            />
            <QuickAction
              icon="person-add-outline"
              label="Nouveau client"
              color={Colors.accent}
              onPress={() => navigation.navigate('NewClient')}
            />
            <QuickAction
              icon="receipt-outline"
              label="Encaissement"
              color={Colors.secondary}
              onPress={() => navigation.navigate('Payment')}
            />
            <QuickAction
              icon="chatbubbles-outline"
              label="Tickets support"
              color={Colors.warning}
              onPress={() => navigation.navigate('SupportTickets')}
            />
          </View>
        </View>

        {/* Alertes */}
        {stats.pendingTickets > 0 && (
          <TouchableOpacity 
            style={styles.alertCard}
            onPress={() => navigation.navigate('SupportTickets')}
          >
            <Ionicons name="alert-circle" size={24} color={Colors.warning} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>
                {stats.pendingTickets} ticket{stats.pendingTickets > 1 ? 's' : ''} support en attente
              </Text>
              <Text style={styles.alertSubtitle}>Touchez pour voir</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.warning} />
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.gray[500],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Fonts.sizes.base,
    color: Colors.gray[500],
  },
  userName: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: Colors.gray[800],
  },
  counterInfo: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
    marginTop: Spacing.xs,
  },
  profileButton: {
    padding: Spacing.xs,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: Colors.white,
  },
  currentTicketCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  currentTicketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  currentTicketLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.white + 'BB',
  },
  currentTicketBadge: {
    backgroundColor: Colors.white + '30',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  currentTicketBadgeText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.white,
    fontWeight: '600',
  },
  currentTicketNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  ticketPrefix: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: Colors.white,
  },
  ticketNumber: {
    fontSize: Fonts.sizes['4xl'],
    fontWeight: 'bold',
    color: Colors.white,
  },
  currentTicketService: {
    fontSize: Fonts.sizes.base,
    color: Colors.white + 'CC',
    marginBottom: Spacing.lg,
  },
  currentTicketActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  ticketActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  ticketActionComplete: {
    backgroundColor: Colors.accent,
  },
  ticketActionTransfer: {
    backgroundColor: Colors.white,
  },
  ticketActionText: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.white,
  },
  callNextCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
    ...Shadows.md,
  },
  callNextText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: Spacing.md,
  },
  callNextSubtext: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '600',
    color: Colors.gray[800],
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: Colors.gray[800],
  },
  statLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  quickActionLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  alertContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  alertTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  alertSubtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
  },
});
