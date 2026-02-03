import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { queueAPI, serviceAPI } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { useAgency } from '../../contexts/AgencyContext';
import { Colors, Spacing, BorderRadius, Fonts, Shadows } from '../../config/theme';

interface Service {
  id: string;
  name: string;
  code: string;
  icon?: string;
  color?: string;
}

export default function KioskScreen({ navigation }: any) {
  const { agency } = useAuth();
  const { refreshStats } = useAgency();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await serviceAPI.list();
      setServices(response.data.results || response.data || []);
    } catch (error) {
      console.error('Erreur chargement services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = async (service: Service) => {
    if (!agency) {
      Alert.alert('Erreur', 'Aucune agence sélectionnée');
      return;
    }

    setIsCreating(true);
    try {
      const response = await queueAPI.createTicket({
        agency: agency.id,
        service_type: service.code,
        priority: 'normal',
      });

      const ticket = response.data;
      
      Alert.alert(
        'Ticket créé !',
        `Votre numéro est le ${ticket.ticket_number}\n\nService: ${service.name}\n\nVeuillez patienter, vous serez appelé.`,
        [{ text: 'OK', onPress: () => refreshStats() }]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.response?.data?.detail || 'Impossible de créer le ticket'
      );
    } finally {
      setIsCreating(false);
    }
  };

  const getServiceIcon = (service: Service): keyof typeof Ionicons.glyphMap => {
    const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
      'paiement': 'card-outline',
      'payment': 'card-outline',
      'inscription': 'person-add-outline',
      'registration': 'person-add-outline',
      'reclamation': 'chatbox-ellipses-outline',
      'complaint': 'chatbox-ellipses-outline',
      'information': 'information-circle-outline',
      'info': 'information-circle-outline',
      'technique': 'build-outline',
      'technical': 'build-outline',
      'abonnement': 'document-text-outline',
      'subscription': 'document-text-outline',
    };
    
    const code = service.code?.toLowerCase() || '';
    return iconMap[code] || 'flash-outline';
  };

  const getServiceColor = (index: number): string => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EC4899',
      '#8B5CF6', '#0EA5E9', '#EF4444', '#6366F1',
    ];
    return colors[index % colors.length];
  };

  const renderService = ({ item, index }: { item: Service; index: number }) => {
    const color = item.color || getServiceColor(index);
    
    return (
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => handleServiceSelect(item)}
        disabled={isCreating}
        activeOpacity={0.8}
      >
        <View style={[styles.serviceIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={getServiceIcon(item)} size={40} color={color} />
        </View>
        <Text style={styles.serviceName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement des services...</Text>
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
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.logoSmall}>
            <Ionicons name="flash" size={24} color={Colors.white} />
          </View>
          <Text style={styles.headerTitle}>Mwolo Energy Systems</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.welcomeTitle}>Bienvenue !</Text>
        <Text style={styles.welcomeSubtitle}>
          Sélectionnez le service souhaité pour obtenir un ticket
        </Text>

        {isCreating && (
          <View style={styles.creatingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.creatingText}>Création du ticket...</Text>
          </View>
        )}

        <FlatList
          data={services}
          renderItem={renderService}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.servicesGrid}
          columnWrapperStyle={styles.servicesRow}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {agency?.name || 'Agence'}
        </Text>
        <Text style={styles.footerSubtext}>© 2026 Mwolo Energy Systems</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontSize: Fonts.sizes.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoSmall: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing.xl,
  },
  welcomeTitle: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: Fonts.sizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  creatingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'],
  },
  creatingText: {
    marginTop: Spacing.md,
    fontSize: Fonts.sizes.lg,
    color: Colors.primary,
    fontWeight: '600',
  },
  servicesGrid: {
    paddingBottom: Spacing['2xl'],
  },
  servicesRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  serviceCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    ...Shadows.md,
  },
  serviceIcon: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  serviceName: {
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    color: Colors.primary,
  },
  footerSubtext: {
    fontSize: Fonts.sizes.xs,
    color: Colors.gray[400],
    marginTop: 4,
  },
});
