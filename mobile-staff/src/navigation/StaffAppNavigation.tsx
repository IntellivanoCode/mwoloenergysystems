import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { StaffAuthProvider, useStaffAuth } from '../contexts/StaffAuthContext';
import { Colors } from '../config/theme';

// Auth Screens
import StaffLoginScreen from '../screens/auth/StaffLoginScreen';

// Main Screens
import StaffDashboardScreen from '../screens/main/StaffDashboardScreen';
import QueueScreen from '../screens/main/QueueScreen';

// Placeholder screens pour les autres onglets
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
    <Ionicons name="construct-outline" size={48} color={Colors.gray[300]} />
    <View style={{ marginTop: 16 }}>
      <Ionicons name="text" size={20} color={Colors.gray[500]} />
    </View>
  </View>
);

const AppointmentsScreen = () => <PlaceholderScreen title="Rendez-vous" />;
const ClientsScreen = () => <PlaceholderScreen title="Clients" />;
const StaffProfileScreen = () => <PlaceholderScreen title="Profil" />;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation principale avec les onglets Staff
function StaffMainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'DashboardTab':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'QueueTab':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'AppointmentsTab':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'ClientsTab':
              iconName = focused ? 'person-circle' : 'person-circle-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray[400],
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray[200],
          paddingTop: 8,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={StaffDashboardScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen
        name="QueueTab"
        component={QueueScreen}
        options={{ tabBarLabel: 'File' }}
      />
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentsScreen}
        options={{ tabBarLabel: 'RDV' }}
      />
      <Tab.Screen
        name="ClientsTab"
        component={ClientsScreen}
        options={{ tabBarLabel: 'Clients' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={StaffProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

// Stack d'authentification Staff
function StaffAuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={StaffLoginScreen} />
    </Stack.Navigator>
  );
}

// Stack principal Staff (après connexion)
function StaffMainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={StaffMainTabs} />
      {/* Écrans supplémentaires accessibles depuis n'importe quel onglet */}
      {/* <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
      <Stack.Screen name="ServeClient" component={ServeClientScreen} />
      <Stack.Screen name="CompleteTicket" component={CompleteTicketScreen} />
      <Stack.Screen name="TransferTicket" component={TransferTicketScreen} />
      <Stack.Screen name="SearchClient" component={SearchClientScreen} />
      <Stack.Screen name="NewClient" component={NewClientScreen} />
      <Stack.Screen name="ClientDetail" component={ClientDetailScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="SupportTickets" component={SupportTicketsScreen} /> */}
    </Stack.Navigator>
  );
}

// Composant de chargement
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

// Root Navigator Staff
function StaffRootNavigator() {
  const { isAuthenticated, isLoading } = useStaffAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <StaffMainStack /> : <StaffAuthStack />}
    </NavigationContainer>
  );
}

// App Navigation Staff avec Provider
export default function StaffAppNavigation() {
  return (
    <StaffAuthProvider>
      <StaffRootNavigator />
    </StaffAuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});
