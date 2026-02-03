import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES } from '../../config/theme';

const AgencyLoginScreen: React.FC = () => {
  const { login, loginWithBadge, isLoading } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'badge'>('credentials');
  
  // Credentials login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Badge login
  const [badgeCode, setBadgeCode] = useState('');

  const handleCredentialsLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message || 'Identifiants incorrects');
    }
  };

  const handleBadgeLogin = async () => {
    if (!badgeCode.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer ou scanner votre code badge');
      return;
    }

    try {
      await loginWithBadge(badgeCode);
    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message || 'Code badge invalide');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo et Titre - Design professionnel */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoInner}>
              <Ionicons name="flash" size={45} color={COLORS.white} />
            </View>
          </View>
          <Text style={styles.title}>Mwolo Energy Systems</Text>
          <Text style={styles.subtitle}>Outils Agence</Text>
        </View>

        {/* Toggle entre méthodes de connexion */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              loginMethod === 'credentials' && styles.toggleButtonActive,
            ]}
            onPress={() => setLoginMethod('credentials')}
          >
            <Ionicons
              name="mail"
              size={20}
              color={loginMethod === 'credentials' ? COLORS.white : COLORS.primary}
            />
            <Text
              style={[
                styles.toggleText,
                loginMethod === 'credentials' && styles.toggleTextActive,
              ]}
            >
              Identifiants
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              loginMethod === 'badge' && styles.toggleButtonActive,
            ]}
            onPress={() => setLoginMethod('badge')}
          >
            <Ionicons
              name="card"
              size={20}
              color={loginMethod === 'badge' ? COLORS.white : COLORS.primary}
            />
            <Text
              style={[
                styles.toggleText,
                loginMethod === 'badge' && styles.toggleTextActive,
              ]}
            >
              Badge
            </Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire de connexion */}
        <View style={styles.formContainer}>
          {loginMethod === 'credentials' ? (
            <>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={COLORS.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  placeholderTextColor={COLORS.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleCredentialsLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Se connecter</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.badgeSection}>
                <TouchableOpacity style={styles.scanButton}>
                  <Ionicons name="qr-code" size={60} color={COLORS.primary} />
                  <Text style={styles.scanText}>Scanner le badge</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>— ou —</Text>

                <View style={styles.inputContainer}>
                  <Ionicons name="keypad-outline" size={20} color={COLORS.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Entrer le code badge"
                    placeholderTextColor={COLORS.textLight}
                    value={badgeCode}
                    onChangeText={setBadgeCode}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleBadgeLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.loginButtonText}>Valider</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Mwolo Energy Systems
          </Text>
          <Text style={styles.footerSubtext}>
            Réservé au personnel des agences
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoInner: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 10,
    gap: SPACING.xs,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: COLORS.white,
  },
  formContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    height: 56,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  badgeSection: {
    alignItems: 'center',
  },
  scanButton: {
    alignItems: 'center',
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 16,
    marginBottom: SPACING.md,
    width: '100%',
  },
  scanText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  orText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.md,
    marginVertical: SPACING.md,
  },
  footer: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
  },
  footerSubtext: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
});

export default AgencyLoginScreen;
