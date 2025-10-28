import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Layout constants for spacing, sizing, and responsive design

export const Layout = {
  // Screen dimensions
  window: {
    width,
    height,
  },

  // Common spacing values
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Border radius values
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Icon sizes
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
    xxl: 48,
  },

  // Font sizes
  fontSize: {
    xs: 10,
    sm: 11,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
  },

  // Card dimensions
  card: {
    padding: 20,
    minHeight: 120,
    gap: 12,
  },

  // Button dimensions
  button: {
    height: 48,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  // Input dimensions
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
  },

  // Tab bar
  tabBar: {
    height: 60,
    paddingBottom: 8,
  },

  // Header
  header: {
    height: 56,
  },

  // Logo
  logo: {
    width: 60,
    height: 60,
  },
};

// Responsive helper functions
export const isSmallDevice = width < 375;
export const isMediumDevice = width >= 375 && width < 414;
export const isLargeDevice = width >= 414;

// Grid helper for resource cards (2x2 grid)
export const getResourceCardWidth = () => {
  const spacing = Layout.spacing.md;
  const horizontalPadding = Layout.spacing.lg * 2;
  return (width - horizontalPadding - spacing) / 2;
};
