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
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';
import { Colors, Spacing, BorderRadius, Fonts } from '../../config/theme';

interface DashboardData {
  unpaidInvoices: number;
  totalDue: number;
  lastConsumption: number;
  pendingTickets: number;
  nextAppointment: any;
}

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<DashboardData>({
    unpaidInvoices: 0,
    totalDue: 0,
    lastConsumption: 0,
    pendingTickets: 0,
    nextAppointment: null,
  });

  const loadData = async () => {
    try {
      // Charger les données en parallèle
      const [invoices, tickets, appointments] = await Promise.all([
        apiService.getInvoices({ status: 'pending' }).catch(() => ({ results: [] })),
        apiService.getTickets({ status: 'open' }).catch(() => ({ results: [] })),
        apiService.getAppointments({ status: 'scheduled' }).catch(() => ({ results: [] })),
      ]);

      const unpaidInvoices = invoices.results?.length || 0;
      const totalDue = invoices.results?.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount_due || 0), 0) || 0;
      const pendingTickets = tickets.results?.length || 0;
      const nextAppointment = appointments.results?.[0] || null;

      setData({
        unpaidInvoices,
        totalDue,
        lastConsumption: 0, // À implémenter avec l'API consommation
        pendingTickets,
        nextAppointment,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const QuickAction = ({ icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const StatCard = ({ icon, label, value, color, onPress }: any) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.userName}>{user?.first_name || 'Client'} 👋</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.gray[700]} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Alerte Facture */}
        {data.unpaidInvoices > 0 && (
          <TouchableOpacity 
            style={styles.alertCard}
            onPress={() => navigation.navigate('InvoicesTab')}
          >
            <View style={styles.alertContent}>
              <Ionicons name="warning" size={24} color={Colors.warning} />
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>
                  {data.unpaidInvoices} facture{data.unpaidInvoices > 1 ? 's' : ''} en attente
                </Text>
                <Text style={styles.alertSubtitle}>
                  Montant total: {data.totalDue.toLocaleString()} FC
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.warning} />
          </TouchableOpacity>
        )}

        {/* Actions Rapides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.quickActions}>
            <QuickAction
              icon="card-outline"
              label="Payer"
              color={Colors.accent}
              onPress={() => navigation.navigate('InvoicesTab')}
            />
            <QuickAction
              icon="flash-outline"
              label="Conso"
              color={Colors.primary}
              onPress={() => navigation.navigate('ConsumptionTab')}
            />
            <QuickAction
              icon="chatbubble-outline"
              label="Support"
              color={Colors.secondary}
              onPress={() => navigation.navigate('SupportTab')}
            />
            <QuickAction
              icon="calendar-outline"
              label="RDV"
              color={Colors.warning}
              onPress={() => navigation.navigate('Appointments')}
            />
          </View>
        </View>

        {/* Statistiques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon compte</Text>
          <View style={styles.statsContainer}>
            <StatCard
              icon="receipt-outline"
              label="Factures impayées"
              value={data.unpaidInvoices}
              color={data.unpaidInvoices > 0 ? Colors.error : Colors.accent}
              onPress={() => navigation.navigate('InvoicesTab')}
            />
            <StatCard
              icon="chatbubbles-outline"
              label="Tickets en cours"
              value={data.pendingTickets}
              color={data.pendingTickets > 0 ? Colors.warning : Colors.accent}
              onPress={() => navigation.navigate('SupportTab')}
            />
          </View>
        </View>

        {/* Prochain RDV */}
        {data.nextAppointment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prochain rendez-vous</Text>
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentIcon}>
                <Ionicons name="calendar" size={24} color={Colors.primary} />
              </View>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentDate}>
                  {new Date(data.nextAppointment.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </Text>
                <Text style={styles.appointmentTime}>
                  à {data.nextAppointment.time} • {data.nextAppointment.agency_name}
                </Text>
              </View>
              <TouchableOpacity style={styles.appointmentAction}>
                <Text style={styles.appointmentActionText}>Voir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Agencies')}
            >
              <Ionicons name="location-outline" size={32} color={Colors.primary} />
              <Text style={styles.serviceLabel}>Trouver{'\n'}une agence</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('ReportOutage')}
            >
              <Ionicons name="flash-off-outline" size={32} color={Colors.error} />
              <Text style={styles.serviceLabel}>Signaler{'\n'}une panne</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Appointments')}
            >
              <Ionicons name="time-outline" size={32} color={Colors.secondary} />
              <Text style={styles.serviceLabel}>Prendre{'\n'}RDV</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.serviceCard}
              onPress={() => navigation.navigate('Contact')}
            >
              <Ionicons name="call-outline" size={32} color={Colors.accent} />
              <Text style={styles.serviceLabel}>Nous{'\n'}contacter</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    alignItems: 'center',
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
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.full,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.warning + '15',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
    marginBottom: Spacing.lg,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  alertText: {
    marginLeft: Spacing.md,
  },
  alertTitle: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  alertSubtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[600],
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  quickActionLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[600],
    textAlign: 'center',
  },
  statsContainer: {
    gap: Spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  statLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
  },
  statValue: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appointmentInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  appointmentDate: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.gray[800],
    textTransform: 'capitalize',
  },
  appointmentTime: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
  },
  appointmentAction: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.md,
  },
  appointmentActionText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[600],
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
