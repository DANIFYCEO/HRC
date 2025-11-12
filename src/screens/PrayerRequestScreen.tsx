// PrayerRequestScreen - Submit prayer requests via WhatsApp

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { PrayerRequestScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { sendPrayerRequest } from '../utils/whatsapp';
import { savePrayerRequest } from '../services/firestore';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const PrayerRequestScreen: React.FC<PrayerRequestScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, isGuest } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [request, setRequest] = useState('');
  const [contact, setContact] = useState('');
  const [urgency, setUrgency] = useState<'routine' | 'urgent'>('routine');
  const [method, setMethod] = useState<'firebase' | 'whatsapp' | 'both'>('whatsapp');
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    request: '',
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: Layout.spacing.lg,
    },
    infoBanner: {
      backgroundColor: `${colors.primary}20`,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.lg,
      marginBottom: Layout.spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
    },
    infoIcon: {
      marginRight: Layout.spacing.md,
    },
    infoText: {
      flex: 1,
      fontSize: Layout.fontSize.md,
      color: colors.textPrimary,
      lineHeight: 20,
    },
    sectionTitle: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: Layout.spacing.md,
    },
    urgencyContainer: {
      marginBottom: Layout.spacing.lg,
    },
    urgencyOptions: {
      flexDirection: 'row',
      gap: Layout.spacing.md,
    },
    urgencyOption: {
      flex: 1,
      padding: Layout.spacing.lg,
      borderRadius: Layout.borderRadius.md,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
    },
    urgencyOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}10`,
    },
    urgencyLabel: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.textSecondary,
      marginTop: Layout.spacing.sm,
    },
    urgencyLabelSelected: {
      color: colors.primary,
    },
    submitButton: {
      marginTop: Layout.spacing.md,
      marginBottom: Layout.spacing.xxl,
    },
    methodContainer: {
      marginBottom: Layout.spacing.lg,
    },
    methodOptions: {
      flexDirection: 'row',
      gap: Layout.spacing.sm,
    },
    methodOption: {
      flex: 1,
      padding: Layout.spacing.md,
      borderRadius: Layout.borderRadius.md,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
    },
    methodOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}10`,
    },
    methodIcon: {
      marginBottom: Layout.spacing.sm,
    },
    methodLabel: {
      fontSize: Layout.fontSize.sm,
      fontWeight: '600',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    methodLabelSelected: {
      color: colors.primary,
    },
  });

  const validate = (): boolean => {
    const newErrors = {
      name: '',
      request: '',
    };

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Validate request
    if (!request.trim()) {
      newErrors.request = 'Prayer request is required';
    } else if (request.trim().length < 10) {
      newErrors.request = 'Prayer request must be at least 10 characters';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.request;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Save to Firebase if selected
      if (method === 'firebase' || method === 'both') {
        if (isGuest) {
          Alert.alert('Sign In Required', 'Please sign in to save prayer requests to your account.');
          setLoading(false);
          return;
        }

        await savePrayerRequest({
          name: name.trim(),
          request: request.trim(),
          contact: contact.trim() || null,
          urgency,
          userId: user!.uid,
          createdAt: new Date(),
          status: 'pending'
        });
      }

      // Send via WhatsApp if selected
      if (method === 'whatsapp' || method === 'both') {
        await sendPrayerRequest(
          name.trim(),
          request.trim(),
          contact.trim() || undefined,
          urgency
        );
      }

      // Success message based on method
      let message;
      switch (method) {
        case 'firebase':
          message = 'Prayer request saved successfully to your account.';
          break;
        case 'whatsapp':
          message = 'Prayer request sent to Pastor via WhatsApp successfully.';
          break;
        case 'both':
          message = 'Prayer request saved and sent to Pastor via WhatsApp successfully.';
          break;
      }

      Alert.alert('Success', message, [
        {
          text: 'Done',
          onPress: () => {
            // Clear form
            setName('');
            setRequest('');
            setContact('');
            setUrgency('routine');
            setMethod('whatsapp');
            // Navigate back
            navigation.goBack();
          },
        },
      ]);

    } catch (error: any) {
      console.error('Prayer request error:', error);
      Alert.alert(
        'Error',
        'Failed to submit prayer request. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Information Banner */}
        <View style={styles.infoBanner}>
          <Ionicons
            name="heart-outline"
            size={24}
            color={colors.primary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText}>
            Share your prayer request with Pastor. Choose how you'd like to submit it below.
          </Text>
        </View>

        {/* Form Fields */}
        <CustomInput
          label="Your Name *"
          placeholder="Enter your name"
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          error={errors.name}
          autoCapitalize="words"
        />

        <CustomInput
          label="Prayer Request *"
          placeholder="Share your prayer request..."
          value={request}
          onChangeText={(text) => {
            setRequest(text);
            if (errors.request) setErrors({ ...errors, request: '' });
          }}
          error={errors.request}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />

        <CustomInput
          label="Contact Information (Optional)"
          placeholder="Phone or email (optional)"
          value={contact}
          onChangeText={setContact}
          autoCapitalize="none"
        />

        {/* Urgency Selection */}
        <View style={styles.urgencyContainer}>
          <Text style={styles.sectionTitle}>Urgency Level</Text>
          <View style={styles.urgencyOptions}>
            <TouchableOpacity
              style={[
                styles.urgencyOption,
                urgency === 'routine' && styles.urgencyOptionSelected,
              ]}
              onPress={() => setUrgency('routine')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="time-outline"
                size={32}
                color={urgency === 'routine' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.urgencyLabel,
                  urgency === 'routine' && styles.urgencyLabelSelected,
                ]}
              >
                Routine
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.urgencyOption,
                urgency === 'urgent' && styles.urgencyOptionSelected,
              ]}
              onPress={() => setUrgency('urgent')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="alert-circle-outline"
                size={32}
                color={urgency === 'urgent' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.urgencyLabel,
                  urgency === 'urgent' && styles.urgencyLabelSelected,
                ]}
              >
                Urgent
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submission Method Selection */}
        <View style={styles.methodContainer}>
          <Text style={styles.sectionTitle}>How to Submit</Text>
          <View style={styles.methodOptions}>
            <TouchableOpacity
              style={[
                styles.methodOption,
                method === 'firebase' && styles.methodOptionSelected,
              ]}
              onPress={() => setMethod('firebase')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="cloud-upload"
                size={24}
                color={method === 'firebase' ? colors.primary : colors.textSecondary}
                style={styles.methodIcon}
              />
              <Text
                style={[
                  styles.methodLabel,
                  method === 'firebase' && styles.methodLabelSelected,
                ]}
              >
                Save in App
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodOption,
                method === 'whatsapp' && styles.methodOptionSelected,
              ]}
              onPress={() => setMethod('whatsapp')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="logo-whatsapp"
                size={24}
                color={method === 'whatsapp' ? colors.primary : colors.textSecondary}
                style={styles.methodIcon}
              />
              <Text
                style={[
                  styles.methodLabel,
                  method === 'whatsapp' && styles.methodLabelSelected,
                ]}
              >
                Send to Pastor
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.methodOption,
                method === 'both' && styles.methodOptionSelected,
              ]}
              onPress={() => setMethod('both')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="checkmark-done"
                size={24}
                color={method === 'both' ? colors.primary : colors.textSecondary}
                style={styles.methodIcon}
              />
              <Text
                style={[
                  styles.methodLabel,
                  method === 'both' && styles.methodLabelSelected,
                ]}
              >
                Both
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <CustomButton
          title={
            method === 'firebase'
              ? 'Save Prayer Request'
              : method === 'whatsapp'
              ? 'Send to Pastor'
              : 'Save & Send Prayer Request'
          }
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </View>
  );
};

export default PrayerRequestScreen;
