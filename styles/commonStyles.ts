
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

export const colors = {
  // Primary palette - Professional blue, white, gray
  background: '#FAFBFC',
  backgroundSecondary: '#F8F9FA',
  text: '#1A202C',
  textSecondary: '#6B7280', // Updated to match requirements
  textTertiary: '#A0AEC0',
  primary: '#0B60D1', // Primary blue as specified
  primaryLight: '#3182CE',
  primaryDark: '#2C5282',
  secondary: '#4A5568',
  accent: '#38A169',
  accentLight: '#48BB78',
  card: '#FFFFFF', // Solid white background
  cardSecondary: '#F7FAFC',
  highlight: '#ED8936',
  border: '#E5E7EB', // Updated to match shadow color
  borderLight: '#EDF2F7',
  error: '#E53E3E',
  errorLight: '#FC8181',
  success: '#19C37D', // Green for promotions
  successLight: '#68D391',
  warning: '#F59E0B', // Orange for orders/shipments
  warningLight: '#F6E05E',
  info: '#0B60D1', // Blue for reminders
  infoLight: '#63B3ED',
  
  // Semantic colors
  delivery: '#19C37D',
  pending: '#C7C7CC',
  completed: '#19C37D',
  cancelled: '#E53E3E',
  
  // Gradients
  primaryGradient: ['#0B60D1', '#3182CE'],
  successGradient: ['#19C37D', '#48BB78'],
  warningGradient: ['#F59E0B', '#F6E05E'],
};

// 8pt spacing scale (4/8/12/16/20/24)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  full: 9999,
};

export const shadows = {
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
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Typography with proper line heights: fontSize * 1.35 (titles) / 1.45 (body)
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 43, // 32 * 1.35
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 38, // 28 * 1.35
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32, // 24 * 1.35
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 27, // 20 * 1.35
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24, // 18 * 1.35
  },
  h6: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22, // 16 * 1.35
  },
  body1: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 23, // 16 * 1.45
  },
  body2: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20, // 14 * 1.45
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 17, // 12 * 1.45
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  primaryLarge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  accent: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  large: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  contentPadded: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  
  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardElevated: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    ...shadows.lg,
  },
  cardFlat: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardCompact: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // Typography
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md, // 12-16dp for section titles
  },
  subtitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.md, // 12-16dp for section titles
  },
  heading: {
    ...typography.h5,
    color: colors.text,
    marginBottom: spacing.sm, // 6-8dp for card body spacing
  },
  text: {
    ...typography.body1,
    color: colors.text,
  },
  textSecondary: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  textTertiary: {
    ...typography.caption,
    color: colors.textTertiary,
  },
  textSmall: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  textBold: {
    fontWeight: '600',
  },
  textCenter: {
    textAlign: 'center',
  },
  
  // Button text styles
  buttonText: {
    ...typography.button,
    color: colors.card,
  },
  buttonTextOutline: {
    ...typography.button,
    color: colors.primary,
  },
  buttonTextGhost: {
    ...typography.button,
    color: colors.primary,
  },
  
  // Input styles
  input: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body1,
    color: colors.text,
    marginVertical: spacing.sm,
  },
  inputFocused: {
    borderColor: colors.primary,
    ...shadows.sm,
  },
  inputError: {
    borderColor: colors.error,
  },
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
  
  // Badges and status indicators
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.card,
  },
  badgeSuccess: {
    backgroundColor: colors.success,
  },
  badgeWarning: {
    backgroundColor: colors.warning,
  },
  badgeError: {
    backgroundColor: colors.error,
  },
  badgeSecondary: {
    backgroundColor: colors.secondary,
  },
  
  // Dividers
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  dividerThick: {
    height: 2,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  
  // Shadows
  shadow: shadows.md,
  shadowSm: shadows.sm,
  shadowLg: shadows.lg,
  shadowXl: shadows.xl,
  
  // Spacing utilities
  mt1: { marginTop: spacing.xs },
  mt2: { marginTop: spacing.sm },
  mt3: { marginTop: spacing.md },
  mt4: { marginTop: spacing.lg },
  mt5: { marginTop: spacing.xl },
  mt6: { marginTop: spacing.xxl },
  
  mb1: { marginBottom: spacing.xs },
  mb2: { marginBottom: spacing.sm },
  mb3: { marginBottom: spacing.md },
  mb4: { marginBottom: spacing.lg },
  mb5: { marginBottom: spacing.xl },
  mb6: { marginBottom: spacing.xxl },
  
  ml1: { marginLeft: spacing.xs },
  ml2: { marginLeft: spacing.sm },
  ml3: { marginLeft: spacing.md },
  ml4: { marginLeft: spacing.lg },
  ml5: { marginLeft: spacing.xl },
  ml6: { marginLeft: spacing.xxl },
  
  mr1: { marginRight: spacing.xs },
  mr2: { marginRight: spacing.sm },
  mr3: { marginRight: spacing.md },
  mr4: { marginRight: spacing.lg },
  mr5: { marginRight: spacing.xl },
  mr6: { marginRight: spacing.xxl },
  
  pt1: { paddingTop: spacing.xs },
  pt2: { paddingTop: spacing.sm },
  pt3: { paddingTop: spacing.md },
  pt4: { paddingTop: spacing.lg },
  pt5: { paddingTop: spacing.xl },
  pt6: { paddingTop: spacing.xxl },
  
  pb1: { paddingBottom: spacing.xs },
  pb2: { paddingBottom: spacing.sm },
  pb3: { paddingBottom: spacing.md },
  pb4: { paddingBottom: spacing.lg },
  pb5: { paddingBottom: spacing.xl },
  pb6: { paddingBottom: spacing.xxl },
  
  pl1: { paddingLeft: spacing.xs },
  pl2: { paddingLeft: spacing.sm },
  pl3: { paddingLeft: spacing.md },
  pl4: { paddingLeft: spacing.lg },
  pl5: { paddingLeft: spacing.xl },
  pl6: { paddingLeft: spacing.xxl },
  
  pr1: { paddingRight: spacing.xs },
  pr2: { paddingRight: spacing.sm },
  pr3: { paddingRight: spacing.md },
  pr4: { paddingRight: spacing.lg },
  pr5: { paddingRight: spacing.xl },
  pr6: { paddingRight: spacing.xxl },
});
