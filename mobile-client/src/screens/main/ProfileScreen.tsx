import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius, Fonts } from '../../config/theme';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            await logout();
          },
        },
      ]
    );
  };

  const MenuItem = ({ icon, label, value, onPress, showArrow = true, danger = false }: any) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.menuIcon, danger && { backgroundColor: Colors.error + '15' }]}>
        <Ionicons name={icon} size={20} color={danger ? Colors.error : Colors.primary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, danger && { color: Colors.error }]}>{label}</Text>
        {value && <Text style={styles.menuValue}>{value}</Text>}
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
      )}
    </TouchableOpacity>
  );

  const MenuSection = ({ title, children }: any) => (
    <View style={styles.menuSection}>
      <Text style={styles.menuSectionTitle}>{title}</Text>
      <View style={styles.menuCard}>{children}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon Profil</Text>
        </View>

        {/* Avatar et Infos */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.first_name?.[0]?.toUpperCase() || 'U'}
                {user?.last_name?.[0]?.toUpperCase() || ''}
              </Text>
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={14} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.profileBadge}>
            <Ionicons name="shield-checkmark" size={14} color={Colors.accent} />
            <Text style={styles.profileBadgeText}>Client vérifié</Text>
          </View>
        </View>

        {/* Informations personnelles */}
        <MenuSection title="Informations personnelles">
          <MenuItem
            icon="person-outline"
            label="Nom complet"
            value={`${user?.first_name || ''} ${user?.last_name || ''}`}
            onPress={() => navigation.navigate('EditProfile')}
          />
          <MenuItem
            icon="mail-outline"
            label="Email"
            value={user?.email}
            onPress={() => navigation.navigate('EditEmail')}
          />
          <MenuItem
            icon="call-outline"
            label="Téléphone"
            value={user?.phone || 'Non renseigné'}
            onPress={() => navigation.navigate('EditPhone')}
          />
          <MenuItem
            icon="home-outline"
            label="Adresse"
            value={user?.address || 'Non renseignée'}
            onPress={() => navigation.navigate('EditAddress')}
          />
        </MenuSection>

        {/* Compte */}
        <MenuSection title="Compte">
          <MenuItem
            icon="document-text-outline"
            label="Numéro client"
            value={user?.customer_number || 'N/A'}
            showArrow={false}
          />
          <MenuItem
            icon="flash-outline"
            label="Numéro compteur"
            value={user?.meter_number || 'N/A'}
            showArrow={false}
          />
          <MenuItem
            icon="card-outline"
            label="Moyens de paiement"
            onPress={() => navigation.navigate('PaymentMethods')}
          />
        </MenuSection>

        {/* Paramètres */}
        <MenuSection title="Paramètres">
          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => navigation.navigate('NotificationSettings')}
          />
          <MenuItem
            icon="lock-closed-outline"
            label="Mot de passe"
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <MenuItem
            icon="language-outline"
            label="Langue"
            value="Français"
            onPress={() => navigation.navigate('LanguageSettings')}
          />
        </MenuSection>

        {/* Support */}
        <MenuSection title="Support">
          <MenuItem
            icon="help-circle-outline"
            label="Centre d'aide"
            onPress={() => navigation.navigate('HelpCenter')}
          />
          <MenuItem
            icon="chatbubble-outline"
            label="Nous contacter"
            onPress={() => navigation.navigate('Contact')}
          />
          <MenuItem
            icon="document-outline"
            label="Conditions d'utilisation"
            onPress={() => navigation.navigate('Terms')}
          />
          <MenuItem
            icon="shield-outline"
            label="Politique de confidentialité"
            onPress={() => navigation.navigate('Privacy')}
          />
        </MenuSection>

        {/* Déconnexion */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={Colors.error} />
            ) : (
              <>
                <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                <Text style={styles.logoutText}>Déconnexion</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Version */}
        <Text style={styles.versionText}>Mwolo Energy Systems v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: Colors.gray[800],
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Fonts.sizes['2xl'],
    fontWeight: 'bold',
    color: Colors.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileName: {
    fontSize: Fonts.sizes.xl,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  profileEmail: {
    fontSize: Fonts.sizes.base,
    color: Colors.gray[500],
    marginTop: 2,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
    gap: 4,
  },
  profileBadgeText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.accent,
    fontWeight: '500',
  },
  menuSection: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  menuSectionTitle: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '600',
    color: Colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  menuCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  menuLabel: {
    fontSize: Fonts.sizes.base,
    color: Colors.gray[800],
  },
  menuValue: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error + '10',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[400],
    marginBottom: Spacing.xl,
  },
});
