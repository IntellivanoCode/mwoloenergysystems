import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import apiService from '../../services/api';
import { Colors, Spacing, BorderRadius, Fonts } from '../../config/theme';

interface Agency {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  opening_hours: string;
  is_open: boolean;
  distance?: number;
}

export default function AgenciesScreen({ navigation }: any) {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    } catch (error) {
      console.log('Location permission error:', error);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const loadAgencies = async () => {
    try {
      const response = await apiService.getAgencies();
      let agenciesList = response.results || [];

      // Calculer les distances si on a la localisation
      if (userLocation) {
        agenciesList = agenciesList.map((agency: Agency) => ({
          ...agency,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            agency.latitude,
            agency.longitude
          ),
        })).sort((a: Agency, b: Agency) => (a.distance || 0) - (b.distance || 0));
      }

      setAgencies(agenciesList);
    } catch (error) {
      console.error('Error loading agencies:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    loadAgencies();
  }, [userLocation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAgencies();
  }, [userLocation]);

  const openMaps = (agency: Agency) => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const url = Platform.select({
      ios: `${scheme}?q=${agency.latitude},${agency.longitude}`,
      android: `${scheme}${agency.latitude},${agency.longitude}?q=${agency.latitude},${agency.longitude}(${agency.name})`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  const callAgency = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderAgency = ({ item }: { item: Agency }) => (
    <View style={styles.agencyCard}>
      <View style={styles.agencyHeader}>
        <View style={styles.agencyIcon}>
          <Ionicons name="business" size={24} color={Colors.primary} />
        </View>
        <View style={styles.agencyInfo}>
          <Text style={styles.agencyName}>{item.name}</Text>
          <Text style={styles.agencyCity}>{item.city}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.is_open ? Colors.accent + '20' : Colors.gray[200] }]}>
          <View style={[styles.statusDot, { backgroundColor: item.is_open ? Colors.accent : Colors.gray[400] }]} />
          <Text style={[styles.statusText, { color: item.is_open ? Colors.accent : Colors.gray[500] }]}>
            {item.is_open ? 'Ouvert' : 'Fermé'}
          </Text>
        </View>
      </View>

      <View style={styles.agencyDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={Colors.gray[500]} />
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={Colors.gray[500]} />
          <Text style={styles.detailText}>{item.opening_hours || '08h00 - 17h00'}</Text>
        </View>
        {item.distance !== undefined && (
          <View style={styles.detailRow}>
            <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
            <Text style={[styles.detailText, { color: Colors.primary, fontWeight: '500' }]}>
              À {item.distance.toFixed(1)} km
            </Text>
          </View>
        )}
      </View>

      <View style={styles.agencyActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonOutline]}
          onPress={() => callAgency(item.phone)}
        >
          <Ionicons name="call-outline" size={18} color={Colors.primary} />
          <Text style={styles.actionButtonOutlineText}>Appeler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonOutline]}
          onPress={() => openMaps(item)}
        >
          <Ionicons name="navigate-outline" size={18} color={Colors.primary} />
          <Text style={styles.actionButtonOutlineText}>Itinéraire</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={() => navigation.navigate('BookAppointment', { agency: item })}
        >
          <Ionicons name="calendar-outline" size={18} color={Colors.white} />
          <Text style={styles.actionButtonPrimaryText}>RDV</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="business-outline" size={64} color={Colors.gray[300]} />
      <Text style={styles.emptyTitle}>Aucune agence trouvée</Text>
      <Text style={styles.emptyText}>
        Les agences ne sont pas encore disponibles.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Recherche des agences...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nos Agences</Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => navigation.navigate('AgenciesMap', { agencies, userLocation })}
        >
          <Ionicons name="map-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Info localisation */}
      {!userLocation && (
        <TouchableOpacity style={styles.locationBanner} onPress={requestLocationPermission}>
          <Ionicons name="location-outline" size={20} color={Colors.warning} />
          <Text style={styles.locationBannerText}>
            Activez la localisation pour voir les agences proches
          </Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.warning} />
        </TouchableOpacity>
      )}

      {/* Liste des agences */}
      <FlatList
        data={agencies}
        renderItem={renderAgency}
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
  mapButton: {
    padding: Spacing.sm,
    backgroundColor: Colors.primary + '15',
    borderRadius: BorderRadius.lg,
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '15',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  locationBannerText: {
    flex: 1,
    fontSize: Fonts.sizes.sm,
    color: Colors.warning,
  },
  listContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  agencyCard: {
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
  agencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  agencyIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agencyInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  agencyName: {
    fontSize: Fonts.sizes.base,
    fontWeight: '600',
    color: Colors.gray[800],
  },
  agencyCity: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[500],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: Fonts.sizes.xs,
    fontWeight: '500',
  },
  agencyDetails: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.gray[600],
    flex: 1,
  },
  agencyActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    gap: 4,
  },
  actionButtonOutline: {
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  actionButtonOutlineText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.primary,
    fontWeight: '500',
  },
  actionButtonPrimary: {
    backgroundColor: Colors.primary,
  },
  actionButtonPrimaryText: {
    fontSize: Fonts.sizes.sm,
    color: Colors.white,
    fontWeight: '600',
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
