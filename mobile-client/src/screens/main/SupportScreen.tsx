import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/api';
import { Colors, Spacing, BorderRadius, Fonts } from '../../config/theme';

interface Ticket {
  id: number;
  ticket_number: string;
  subject: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  open: { label: 'Ouvert', color: Colors.warning },
  in_progress: { label: 'En cours', color: Colors.primary },
  resolved: { label: 'Résolu', color: Colors.accent },
  closed: { label: 'Fermé', color: Colors.gray[500] },
};

const priorityConfig = {
  low: { label: 'Faible', color: Colors.gray[500] },
  medium: { label: 'Moyenne', color: Colors.warning },
  high: { label: 'Haute', color: Colors.error },
};

const categoryConfig: Record<string, string> = {
  billing: 'Facturation',
  technical: 'Technique',
  connection: 'Connexion',
  outage: 'Panne',
  other: 'Autre',
};

export default function SupportScreen({ navigation }: any) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'other',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTickets = async () => {
    try {
      const response = await apiService.getTickets();
      setTickets(response.results || []);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTickets();
  }, []);

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.createTicket(newTicket);
      Alert.alert('Succès', 'Votre ticket a été créé avec succès');
      setShowNewTicketModal(false);
      setNewTicket({ subject: '', description: '', category: 'other' });
      loadTickets();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le ticket. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CategoryButton = ({ value, label }: { value: string; label: string }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        newTicket.category === value && styles.categoryButtonActive,
      ]}
      onPress={() => setNewTicket({ ...newTicket, category: value })}
    >
      <Text
        style={[
          styles.categoryButtonText,
          newTicket.category === value && styles.categoryButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderTicket = ({ item }: { item: Ticket }) => {
    const status = statusConfig[item.status];
    const priority = priorityConfig[item.priority];

    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() => navigation.navigate('TicketDetail', { ticket: item })}
      >
        <View style={styles.ticketHeader}>
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketNumber}>#{item.ticket_number}</Text>
            <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: priority.color + '20' }]}>
            <Ionicons name="flag" size={12} color={priority.color} />
          </View>
        </View>

        <Text style={styles.ticketSubject} numberOfLines={2}>
          {item.subject}
        </Text>

        <View style={styles.ticketFooter}>
          <View style={styles.ticketCategory}>
            <Ionicons name="folder-outline" size={14} color={Colors.gray[500]} />
            <Text style={styles.ticketCategoryText}>
              {categoryConfig[item.category] || item.category}
            </Text>
          </View>
          <Text style={styles.ticketDate}>
            {new Date(item.created_at).toLocaleDateString('fr-FR')}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={64} color={Colors.gray[300]} />
      <Text style={styles.emptyTitle}>Aucun ticket</Text>
      <Text style={styles.emptyText}>
        Vous n'avez pas encore de demande de support
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => setShowNewTicketModal(true)}
      >
        <Ionicons name="add" size={20} color={Colors.white} />
        <Text style={styles.emptyButtonText}>Créer un ticket</Text>
      </TouchableOpacity>
    </View>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support</Text>
        <TouchableOpacity
          style={styles.newTicketButton}
          onPress={() => setShowNewTicketModal(true)}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Liste des tickets */}
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

      {/* Modal nouveau ticket */}
      <Modal
        visible={showNewTicketModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNewTicketModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNewTicketModal(false)}>
              <Text style={styles.modalCancel}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nouveau ticket</Text>
            <TouchableOpacity onPress={handleCreateTicket} disabled={isSubmitting}>
              {isSubmitting ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text style={styles.modalSubmit}>Envoyer</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Catégorie */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Catégorie</Text>
              <View style={styles.categoryGrid}>
                <CategoryButton value="billing" label="Facturation" />
                <CategoryButton value="technical" label="Technique" />
                <CategoryButton value="connection" label="Connexion" />
                <CategoryButton value="outage" label="Panne" />
                <CategoryButton value="other" label="Autre" />
              </View>
            </View>

            {/* Sujet */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Sujet</Text>
              <TextInput
                style={styles.input}
                placeholder="Décrivez brièvement votre problème"
                placeholderTextColor={Colors.gray[400]}
                value={newTicket.subject}
                onChangeText={(text) => setNewTicket({ ...newTicket, subject: text })}
                maxLength={100}
              />
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Décrivez votre problème en détail..."
                placeholderTextColor={Colors.gray[400]}
                value={newTicket.description}
                onChangeText={(text) => setNewTicket({ ...newTicket, description: text })}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Info */}
            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>
                Notre équipe vous répondra dans les plus brefs délais.
                Vous recevrez une notification lorsqu'une réponse sera disponible.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  newTicketButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
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
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ticketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  ticketNumber: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '600',
  },
  priorityBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketSubject: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.gray[800],
    marginBottom: Spacing.sm,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ticketCategoryText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
  },
  ticketDate: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[400],
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
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  emptyButtonText: {
    color: Colors.white,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  modalCancel: {
    fontSize: Fonts.sizes.base,
    color: Colors.gray[600],
  },
  modalTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  modalSubmit: {
    fontSize: Fonts.sizes.base,
    color: Colors.primary,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  formLabel: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: Spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.gray[100],
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[600],
  },
  categoryButtonTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    fontSize: Fonts.sizes.base,
    color: Colors.gray[800],
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  textArea: {
    minHeight: 150,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    lineHeight: 20,
  },
});
