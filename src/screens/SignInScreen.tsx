// SignInScreen - User authentication

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { SignInScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { signIn, resetPassword } from '../services/auth';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { setUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignIn = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const user = await signIn(email.trim(), password);
      // AuthContext will handle user state update via onAuthStateChanged
      navigation.goBack();
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = 'Failed to sign in. Please try again.';

      if (error.message.includes('user-not-found')) {
        errorMessage = 'No account found with this email.';
      } else if (error.message.includes('wrong-password')) {
        errorMessage = 'Incorrect password.';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Invalid email address.';
      } else if (error.message.includes('too-many-requests')) {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.message.includes('not initialized')) {
        errorMessage = 'Firebase is not configured. Please set up Firebase credentials.';
      }

      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address first.');
      return;
    }

    if (!validateEmail(email)) {
      return;
    }

    Alert.alert(
      'Reset Password',
      `Send password reset instructions to ${email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              await resetPassword(email.trim());
              Alert.alert(
                'Email Sent',
                'Password reset instructions have been sent to your email.'
              );
            } catch (error: any) {
              console.error('Reset password error:', error);
              Alert.alert(
                'Error',
                'Failed to send reset email. Please check your email address and try again.'
              );
            }
          },
        },
      ]
    );
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleGuestMode = () => {
    navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: Layout.spacing.lg,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: Layout.spacing.xl,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Layout.spacing.md,
    },
    title: {
      fontSize: Layout.fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: Layout.spacing.xs,
    },
    subtitle: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    form: {
      marginBottom: Layout.spacing.lg,
    },
    inputContainer: {
      marginBottom: Layout.spacing.md,
    },
    passwordInputWrapper: {
      position: 'relative',
    },
    eyeIcon: {
      position: 'absolute',
      right: 12,
      top: 38,
      padding: 8,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginTop: -8,
      marginBottom: Layout.spacing.lg,
    },
    forgotPasswordText: {
      fontSize: Layout.fontSize.sm,
      color: colors.primary,
      fontWeight: '600',
    },
    signInButton: {
      marginBottom: Layout.spacing.md,
    },
    guestButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    guestButtonText: {
      color: colors.textPrimary,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Layout.spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: Layout.spacing.md,
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
    },
    signUpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signUpText: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
    },
    signUpLink: {
      fontSize: Layout.fontSize.md,
      color: colors.primary,
      fontWeight: '600',
      marginLeft: 4,
    },
  });

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to He Reigns Chapel</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <CustomInput
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                }}
                onBlur={() => validateEmail(email)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.passwordInputWrapper}>
                <CustomInput
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  onBlur={() => validatePassword(password)}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  error={passwordError}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <CustomButton
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              disabled={loading}
              style={styles.signInButton}
            />

            <CustomButton
              title="Continue as Guest"
              onPress={handleGuestMode}
              variant="outline"
              style={styles.guestButton}
              textStyle={styles.guestButtonText}
            />
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInScreen;
