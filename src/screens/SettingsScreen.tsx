// SettingsScreen - App settings, profile, and church information

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { SettingsScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { Config } from '../constants/Config';
import { Contacts } from '../constants/Contacts';
import { makePhoneCall } from '../utils/phone';
import { contactPastor, sendSupportRequest } from '../utils/whatsapp';
import { shareApp } from '../utils/sharing';
import { openChurchLocation } from '../utils/maps';
import SettingsRow from '../components/SettingsRow';
import CustomButton from '../components/CustomButton';

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, isGuest } = useAuth();
  const { fontSize, bibleTranslation, notifications } = useSettings();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: Layout.spacing.lg,
    },
    sectionTitle: {
      fontSize: Layout.fontSize.lg,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginTop: Layout.spacing.xl,
      marginBottom: Layout.spacing.md,
    },
    signInPrompt: {
      backgroundColor: colors.backgroundCard,
      padding: Layout.spacing.lg,
      borderRadius: Layout.borderRadius.lg,
      marginBottom: Layout.spacing.lg,
      alignItems: 'center',
    },
    signInText: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: Layout.spacing.md,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: Layout.spacing.md,
    },
    button: {
      flex: 1,
    },
    profileCard: {
      backgroundColor: colors.backgroundCard,
      padding: Layout.spacing.lg,
      borderRadius: Layout.borderRadius.lg,
      marginBottom: Layout.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileAvatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Layout.spacing.md,
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    profileEmail: {
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
      marginTop: 2,
    },
    footer: {
      alignItems: 'center',
      padding: Layout.spacing.xl,
      marginTop: Layout.spacing.xxl,
    },
    footerText: {
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
      marginTop: Layout.spacing.xs,
    },
  });

  const handleCallOffice = () => {
    makePhoneCall(Contacts.churchOffice);
  };

  const handleWhatsAppPastor = () => {
    contactPastor();
  };

  const handleShareApp = () => {
    shareApp();
  };

  const handleOpenMap = () => {
    openChurchLocation();
  };

  const handleSupport = () => {
    Alert.prompt(
      'Help & Support',
      'Please describe your problem:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: (problem) => {
            if (problem && problem.trim()) {
              sendSupportRequest(problem);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const getFontSizeLabel = (): string => {
    const labels = {
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
      extraLarge: 'Extra Large',
    };
    return labels[fontSize] || 'Medium';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Settings Section */}
        <Text style={styles.sectionTitle}>Account Settings</Text>

        {isGuest ? (
          <View style={styles.signInPrompt}>
            <Text style={styles.signInText}>
              Sign in to save your progress, track reading plans, and sync across devices
            </Text>
            <View style={styles.buttonRow}>
              <CustomButton
                title="Sign In"
                onPress={() => navigation.navigate('SignIn')}
                style={styles.button}
              />
              <CustomButton
                title="Sign Up"
                onPress={() => navigation.navigate('SignUp')}
                variant="outline"
                style={styles.button}
              />
            </View>
          </View>
        ) : (
          <>
            <SettingsRow
              icon="person-circle"
              title="My Profile"
              subtitle={user?.email || ''}
              onPress={() => navigation.navigate('ProfileEditScreen')}
            />
            <SettingsRow
              icon="notifications"
              title="Notifications"
              subtitle={`${
                Object.values(notifications).filter((v) => v === true).length
              } reminders enabled`}
              onPress={() => navigation.navigate('NotificationSettingsScreen')}
            />
          </>
        )}

        {/* App Settings Section */}
        <Text style={styles.sectionTitle}>App Settings</Text>

        <SettingsRow
          icon="moon"
          title="Appearance"
          subtitle={theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          showSwitch
          switchValue={theme === 'dark'}
          onSwitchChange={toggleTheme}
          showArrow={false}
        />

        <SettingsRow
          icon="book"
          title="Bible Translation"
          value="KJV"
          onPress={() => {
            Alert.alert(
              'Bible Translation',
              'Translation selector coming soon!',
              [{ text: 'OK' }]
            );
          }}
        />

        <SettingsRow
          icon="text"
          title="Reading Font Size"
          value={getFontSizeLabel()}
          onPress={() => {
            Alert.alert(
              'Font Size',
              'Font size selector coming soon!',
              [{ text: 'OK' }]
            );
          }}
        />

        {/* About Us Section */}
        <Text style={styles.sectionTitle}>About Us</Text>

        <SettingsRow
          icon="location"
          title="Church Location"
          subtitle={Contacts.churchAddress}
          onPress={handleOpenMap}
        />

        <SettingsRow
          icon="share-social"
          title="Share App"
          subtitle="Invite friends and family"
          onPress={handleShareApp}
        />

        <SettingsRow
          icon="help-circle"
          title="Help & Support"
          subtitle="Get help with the app"
          onPress={handleSupport}
        />

        {/* Contact Us Section */}
        <Text style={styles.sectionTitle}>Contact Us</Text>

        <SettingsRow
          icon="call"
          title="Call Church Office"
          subtitle={Contacts.churchOffice}
          onPress={handleCallOffice}
        />

        <SettingsRow
          icon="logo-whatsapp"
          title="WhatsApp Pastor"
          subtitle={`+${Contacts.pastorWhatsApp}`}
          onPress={handleWhatsAppPastor}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {Config.appName} v{Config.appVersion}
          </Text>
          <Text style={styles.footerText}>
            © 2025 {Contacts.churchTagline}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
