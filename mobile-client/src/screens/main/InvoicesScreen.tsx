import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/api';
import { Colors, Spacing, BorderRadius, Fonts } from '../../config/theme';

interface Invoice {
  id: number;
  invoice_number: string;
  period: string;
  amount_due: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
}

const statusConfig = {
  pending: { label: 'En attente', color: Colors.warning, icon: 'time-outline' },
  paid: { label: 'Payée', color: Colors.accent, icon: 'checkmark-circle-outline' },
  overdue: { label: 'En retard', color: Colors.error, icon: 'alert-circle-outline' },
};

export default function InvoicesScreen({ navigation }: any) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');

  const loadInvoices = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await apiService.getInvoices(params);
      setInvoices(response.results || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [filter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadInvoices();
  }, [filter]);

  const FilterButton = ({ value, label }: { value: typeof filter; label: string }) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterButtonText, filter === value && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderInvoice = ({ item }: { item: Invoice }) => {
    const config = statusConfig[item.status];
    const isOverdue = new Date(item.due_date) < new Date() && item.status === 'pending';

    return (
      <TouchableOpacity
        style={styles.invoiceCard}
        onPress={() => navigation.navigate('InvoiceDetail', { invoice: item })}
      >
        <View style={styles.invoiceHeader}>
          <View>
            <Text style={styles.invoiceNumber}>{item.invoice_number}</Text>
            <Text style={styles.invoicePeriod}>{item.period}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: (isOverdue ? Colors.error : config.color) + '20' }]}>
            <Ionicons
              name={isOverdue ? 'alert-circle-outline' : config.icon as any}
              size={14}
              color={isOverdue ? Colors.error : config.color}
            />
            <Text style={[styles.statusText, { color: isOverdue ? Colors.error : config.color }]}>
              {isOverdue ? 'En retard' : config.label}
            </Text>
          </View>
        </View>

        <View style={styles.invoiceBody}>
          <View>
            <Text style={styles.amountLabel}>Montant à payer</Text>
            <Text style={styles.amount}>{item.amount_due.toLocaleString()} FC</Text>
          </View>
          <View style={styles.dueDateContainer}>
            <Ionicons name="calendar-outline" size={16} color={Colors.gray[500]} />
            <Text style={styles.dueDate}>
              {new Date(item.due_date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>
          </View>
        </View>

        {item.status !== 'paid' && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => navigation.navigate('Payment', { invoice: item })}
          >
            <Ionicons name="card-outline" size={18} color={Colors.white} />
            <Text style={styles.payButtonText}>Payer maintenant</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color={Colors.gray[300]} />
      <Text style={styles.emptyTitle}>Aucune facture</Text>
      <Text style={styles.emptyText}>
        {filter === 'all'
          ? 'Vous n\'avez pas encore de factures'
          : `Aucune facture ${statusConfig[filter]?.label.toLowerCase() || ''}`}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement des factures...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calcul des totaux
  const totalPending = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount_due, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Factures</Text>
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Résumé */}
      {totalPending > 0 && (
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Total à payer</Text>
            <Text style={styles.summaryAmount}>{totalPending.toLocaleString()} FC</Text>
          </View>
          <TouchableOpacity style={styles.payAllButton}>
            <Text style={styles.payAllButtonText}>Tout payer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filtres */}
      <View style={styles.filters}>
        <FilterButton value="all" label="Toutes" />
        <FilterButton value="pending" label="En attente" />
        <FilterButton value="paid" label="Payées" />
        <FilterButton value="overdue" label="En retard" />
      </View>

      {/* Liste des factures */}
      <FlatList
        data={invoices}
        renderItem={renderInvoice}
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
  historyButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.lg,
  },
  summaryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  summaryLabel: {
    fontSize: Fonts.sizes.sm,
    color: Colors.white + 'BB',
  },
  summaryAmount: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: Colors.white,
  },
  payAllButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  payAllButtonText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.gray[100],
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[600],
  },
  filterButtonTextActive: {
    color: Colors.white,
    fontWeight: '500',
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  invoiceCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  invoiceNumber: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  invoicePeriod: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '500',
  },
  invoiceBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  amountLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.gray[500],
  },
  amount: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: Colors.gray[800],
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  payButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: Fonts.sizes.base,
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
