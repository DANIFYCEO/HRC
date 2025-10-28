// SettingsRow - Reusable settings list item

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Switch,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Layout } from '../constants/Layout';

interface SettingsRowProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  style?: ViewStyle;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  showArrow = true,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  style,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.backgroundCard,
      padding: Layout.spacing.lg,
      borderRadius: Layout.borderRadius.md,
      marginBottom: Layout.spacing.sm,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: `${colors.primary}20`,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Layout.spacing.md,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    subtitle: {
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
    },
    value: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
      marginRight: Layout.spacing.sm,
    },
    rightContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });

  const content = (
    <>
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.rightContent}>
        {value && <Text style={styles.value}>{value}</Text>}
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        ) : (
          showArrow && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        )}
      </View>
    </>
  );

  if (onPress && !showSwitch) {
    return (
      <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
};

export default SettingsRow;
