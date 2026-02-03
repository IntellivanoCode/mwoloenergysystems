/**
 * Mwolo Energy Systems - Prise de RDV sur Place
 * Écran pour la prise de rendez-vous clients en agence
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../config/theme';
import { apiService } from '../../services/api';
import { useAgency } from '../../contexts/AgencyContext';

interface Service {
  id: string;
  name: string;
  code: string;
  duration: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function AppointmentsScreen() {
  const { currentAgency } = useAgency();
  
  // Form state
  const [clientName, setClientName] = useState('');
  const [clientPostName, setClientPostName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Data state
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Service, 2: Date/Time, 3: Client Info, 4: Confirmation

  // Charger les services
  useEffect(() => {
    const loadServices = async () => {
      if (!currentAgency?.id) return;
      
      try {
        const result = await apiService.get<Service[]>(`/agencies/${currentAgency.id}/services/`);
        if (result.data) {
          const data = Array.isArray(result.data) ? result.data : (result.data as any).results || [];
          setServices(data);
        }
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadServices();
  }, [currentAgency?.id]);

  // Charger les créneaux disponibles
  useEffect(() => {
    const loadSlots = async () => {
      if (!currentAgency?.id || !selectedDate) return;
      
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      try {
        const result = await apiService.get<TimeSlot[]>(
          `/operations/appointments/available_slots/?agency=${currentAgency.id}&date=${dateStr}`
        );
        if (result.data) {
          const data = Array.isArray(result.data) ? result.data : (result.data as any).slots || [];
          setAvailableSlots(data);
        }
      } catch (error) {
        console.error('Error loading slots:', error);
        // Générer des créneaux par défaut si l'API ne répond pas
        const defaultSlots: TimeSlot[] = [];
        for (let h = 8; h < 17; h++) {
          defaultSlots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: true });
          defaultSlots.push({ time: `${h.toString().padStart(2, '0')}:30`, available: true });
        }
        setAvailableSlots(defaultSlots);
      }
    };
    
    if (step === 2) {
      loadSlots();
    }
  }, [currentAgency?.id, selectedDate, step]);

  // Générer les 7 prochains jours
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Soumettre le RDV
  const handleSubmit = async () => {
    if (!currentAgency?.id || !selectedService || !selectedTime) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (!clientName.trim() || !clientPostName.trim()) {
      Alert.alert('Erreur', 'Le nom et post-nom sont obligatoires');
      return;
    }

    setSubmitting(true);

    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      
      const result = await apiService.post('/operations/appointments/', {
        agency: currentAgency.id,
        service_type: selectedService.code,
        client_name: `${clientName} ${clientPostName}`,
        client_phone: clientPhone || undefined,
        date: dateStr,
        time_slot: selectedTime,
        is_walk_in: true,
      });

      if (result.data) {
        setStep(4); // Confirmation
      } else {
        Alert.alert('Erreur', result.message || 'Impossible de créer le rendez-vous');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur de connexion au serveur');
    } finally {
      setSubmitting(false);
    }
  };

  // Reset pour nouveau RDV
  const handleReset = () => {
    setClientName('');
    setClientPostName('');
    setClientPhone('');
    setSelectedService(null);
    setSelectedDate(new Date());
    setSelectedTime(null);
    setStep(1);
  };

  if (!currentAgency) {
    return (
      <View style={styles.container}>
        <View style={styles.centerBox}>
          <Ionicons name="warning" size={48} color={theme.colors.warning} />
          <Text style={styles.errorText}>Aucune agence sélectionnée</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="flash" size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Prise de RDV</Text>
            <Text style={styles.headerSubtitle}>{currentAgency.name}</Text>
          </View>
        </View>
        
        {/* Progress */}
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <View 
              key={s} 
              style={[
                styles.progressDot,
                s === step && styles.progressDotActive,
                s < step && styles.progressDotCompleted,
              ]} 
            />
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Step 1: Service */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Quel service ?</Text>
            <Text style={styles.stepSubtitle}>Sélectionnez le type de service souhaité</Text>
            
            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    selectedService?.id === service.id && styles.serviceCardSelected,
                  ]}
                  onPress={() => setSelectedService(service)}
                >
                  <Ionicons 
                    name="flash" 
                    size={32} 
                    color={selectedService?.id === service.id ? '#FFFFFF' : theme.colors.primary} 
                  />
                  <Text style={[
                    styles.serviceName,
                    selectedService?.id === service.id && styles.serviceNameSelected,
                  ]}>
                    {service.name}
                  </Text>
                  <Text style={[
                    styles.serviceDuration,
                    selectedService?.id === service.id && styles.serviceDurationSelected,
                  ]}>
                    ~{service.duration} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.nextButton, !selectedService && styles.nextButtonDisabled]}
              onPress={() => selectedService && setStep(2)}
              disabled={!selectedService}
            >
              <Text style={styles.nextButtonText}>Continuer</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(1)}>
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>

            <Text style={styles.stepTitle}>Quand ?</Text>
            <Text style={styles.stepSubtitle}>Choisissez une date et un créneau</Text>
            
            {/* Dates */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.datesScroll}
            >
              {getNextDays().map((date, index) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                    onPress={() => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                  >
                    <Text style={[styles.dateDayName, isSelected && styles.dateTextSelected]}>
                      {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
                    </Text>
                    <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>
                      {date.getDate()}
                    </Text>
                    <Text style={[styles.dateMonth, isSelected && styles.dateTextSelected]}>
                      {date.toLocaleDateString('fr-FR', { month: 'short' })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Time Slots */}
            <Text style={styles.slotsTitle}>Créneaux disponibles</Text>
            <View style={styles.slotsGrid}>
              {availableSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.slotCard,
                    !slot.available && styles.slotCardDisabled,
                    selectedTime === slot.time && styles.slotCardSelected,
                  ]}
                  onPress={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                >
                  <Text style={[
                    styles.slotTime,
                    !slot.available && styles.slotTimeDisabled,
                    selectedTime === slot.time && styles.slotTimeSelected,
                  ]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.nextButton, !selectedTime && styles.nextButtonDisabled]}
              onPress={() => selectedTime && setStep(3)}
              disabled={!selectedTime}
            >
              <Text style={styles.nextButtonText}>Continuer</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 3: Client Info */}
        {step === 3 && (
          <View style={styles.stepContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => setStep(2)}>
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>

            <Text style={styles.stepTitle}>Informations client</Text>
            <Text style={styles.stepSubtitle}>Renseignez les coordonnées du client</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Nom *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Entrez le nom"
                value={clientName}
                onChangeText={setClientName}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Post-nom *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Entrez le post-nom"
                value={clientPostName}
                onChangeText={setClientPostName}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Téléphone (optionnel)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="+243 XXX XXX XXX"
                value={clientPhone}
                onChangeText={setClientPhone}
                keyboardType="phone-pad"
                placeholderTextColor={theme.colors.textLight}
              />
            </View>

            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Récapitulatif</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service:</Text>
                <Text style={styles.summaryValue}>{selectedService?.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date:</Text>
                <Text style={styles.summaryValue}>
                  {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Heure:</Text>
                <Text style={styles.summaryValue}>{selectedTime}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.nextButton, (!clientName.trim() || !clientPostName.trim()) && styles.nextButtonDisabled]}
              onPress={handleSubmit}
              disabled={!clientName.trim() || !clientPostName.trim() || submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.nextButtonText}>Confirmer le RDV</Text>
                  <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <View style={styles.confirmationBox}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={48} color="#FFFFFF" />
              </View>
              <Text style={styles.confirmationTitle}>RDV Confirmé !</Text>
              <Text style={styles.confirmationSubtitle}>
                {clientName} {clientPostName}
              </Text>
              
              <View style={styles.confirmationDetails}>
                <View style={styles.confirmationRow}>
                  <Ionicons name="flash" size={20} color={theme.colors.primary} />
                  <Text style={styles.confirmationText}>{selectedService?.name}</Text>
                </View>
                <View style={styles.confirmationRow}>
                  <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                  <Text style={styles.confirmationText}>
                    {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </Text>
                </View>
                <View style={styles.confirmationRow}>
                  <Ionicons name="time" size={20} color={theme.colors.primary} />
                  <Text style={styles.confirmationText}>{selectedTime}</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.newButton} onPress={handleReset}>
              <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.newButtonText}>Nouveau rendez-vous</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  progressDotActive: {
    width: 24,
    backgroundColor: theme.colors.primary,
  },
  progressDotCompleted: {
    backgroundColor: theme.colors.success,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginTop: 16,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginTop: 16,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: theme.colors.textLight,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  serviceCardSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  serviceNameSelected: {
    color: '#FFFFFF',
  },
  serviceDuration: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 4,
  },
  serviceDurationSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  datesScroll: {
    marginBottom: 24,
  },
  dateCard: {
    width: 72,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  dateCardSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dateDayName: {
    fontSize: 12,
    color: theme.colors.textLight,
    textTransform: 'uppercase',
  },
  dateDay: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: 4,
  },
  dateMonth: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  slotsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 12,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  slotCard: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  slotCardDisabled: {
    backgroundColor: theme.colors.border,
    opacity: 0.5,
  },
  slotCardSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  slotTime: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  slotTimeDisabled: {
    color: theme.colors.textLight,
  },
  slotTimeSelected: {
    color: '#FFFFFF',
  },
  formGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryCard: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmationBox: {
    alignItems: 'center',
    padding: 24,
  },
  checkCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  confirmationTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  confirmationSubtitle: {
    fontSize: 18,
    color: theme.colors.textLight,
    marginBottom: 24,
  },
  confirmationDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '100%',
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  confirmationText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  newButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});
