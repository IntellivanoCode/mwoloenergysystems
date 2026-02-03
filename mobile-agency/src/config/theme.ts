// Theme Configuration pour l'application Agency Mwolo Energy Systems
// THEME UNIFIÉ - Cohérent avec toutes les applications web et mobile

export const Colors = {
  // Primaires - Cyan/Bleu électrique (unifié)
  primary: '#0EA5E9', // Cyan - couleur principale Mwolo
  primaryDark: '#0284C7',
  primaryLight: '#38BDF8',
  
  // Secondaires
  secondary: '#6366F1', // Indigo
  secondaryDark: '#4F46E5',
  secondaryLight: '#818CF8',
  
  // Accents
  accent: '#10B981', // Vert émeraude
  accentDark: '#059669',
  accentLight: '#34D399',
  
  // Statuts
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Queue statuts
  queue: {
    waiting: '#F59E0B',    // Orange
    serving: '#3B82F6',    // Bleu
    completed: '#22C55E',  // Vert
    cancelled: '#EF4444',  // Rouge
    noShow: '#6B7280',     // Gris
  },
  
  // Neutres
  white: '#FFFFFF',
  black: '#000000',
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
  
  // Backgrounds - UNIFIÉ avec les autres apps
  background: '#F0F9FF', // Bleu très clair (comme mobile-client)
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

export const Fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
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

// Badge couleurs par type
export const BadgeColors = {
  admin: { bg: '#7C3AED', text: '#FFFFFF' },
  manager: { bg: '#059669', text: '#FFFFFF' },
  cashier: { bg: '#0EA5E9', text: '#FFFFFF' },
  technician: { bg: '#F59E0B', text: '#000000' },
  support: { bg: '#EC4899', text: '#FFFFFF' },
};

// Priorité tickets
export const PriorityColors = {
  low: '#22C55E',
  normal: '#3B82F6',
  high: '#F59E0B',
  urgent: '#EF4444',
};

// Alias en majuscules pour compatibilité
export const COLORS = {
  primary: Colors.primary,
  primaryDark: Colors.primaryDark,
  primaryLight: Colors.primaryLight,
  secondary: Colors.secondary,
  accent: Colors.accent,
  success: Colors.success,
  warning: Colors.warning,
  error: Colors.error,
  info: Colors.info,
  white: Colors.white,
  black: Colors.black,
  background: Colors.background,
  surface: Colors.surface,
  card: Colors.card,
  text: Colors.text,
  textSecondary: Colors.textSecondary,
  textLight: Colors.textLight,
};

export const SPACING = {
  xs: Spacing.xs,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
  xl: Spacing.xl,
};

export const FONT_SIZES = {
  xs: Fonts.sizes.xs,
  sm: Fonts.sizes.sm,
  md: Fonts.sizes.md,
  lg: Fonts.sizes.lg,
  xl: Fonts.sizes.xl,
  xxl: Fonts.sizes['2xl'],
};
