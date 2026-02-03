import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../config/theme';

// Screens
import AgencyLoginScreen from '../screens/auth/AgencyLoginScreen';
import AgencyDashboardScreen from '../screens/main/AgencyDashboardScreen';
import KioskScreen from '../screens/main/KioskScreen';
import CounterScreen from '../screens/main/CounterScreen';
import RegisterClientScreen from '../screens/main/RegisterClientScreen';
import MonitorScreen from '../screens/main/MonitorScreen';
import AppointmentsScreen from '../screens/main/AppointmentsScreen';

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>Chargement...</Text>
    </View>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={AgencyLoginScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={AgencyDashboardScreen} />
      <Stack.Screen name="Kiosk" component={KioskScreen} />
      <Stack.Screen name="Counter" component={CounterScreen} />
      <Stack.Screen name="RegisterClient" component={RegisterClientScreen} />
      <Stack.Screen name="Monitor" component={MonitorScreen} />
      <Stack.Screen name="Appointments" component={AppointmentsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
  },
});
