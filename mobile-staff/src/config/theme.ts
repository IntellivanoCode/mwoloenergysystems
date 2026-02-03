// Theme Configuration pour l'application Staff Mwolo Energy Systems

export const Colors = {
  // Couleur principale - Bleu professionnel
  primary: '#1E40AF', // Bleu foncé (différent de l'app client)
  primaryLight: '#3B82F6',
  primaryDark: '#1E3A8A',
  
  // Couleurs secondaires
  secondary: '#0EA5E9', // Cyan (cohérent avec la marque)
  accent: '#10B981', // Vert succès
  
  // États
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Nuances de gris
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Couleurs basiques
  white: '#FFFFFF',
  black: '#000000',
  background: '#F3F4F6',
  
  // Couleurs de statut pour les tickets/RDV
  status: {
    waiting: '#F59E0B',    // En attente - Jaune
    inProgress: '#3B82F6', // En cours - Bleu
    completed: '#10B981',  // Terminé - Vert
    cancelled: '#EF4444',  // Annulé - Rouge
    noShow: '#6B7280',     // Absent - Gris
  },
  
  // Couleurs de priorité
  priority: {
    low: '#6B7280',
    medium: '#F59E0B',
    high: '#EF4444',
    urgent: '#DC2626',
  },
};

export const Fonts = {
  sizes: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  weights: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export default { Colors, Fonts, Spacing, BorderRadius, Shadows };
