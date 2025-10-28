// CustomInput - Reusable text input component

import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Layout } from '../constants/Layout';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: Layout.spacing.lg,
    },
    label: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: Layout.spacing.sm,
    },
    input: {
      height: Layout.input.height,
      borderRadius: Layout.input.borderRadius,
      paddingHorizontal: Layout.input.paddingHorizontal,
      backgroundColor: colors.backgroundCard,
      borderWidth: 1,
      borderColor: colors.border,
      fontSize: Layout.fontSize.md,
      color: colors.textPrimary,
    },
    inputError: {
      borderColor: colors.error,
    },
    inputMultiline: {
      height: 'auto',
      minHeight: 120,
      paddingVertical: Layout.spacing.md,
      textAlignVertical: 'top',
    },
    errorText: {
      fontSize: Layout.fontSize.sm,
      color: colors.error,
      marginTop: Layout.spacing.xs,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          props.multiline && styles.inputMultiline,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default CustomInput;
