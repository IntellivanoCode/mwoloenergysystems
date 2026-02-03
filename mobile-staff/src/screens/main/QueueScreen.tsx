import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStaffAuth } from '../../contexts/StaffAuthContext';
import staffApiService from '../../services/api';
import { Colors, Spacing, BorderRadius, Fonts, Shadows } from '../../config/theme';

interface QueueTicket {
  id: number;
  number: number;
  service_prefix: string;
  service_name: string;
  client_name?: string;
  status: 'waiting' | 'called' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'normal' | 'priority';
  is_appointment: boolean;
  created_at: string;
  called_at?: string;
  wait_time?: number;
}

const statusConfig = {
  waiting: { label: 'En attente', color: Colors.status.waiting, icon: 'time-outline' },
  called: { label: 'Appelé', color: Colors.info, icon: 'megaphone-outline' },
  in_progress: { label: 'En cours', color: Colors.status.inProgress, icon: 'play-outline' },
  completed: { label: 'Terminé', color: Colors.status.completed, icon: 'checkmark-circle-outline' },
  cancelled: { label: 'Annulé', color: Colors.status.cancelled, icon: 'close-circle-outline' },
  no_show: { label: 'Absent', color: Colors.status.noShow, icon: 'person-remove-outline' },
};

export default function QueueScreen({ navigation }: any) {
  const { user } = useStaffAuth();
  const [tickets, setTickets] = useState<QueueTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'waiting' | 'in_progress'>('waiting');
  const [queueStats, setQueueStats] = useState({
    waiting: 0,
    inProgress: 0,
    completed: 0,
  });

  const loadData = async () => {
    try {
      const [ticketsData, statsData] = await Promise.all([
        staffApiService.getQueueTickets({ status: filter !== 'all' ? filter : undefined }),
        staffApiService.getQueueStatus(),
      ]);

      setTickets(ticketsData.results || []);
      setQueueStats({
        waiting: statsData.waiting_count || 0,
        inProgress: statsData.in_progress_count || 0,
        completed: statsData.completed_today || 0,
      });
    } catch (error) {
      console.error('Error loading queue:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh toutes les 15 secondes
    const interval = setInterval(loadData, 15000);
    return () => clearInterval(interval);
  }, [filter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [filter]);

  const handleCallTicket = async (ticket: QueueTicket) => {
    try {
      await staffApiService.callNextTicket(user?.counter_id);
      loadData();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'appeler ce ticket');
    }
  };

  const handleMarkNoShow = async (ticket: QueueTicket) => {
    Alert.alert(
      'Marquer absent',
      `Le client ${ticket.service_prefix}${ticket.number} sera marqué comme absent.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          style: 'destructive',
          onPress: async () => {
            try {
              await staffApiService.cancelTicket(ticket.id, 'no_show');
              loadData();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de marquer le client absent');
            }
          },
        },
      ]
    );
  };

  const FilterButton = ({ value, label, count }: { value: typeof filter; label: string; count: number }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterButtonText, filter === value && styles.filterButtonTextActive]}>
        {label}
      </Text>
      <View style={[styles.filterBadge, filter === value && styles.filterBadgeActive]}>
        <Text style={[styles.filterBadgeText, filter === value && styles.filterBadgeTextActive]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const formatWaitTime = (minutes?: number) => {
    if (!minutes) return '-';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins : ''}`;
  };

  const renderTicket = ({ item, index }: { item: QueueTicket; index: number }) => {
    const config = statusConfig[item.status];
    const isFirst = index === 0 && item.status === 'waiting';

    return (
      <TouchableOpacity
        style={[styles.ticketCard, isFirst && styles.ticketCardFirst]}
        onPress={() => navigation.navigate('TicketDetail', { ticket: item })}
      >
        <View style={styles.ticketMain}>
          <View style={styles.ticketNumber}>
            <Text style={[styles.ticketPrefix, isFirst && { color: Colors.primary }]}>
              {item.service_prefix}
            </Text>
            <Text style={[styles.ticketNum, isFirst && { color: Colors.primary }]}>
              {String(item.number).padStart(3, '0')}
            </Text>
          </View>
          
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketService}>{item.service_name}</Text>
            <View style={styles.ticketMeta}>
              {item.is_appointment && (
                <View style={styles.appointmentBadge}>
                  <Ionicons name="calendar" size={12} color={Colors.secondary} />
                  <Text style={styles.appointmentText}>RDV</Text>
                </View>
              )}
              {item.priority === 'priority' && (
                <View style={styles.priorityBadge}>
                  <Ionicons name="star" size={12} color={Colors.warning} />
                  <Text style={styles.priorityText}>Prioritaire</Text>
                </View>
              )}
              <Text style={styles.waitTime}>
                <Ionicons name="time-outline" size={12} color={Colors.gray[400]} />
                {' '}{formatWaitTime(item.wait_time)}
              </Text>
            </View>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
            <Ionicons name={config.icon as any} size={16} color={config.color} />
          </View>
        </View>

        {item.status === 'waiting' && (
          <View style={styles.ticketActions}>
            {isFirst && (
              <TouchableOpacity
                style={[styles.actionButton, styles.actionButtonPrimary]}
                onPress={() => handleCallTicket(item)}
              >
                <Ionicons name="megaphone" size={16} color={Colors.white} />
                <Text style={styles.actionButtonPrimaryText}>Appeler</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonOutline]}
              onPress={() => handleMarkNoShow(item)}
            >
              <Text style={styles.actionButtonOutlineText}>Absent</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.status === 'called' && (
          <View style={styles.ticketActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonPrimary]}
              onPress={() => navigation.navigate('ServeClient', { ticket: item })}
            >
              <Ionicons name="play" size={16} color={Colors.white} />
              <Text style={styles.actionButtonPrimaryText}>Prendre en charge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonDanger]}
              onPress={() => handleMarkNoShow(item)}
            >
              <Text style={styles.actionButtonDangerText}>Absent</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color={Colors.gray[300]} />
      <Text style={styles.emptyTitle}>Aucun client</Text>
      <Text style={styles.emptyText}>
        {filter === 'waiting'
          ? 'Pas de clients en attente pour le moment'
          : 'Aucun client dans cette catégorie'}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement de la file...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>File d'attente</Text>
        <TouchableOpacity
          style={styles.callNextButton}
          onPress={() => staffApiService.callNextTicket(user?.counter_id).then(loadData)}
        >
          <Ionicons name="megaphone" size={20} color={Colors.white} />
          <Text style={styles.callNextText}>Suivant</Text>
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      <View style={styles.filters}>
        <FilterButton value="waiting" label="En attente" count={queueStats.waiting} />
        <FilterButton value="in_progress" label="En cours" count={queueStats.inProgress} />
        <FilterButton value="all" label="Tous" count={queueStats.waiting + queueStats.inProgress} />
      </View>

      {/* Liste */}
      <FlatList
        data={tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: Colors.gray[800],
  },
  callNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  callNextText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: Fonts.sizes.sm,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    gap: Spacing.xs,
    ...Shadows.sm,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[600],
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  filterBadge: {
    backgroundColor: Colors.gray[100],
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  filterBadgeActive: {
    backgroundColor: Colors.white + '30',
  },
  filterBadgeText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '600',
    color: Colors.gray[600],
  },
  filterBadgeTextActive: {
    color: Colors.white,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  ticketCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  ticketCardFirst: {
    borderWidth: 2,
    borderColor: Colors.primary + '40',
  },
  ticketMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginRight: Spacing.md,
  },
  ticketPrefix: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: Colors.gray[700],
  },
  ticketNum: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: Colors.gray[800],
  },
  ticketInfo: {
    flex: 1,
  },
  ticketService: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.sm,
  },
  appointmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary + '15',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  appointmentText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.secondary,
    fontWeight: '500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  priorityText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.warning,
    fontWeight: '500',
  },
  waitTime: {
    fontSize: Fonts.sizes.xs,
    color: Colors.gray[400],
  },
  statusBadge: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketActions: {
    flexDirection: 'row',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  actionButtonPrimaryText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: Fonts.sizes.sm,
  },
  actionButtonOutline: {
    backgroundColor: Colors.gray[100],
  },
  actionButtonOutlineText: {
    color: Colors.gray[600],
    fontWeight: '500',
    fontSize: Fonts.sizes.sm,
  },
  actionButtonDanger: {
    backgroundColor: Colors.error + '15',
  },
  actionButtonDangerText: {
    color: Colors.error,
    fontWeight: '500',
    fontSize: Fonts.sizes.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '600',
    color: Colors.gray[600],
    marginTop: Spacing.lg,
  },
  emptyText: {
    fontSize: Fonts.sizes.base,
    color: Colors.gray[400],
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
