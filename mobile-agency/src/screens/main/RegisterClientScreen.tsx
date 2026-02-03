import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { clientAPI } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { Colors, Spacing, BorderRadius, Fonts, Shadows } from '../../config/theme';

export default function RegisterClientScreen({ navigation }: any) {
  const { agency } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    post_name: '',
    email: '',
    phone: '',
    address: '',
    nif: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const clientData = {
        ...formData,
        agency: agency?.id,
        status: 'prospect',
      };

      const response = await clientAPI.create(clientData);
      
      Alert.alert(
        'Client enregistré !',
        `${formData.first_name} ${formData.last_name} ${formData.post_name} a été ajouté avec succès.`,
        [
          { text: 'Nouveau client', onPress: () => resetForm() },
          { text: 'Voir le client', onPress: () => navigation.navigate('ClientDetails', { clientId: response.data.id }) },
        ]
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.email?.[0] || 
                          error.response?.data?.detail ||
                          'Erreur lors de l\'enregistrement';
      Alert.alert('Erreur', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      post_name: '',
      email: '',
      phone: '',
      address: '',
      nif: '',
    });
    setErrors({});
  };

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
        <Text style={styles.headerTitle}>Inscription Client</Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.info} />
            <Text style={styles.infoText}>
              Le client sera automatiquement ajouté à la base de données et pourra ensuite activer ses services à l'agence.
            </Text>
          </View>

          {/* Formulaire */}
          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Identité</Text>

            {/* Prénom */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Prénom *</Text>
              <View style={[styles.inputContainer, errors.first_name && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="Prénom du client"
                  placeholderTextColor={Colors.gray[400]}
                  value={formData.first_name}
                  onChangeText={(v) => updateField('first_name', v)}
                />
              </View>
              {errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
            </View>

            {/* Nom */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nom *</Text>
              <View style={[styles.inputContainer, errors.last_name && styles.inputError]}>
                <TextInput
                  style={styles.input}
                  placeholder="Nom du client"
                  placeholderTextColor={Colors.gray[400]}
                  value={formData.last_name}
                  onChangeText={(v) => updateField('last_name', v)}
                />
              </View>
              {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
            </View>

            {/* Post-nom */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Post-nom</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Post-nom du client (optionnel)"
                  placeholderTextColor={Colors.gray[400]}
                  value={formData.post_name}
                  onChangeText={(v) => updateField('post_name', v)}
                />
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Contact</Text>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <View style={[styles.inputContainer, errors.email && styles.inputError]}>
                <Ionicons name="mail-outline" size={20} color={Colors.gray[400]} />
                <TextInput
                  style={styles.input}
                  placeholder="email@exemple.com"
                  placeholderTextColor={Colors.gray[400]}
                  value={formData.email}
                  onChangeText={(v) => updateField('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Téléphone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Téléphone *</Text>
              <View style={[styles.inputContainer, errors.phone && styles.inputError]}>
                <Ionicons name="call-outline" size={20} color={Colors.gray[400]} />
                <TextInput
                  style={styles.input}
                  placeholder="+243 ..."
                  placeholderTextColor={Colors.gray[400]}
                  value={formData.phone}
                  onChangeText={(v) => updateField('phone', v)}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            {/* Adresse */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adresse</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color={Colors.gray[400]} />
                <TextInput
                  style={styles.input}
                  placeholder="Adresse du client"
                  placeholderTextColor={Colors.gray[400]}
                  value={formData.address}
                  onChangeText={(v) => updateField('address', v)}
                />
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Informations fiscales</Text>

            {/* NIF */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NIF (Numéro d'Identification Fiscale)</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="document-text-outline" size={20} color={Colors.gray[400]} />
                <TextInput
                  style={styles.input}
                  placeholder="NIF (optionnel)"
                  placeholderTextColor={Colors.gray[400]}
                  value={formData.nif}
                  onChangeText={(v) => updateField('nif', v)}
                />
              </View>
            </View>
          </View>

          {/* Boutons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetForm}
            >
              <Ionicons name="refresh-outline" size={20} color={Colors.gray[600]} />
              <Text style={styles.resetButtonText}>Réinitialiser</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="person-add-outline" size={20} color={Colors.white} />
                  <Text style={styles.submitButtonText}>Enregistrer</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  headerRight: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.info + '15',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: Fonts.sizes.sm,
    color: Colors.info,
    lineHeight: 20,
  },
  form: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Fonts.sizes.sm,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    gap: Spacing.sm,
  },
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: Fonts.sizes.md,
    color: Colors.text,
  },
  errorText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  resetButtonText: {
    color: Colors.gray[600],
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.md,
    fontWeight: '600',
  },
});
