// SignUpScreen - User registration

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
import { SignUpScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { signUp } from '../services/auth';
import { createUser } from '../services/firestore';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateName = (name: string): boolean => {
    if (!name) {
      setNameError('Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    setNameError('');
    return true;
  };

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

  const validateConfirmPassword = (confirmPassword: string): boolean => {
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSignUp = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      // Create Firebase Auth user
      const user = await signUp(email.trim(), password, name.trim());

      // Create Firestore user document
      try {
        await createUser(user.uid, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null, // Store phone number if provided
        });
      } catch (firestoreError) {
        console.error('Failed to create user document:', firestoreError);
        // User is created in Auth, but Firestore doc failed
        // AuthContext will handle creating the doc on next login
      }

      Alert.alert(
        'Account Created',
        'Your account has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Sign up error:', error);
      let errorMessage = 'Failed to create account. Please try again.';

      if (error.message.includes('email-already-in-use')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Invalid email address.';
      } else if (error.message.includes('weak-password')) {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error.message.includes('not initialized')) {
        errorMessage = 'Firebase is not configured. Please set up Firebase credentials.';
      }

      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
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
    signUpButton: {
      marginTop: Layout.spacing.md,
    },
    termsText: {
      fontSize: Layout.fontSize.xs,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
      marginTop: Layout.spacing.md,
    },
    termsLink: {
      color: colors.primary,
      fontWeight: '600',
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
    signInContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signInText: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
    },
    signInLink: {
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
              <Ionicons name="person-add" size={40} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join He Reigns Chapel community</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <CustomInput
                label="Full Name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setNameError('');
                }}
                onBlur={() => validateName(name)}
                placeholder="Enter your full name"
                autoCapitalize="words"
                error={nameError}
              />
            </View>

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
                    if (confirmPassword) {
                      validateConfirmPassword(confirmPassword);
                    }
                  }}
                  onBlur={() => validatePassword(password)}
                  placeholder="Create a password"
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

            <View style={styles.inputContainer}>
              <View style={styles.passwordInputWrapper}>
                <CustomInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError('');
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                  placeholder="Re-enter your password"
                  secureTextEntry={!showConfirmPassword}
                  error={confirmPasswordError}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <CustomButton
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              disabled={loading}
              style={styles.signUpButton}
            />

            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
