// ProfileEditScreen - Edit user profile

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ProfileEditScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { updateUser } from '../services/firestore';
import { updateUserProfile, updateUserEmail } from '../services/auth';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const ProfileEditScreen: React.FC<ProfileEditScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, userProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [localPhotoUri, setLocalPhotoUri] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    // Pre-fill with current user data
    if (userProfile) {
      setName(userProfile.name || '');
      setEmail(userProfile.email || '');
      setPhone(userProfile.phone || '');
    }
  }, [userProfile]);

  useEffect(() => {
    // Check if there are any changes
    if (userProfile) {
      const nameChanged = name !== (userProfile.name || '');
      const emailChanged = email !== (userProfile.email || '');
      const phoneChanged = phone !== (userProfile.phone || '');
      setHasChanges(nameChanged || emailChanged || phoneChanged);
    }
  }, [name, email, phone, userProfile]);

  const validateName = (name: string): boolean => {
    if (!name) {
      setNameError('Name is required');
      return false;
    }
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    if (name.trim().length > 50) {
      setNameError('Name must be less than 50 characters');
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

  const validatePhone = (phone: string): boolean => {
    if (phone && phone.length < 10) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleSave = async () => {
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be signed in to edit your profile.');
      return;
    }

    setLoading(true);

    try {
      // Update Firebase Auth profile if name changed
      if (name !== user.displayName) {
        await updateUserProfile(user, { displayName: name.trim() });
      }

      // Update email in Firebase Auth if changed
      if (email !== user.email) {
        try {
          await updateUserEmail(user, email.trim());
          Alert.alert(
            'Email Updated',
            'A verification email has been sent to your new email address. Please verify it.'
          );
        } catch (emailError: any) {
          if (emailError.message.includes('requires-recent-login')) {
            Alert.alert(
              'Re-authentication Required',
              'For security reasons, please sign out and sign in again before changing your email.'
            );
            setLoading(false);
            return;
          }
          throw emailError;
        }
      }

      // Update Firestore user document
      await updateUser(user.uid, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
      });

      Alert.alert('Success', 'Your profile has been updated successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Update profile error:', error);
      let errorMessage = 'Failed to update profile. Please try again.';

      if (error.message.includes('email-already-in-use')) {
        errorMessage = 'This email is already in use by another account.';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Invalid email address.';
      } else if (error.message.includes('not initialized')) {
        errorMessage = 'Firebase is not configured. Please set up Firebase credentials.';
      }

      Alert.alert('Update Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePhoto = () => {
    // TODO: Implement image picker when ready
    Alert.alert(
      'Change Photo',
      'Photo upload will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Password change functionality will be available in a future update. For now, use "Forgot Password" on the sign-in screen.',
      [{ text: 'OK' }]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    keyboardView: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Layout.spacing.lg,
      backgroundColor: colors.backgroundCard,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      marginRight: Layout.spacing.md,
    },
    headerTitle: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    saveButton: {
      paddingHorizontal: Layout.spacing.md,
      paddingVertical: Layout.spacing.sm,
    },
    saveButtonText: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.primary,
    },
    saveButtonDisabled: {
      opacity: 0.5,
    },
    scrollContent: {
      padding: Layout.spacing.lg,
    },
    photoSection: {
      alignItems: 'center',
      marginBottom: Layout.spacing.xl,
    },
    photoContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Layout.spacing.md,
      overflow: 'hidden',
    },
    photo: {
      width: '100%',
      height: '100%',
    },
    photoIcon: {
      // Default icon styling
    },
    changePhotoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Layout.spacing.lg,
      paddingVertical: Layout.spacing.sm,
      backgroundColor: `${colors.primary}20`,
      borderRadius: Layout.borderRadius.md,
    },
    changePhotoText: {
      fontSize: Layout.fontSize.sm,
      fontWeight: '600',
      color: colors.primary,
      marginLeft: Layout.spacing.sm,
    },
    form: {
      marginBottom: Layout.spacing.lg,
    },
    inputContainer: {
      marginBottom: Layout.spacing.lg,
    },
    changePasswordButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: Layout.spacing.md,
    },
    changePasswordLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    changePasswordIcon: {
      marginRight: Layout.spacing.md,
    },
    changePasswordText: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    noteText: {
      fontSize: Layout.fontSize.xs,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: Layout.spacing.lg,
      lineHeight: 18,
    },
  });

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="person-circle-outline" size={64} color={colors.textSecondary} />
        <Text style={{ color: colors.textPrimary, marginTop: Layout.spacing.md }}>
          Please sign in to edit your profile
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <TouchableOpacity
          onPress={handleSave}
          disabled={!hasChanges || loading}
          style={[styles.saveButton, (!hasChanges || loading) && styles.saveButtonDisabled]}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              {user.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.photo} />
              ) : (
                <Ionicons name="person" size={60} color="#FFFFFF" style={styles.photoIcon} />
              )}
            </View>
            <TouchableOpacity onPress={handleChangePhoto} style={styles.changePhotoButton}>
              <Ionicons name="camera" size={18} color={colors.primary} />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <CustomInput
                label="Full Name"
                value={name}
                onChangeText={setName}
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
                onChangeText={setEmail}
                onBlur={() => validateEmail(email)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
              />
              {email !== user.email && (
                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
                  You'll need to verify your new email address
                </Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomInput
                label="Phone Number (Optional)"
                value={phone}
                onChangeText={setPhone}
                onBlur={() => validatePhone(phone)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                error={phoneError}
              />
            </View>

            <TouchableOpacity
              onPress={handleChangePassword}
              style={styles.changePasswordButton}
            >
              <View style={styles.changePasswordLeft}>
                <Ionicons
                  name="lock-closed"
                  size={20}
                  color={colors.textPrimary}
                  style={styles.changePasswordIcon}
                />
                <Text style={styles.changePasswordText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.noteText}>
            For security reasons, you may need to sign in again after changing your email or password.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileEditScreen;
