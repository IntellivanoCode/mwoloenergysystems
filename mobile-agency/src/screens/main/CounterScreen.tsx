import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { queueAPI } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { useAgency } from '../../contexts/AgencyContext';
import { Colors, Spacing, BorderRadius, Fonts, Shadows } from '../../config/theme';

interface QueueTicket {
  id: string;
  ticket_number: string;
  service_type: string;
  service_display: string;
  status: string;
  priority: string;
  client_name?: string;
  created_at: string;
  called_at?: string;
}

export default function CounterScreen({ navigation }: any) {
  const { user, agency } = useAuth();
  const { queueStats, refreshStats } = useAgency();
  const [tickets, setTickets] = useState<QueueTicket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<QueueTicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [counterId, setCounterId] = useState(1); // ID du guichet actuel

  useEffect(() => {
    loadTickets();
    const interval = setInterval(loadTickets, 10000); // Rafraîchir toutes les 10s
    return () => clearInterval(interval);
  }, []);

  const loadTickets = async () => {
    if (!agency) return;
    
    try {
      const response = await queueAPI.getTickets(agency.id);
      const data = response.data.results || response.data || [];
      
      // Séparer les tickets en attente et celui en cours
      const waitingTickets = data.filter((t: QueueTicket) => t.status === 'waiting');
      const servingTicket = data.find((t: QueueTicket) => t.status === 'serving');
      
      setTickets(waitingTickets);
      setCurrentTicket(servingTicket || null);
    } catch (error) {
      console.error('Erreur chargement tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    await refreshStats();
    setRefreshing(false);
  };

  const handleCallNext = async () => {
    if (tickets.length === 0) {
      Alert.alert('Info', 'Aucun client en attente');
      return;
    }

    setIsProcessing(true);
    try {
      const nextTicket = tickets[0];
      const response = await queueAPI.callNext(nextTicket.id, counterId);
      
      setCurrentTicket(response.data);
      await loadTickets();
      await refreshStats();
      
      // Notification sonore ou visuelle pourrait être ajoutée ici
      Alert.alert(
        'Client appelé',
        `Ticket ${response.data.ticket_number}\n${response.data.client_name || 'Client'}`,
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.detail || 'Impossible d\'appeler le client');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    if (!currentTicket) return;

    setIsProcessing(true);
    try {
      await queueAPI.complete(currentTicket.id, { notes: '' });
      setCurrentTicket(null);
      await loadTickets();
      await refreshStats();
      Alert.alert('Terminé', 'Le client a été traité avec succès');
    } catch (error: any) {
      Alert.alert('Erreur', error.response?.data?.detail || 'Erreur lors de la finalisation');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!currentTicket) return;

    Alert.alert(
      'Annuler le ticket ?',
      'Le client sera marqué comme absent',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, absent',
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            try {
              await queueAPI.cancel(currentTicket.id);
              setCurrentTicket(null);
              await loadTickets();
              await refreshStats();
            } catch (error: any) {
              Alert.alert('Erreur', error.response?.data?.detail || 'Erreur');
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      waiting: Colors.queue.waiting,
      serving: Colors.queue.serving,
      completed: Colors.queue.completed,
      cancelled: Colors.queue.cancelled,
    };
    return colors[status] || Colors.gray[400];
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high' || priority === 'urgent') {
      return (
        <View style={[styles.priorityBadge, { backgroundColor: Colors.error }]}>
          <Text style={styles.priorityText}>Prioritaire</Text>
        </View>
      );
    }
    return null;
  };

  const renderTicket = ({ item }: { item: QueueTicket }) => (
    <View style={styles.ticketItem}>
      <View style={styles.ticketNumber}>
        <Text style={styles.ticketNumberText}>{item.ticket_number}</Text>
      </View>
      <View style={styles.ticketInfo}>
        <Text style={styles.ticketService}>{item.service_display || item.service_type}</Text>
        {item.client_name && (
          <Text style={styles.ticketClient}>{item.client_name}</Text>
        )}
      </View>
      {getPriorityBadge(item.priority)}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Guichet {counterId}</Text>
          <Text style={styles.headerSubtitle}>{agency?.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => {
            Alert.prompt && Alert.prompt(
              'Numéro de guichet',
              'Entrez le numéro de votre guichet',
              (value) => value && setCounterId(parseInt(value) || 1),
              'plain-text',
              String(counterId)
            );
          }}
        >
          <Ionicons name="settings-outline" size={24} color={Colors.gray[600]} />
        </TouchableOpacity>
      </View>

      {/* Current Ticket */}
      <View style={styles.currentSection}>
        <Text style={styles.sectionTitle}>Client actuel</Text>
        {currentTicket ? (
          <View style={styles.currentTicket}>
            <View style={styles.currentTicketHeader}>
              <Text style={styles.currentTicketNumber}>{currentTicket.ticket_number}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor('serving') }]}>
                <Text style={styles.statusText}>En service</Text>
              </View>
            </View>
            <Text style={styles.currentTicketService}>
              {currentTicket.service_display || currentTicket.service_type}
            </Text>
            {currentTicket.client_name && (
              <Text style={styles.currentTicketClient}>{currentTicket.client_name}</Text>
            )}
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
                disabled={isProcessing}
              >
                <Ionicons name="close" size={24} color={Colors.error} />
                <Text style={styles.cancelButtonText}>Absent</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.completeButton]}
                onPress={handleComplete}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={24} color={Colors.white} />
                    <Text style={styles.completeButtonText}>Terminé</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noCurrentTicket}>
            <Ionicons name="person-outline" size={48} color={Colors.gray[300]} />
            <Text style={styles.noCurrentText}>Aucun client en cours</Text>
            <TouchableOpacity
              style={[styles.callNextButton, isProcessing && styles.buttonDisabled]}
              onPress={handleCallNext}
              disabled={isProcessing || tickets.length === 0}
            >
              {isProcessing ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="megaphone-outline" size={24} color={Colors.white} />
                  <Text style={styles.callNextText}>Appeler suivant</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Queue List */}
      <View style={styles.queueSection}>
        <View style={styles.queueHeader}>
          <Text style={styles.sectionTitle}>File d'attente</Text>
          <View style={styles.queueCount}>
            <Text style={styles.queueCountText}>{tickets.length}</Text>
          </View>
        </View>

        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          contentContainerStyle={styles.ticketsList}
          ListEmptyComponent={
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>Aucun client en attente</Text>
            </View>
          }
        />
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentSection: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  currentTicket: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  currentTicketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  currentTicketNumber: {
    fontSize: Fonts.sizes['3xl'],
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
  },
  currentTicketService: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '500',
    color: Colors.text,
  },
  currentTicketClient: {
    fontSize: Fonts.sizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  cancelButton: {
    backgroundColor: Colors.error + '15',
  },
  cancelButtonText: {
    color: Colors.error,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: Colors.success,
    flex: 2,
  },
  completeButtonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
  noCurrentTicket: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    ...Shadows.sm,
  },
  noCurrentText: {
    fontSize: Fonts.sizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  callNextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  callNextText: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
  queueSection: {
    flex: 1,
    padding: Spacing.lg,
    paddingTop: 0,
  },
  queueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  queueCount: {
    backgroundColor: Colors.primary,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  queueCountText: {
    color: Colors.white,
    fontSize: Fonts.sizes.sm,
    fontWeight: 'bold',
  },
  ticketsList: {
    paddingBottom: Spacing.xl,
  },
  ticketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  ticketNumber: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  ticketNumberText: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketService: {
    fontSize: Fonts.sizes.md,
    fontWeight: '500',
    color: Colors.text,
  },
  ticketClient: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  priorityText: {
    color: Colors.white,
    fontSize: Fonts.sizes.xs,
    fontWeight: '600',
  },
  emptyList: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
  },
});
