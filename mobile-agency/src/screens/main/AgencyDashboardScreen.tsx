import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useAgency } from '../../contexts/AgencyContext';
import { Colors, Spacing, BorderRadius, Fonts, Shadows } from '../../config/theme';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  screen: string;
  badge?: number;
}

export default function AgencyDashboardScreen({ navigation }: any) {
  const { user, agency, logout } = useAuth();
  const { queueStats, refreshStats } = useAgency();
  const [refreshing, setRefreshing] = useState(false);

  const tools: ToolItem[] = [
    {
      id: 'kiosk',
      name: 'Borne Ticket',
      description: 'Distribution de tickets file d\'attente',
      icon: 'ticket-outline',
      color: '#F59E0B',
      screen: 'Kiosk',
    },
    {
      id: 'monitor',
      name: 'Moniteur File',
      description: 'Affichage des tickets appelés',
      icon: 'tv-outline',
      color: '#8B5CF6',
      screen: 'Monitor',
    },
    {
      id: 'counter',
      name: 'Guichet Agent',
      description: 'Interface agent de guichet',
      icon: 'desktop-outline',
      color: '#3B82F6',
      screen: 'Counter',
      badge: queueStats?.waiting || 0,
    },
    {
      id: 'appointments',
      name: 'RDV sur Place',
      description: 'Prise de rendez-vous client',
      icon: 'calendar-outline',
      color: '#10B981',
      screen: 'Appointments',
    },
    {
      id: 'register-client',
      name: 'Inscription Client',
      description: 'Enregistrer un nouveau client',
      icon: 'person-add-outline',
      color: '#059669',
      screen: 'RegisterClient',
    },
    {
      id: 'clients',
      name: 'Clients',
      description: 'Recherche et gestion clients',
      icon: 'people-outline',
      color: '#EC4899',
      screen: 'Clients',
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshStats();
    setRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
    }, 30000); // Rafraîchir toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.agencyName}>{agency?.name || 'Agence'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {/* Stats rapides */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: Colors.queue.waiting + '20' }]}>
          <Ionicons name="time-outline" size={24} color={Colors.queue.waiting} />
          <Text style={[styles.statNumber, { color: Colors.queue.waiting }]}>
            {queueStats?.waiting || 0}
          </Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.queue.serving + '20' }]}>
          <Ionicons name="person-outline" size={24} color={Colors.queue.serving} />
          <Text style={[styles.statNumber, { color: Colors.queue.serving }]}>
            {queueStats?.serving || 0}
          </Text>
          <Text style={styles.statLabel}>En service</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.queue.completed + '20' }]}>
          <Ionicons name="checkmark-circle-outline" size={24} color={Colors.queue.completed} />
          <Text style={[styles.statNumber, { color: Colors.queue.completed }]}>
            {queueStats?.completed_today || 0}
          </Text>
          <Text style={styles.statLabel}>Terminés</Text>
        </View>
      </View>

      {/* Outils */}
      <ScrollView
        style={styles.toolsScroll}
        contentContainerStyle={styles.toolsContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Outils Agence</Text>
        
        <View style={styles.toolsGrid}>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={() => navigation.navigate(tool.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.toolIcon, { backgroundColor: tool.color + '20' }]}>
                <Ionicons name={tool.icon} size={28} color={tool.color} />
                {tool.badge !== undefined && tool.badge > 0 && (
                  <View style={styles.toolBadge}>
                    <Text style={styles.toolBadgeText}>{tool.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.toolName}>{tool.name}</Text>
              <Text style={styles.toolDesc}>{tool.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 Mwolo Energy Systems</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: BorderRadius['2xl'],
    borderBottomRightRadius: BorderRadius['2xl'],
    ...Shadows.md,
  },
  greeting: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textSecondary,
  },
  userName: {
    fontSize: Fonts.sizes.xl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  agencyName: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.error + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  toolsScroll: {
    flex: 1,
  },
  toolsContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  toolCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  toolIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  toolBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.error,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  toolBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  toolName: {
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  toolDesc: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  footer: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  footerText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.gray[400],
  },
});
