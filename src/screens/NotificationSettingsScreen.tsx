// NotificationSettingsScreen - Notification preferences

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { NotificationSettingsScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { Config } from '../constants/Config';

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();

  // Reading reminders
  const [readingRemindersEnabled, setReadingRemindersEnabled] = useState(false);
  const [readingReminderTime, setReadingReminderTime] = useState('08:00');

  // Service reminders
  const [tuesdayReminderEnabled, setTuesdayReminderEnabled] = useState(false);
  const [thursdayReminderEnabled, setThursdayReminderEnabled] = useState(false);
  const [sundayReminderEnabled, setSundayReminderEnabled] = useState(false);

  // Special events
  const [specialEventsEnabled, setSpecialEventsEnabled] = useState(false);

  // Notification permission status
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    loadSettings();
    // TODO: Check actual notification permissions when notification system is implemented
    setPermissionsGranted(true); // Placeholder
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem(Config.storageKeys.notifications);
      if (settings) {
        const parsed = JSON.parse(settings);
        setReadingRemindersEnabled(parsed.readingReminders || false);
        setReadingReminderTime(parsed.readingReminderTime || '08:00');
        setTuesdayReminderEnabled(parsed.tuesdayReminder || false);
        setThursdayReminderEnabled(parsed.thursdayReminder || false);
        setSundayReminderEnabled(parsed.sundayReminder || false);
        setSpecialEventsEnabled(parsed.specialEvents || false);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveSettings = async (updates: any) => {
    try {
      const current = {
        readingReminders: readingRemindersEnabled,
        readingReminderTime,
        tuesdayReminder: tuesdayReminderEnabled,
        thursdayReminder: thursdayReminderEnabled,
        sundayReminder: sundayReminderEnabled,
        specialEvents: specialEventsEnabled,
        ...updates,
      };
      await AsyncStorage.setItem(Config.storageKeys.notifications, JSON.stringify(current));
      // TODO: Schedule/cancel notifications based on settings
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const handleEnableNotifications = () => {
    Alert.alert(
      'Enable Notifications',
      'Notification scheduling will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleReadingRemindersToggle = async (value: boolean) => {
    setReadingRemindersEnabled(value);
    await saveSettings({ readingReminders: value });
  };

  const handleServiceReminderToggle = async (
    service: 'tuesday' | 'thursday' | 'sunday',
    value: boolean
  ) => {
    if (service === 'tuesday') {
      setTuesdayReminderEnabled(value);
      await saveSettings({ tuesdayReminder: value });
    } else if (service === 'thursday') {
      setThursdayReminderEnabled(value);
      await saveSettings({ thursdayReminder: value });
    } else {
      setSundayReminderEnabled(value);
      await saveSettings({ sundayReminder: value });
    }
  };

  const handleSpecialEventsToggle = async (value: boolean) => {
    setSpecialEventsEnabled(value);
    await saveSettings({ specialEvents: value });
  };

  const handleChangeTime = () => {
    Alert.alert(
      'Change Time',
      'Time picker will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: Layout.spacing.lg,
      backgroundColor: colors.backgroundCard,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButton: {
      marginRight: Layout.spacing.md,
    },
    headerTitle: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    scrollContent: {
      padding: Layout.spacing.lg,
    },
    permissionBanner: {
      backgroundColor: `${colors.primary}20`,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.lg,
      marginBottom: Layout.spacing.lg,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    permissionBannerText: {
      fontSize: Layout.fontSize.sm,
      color: colors.textPrimary,
      marginBottom: Layout.spacing.md,
      lineHeight: 20,
    },
    enableButton: {
      backgroundColor: colors.primary,
      paddingVertical: Layout.spacing.sm,
      paddingHorizontal: Layout.spacing.lg,
      borderRadius: Layout.borderRadius.md,
      alignSelf: 'flex-start',
    },
    enableButtonText: {
      fontSize: Layout.fontSize.sm,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    section: {
      marginBottom: Layout.spacing.xl,
    },
    sectionTitle: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: Layout.spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.lg,
      marginBottom: Layout.spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: Layout.spacing.md,
    },
    settingInfo: {
      flex: 1,
    },
    settingTitle: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.lg,
      marginTop: Layout.spacing.sm,
      marginBottom: Layout.spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    timeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeIcon: {
      marginRight: Layout.spacing.md,
    },
    timeText: {
      fontSize: Layout.fontSize.md,
      color: colors.textPrimary,
    },
    timeValue: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.primary,
    },
    infoText: {
      fontSize: Layout.fontSize.xs,
      color: colors.textSecondary,
      lineHeight: 18,
      marginTop: Layout.spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Permission Banner (only show if not granted) */}
        {!permissionsGranted && (
          <View style={styles.permissionBanner}>
            <Text style={styles.permissionBannerText}>
              Enable notifications to receive reminders for daily readings and church services.
            </Text>
            <TouchableOpacity onPress={handleEnableNotifications} style={styles.enableButton}>
              <Text style={styles.enableButtonText}>Enable Notifications</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Reading Reminders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reading Reminders</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={readingRemindersEnabled ? 'book' : 'book-outline'}
                size={24}
                color={readingRemindersEnabled ? colors.primary : colors.textSecondary}
                style={styles.settingIcon}
              />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Daily Reading Reminder</Text>
                <Text style={styles.settingSubtitle}>Get reminded to read daily</Text>
              </View>
            </View>
            <Switch
              value={readingRemindersEnabled}
              onValueChange={handleReadingRemindersToggle}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={readingRemindersEnabled ? colors.primary : colors.textSecondary}
            />
          </View>

          {readingRemindersEnabled && (
            <TouchableOpacity onPress={handleChangeTime} style={styles.timeRow}>
              <View style={styles.timeLeft}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.timeIcon}
                />
                <Text style={styles.timeText}>Reminder Time</Text>
              </View>
              <Text style={styles.timeValue}>{readingReminderTime}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Service Reminders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Reminders</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={tuesdayReminderEnabled ? 'calendar' : 'calendar-outline'}
                size={24}
                color={tuesdayReminderEnabled ? colors.primary : colors.textSecondary}
                style={styles.settingIcon}
              />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Tuesday Bible Study</Text>
                <Text style={styles.settingSubtitle}>6:00 PM</Text>
              </View>
            </View>
            <Switch
              value={tuesdayReminderEnabled}
              onValueChange={(value) => handleServiceReminderToggle('tuesday', value)}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={tuesdayReminderEnabled ? colors.primary : colors.textSecondary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={thursdayReminderEnabled ? 'calendar' : 'calendar-outline'}
                size={24}
                color={thursdayReminderEnabled ? colors.primary : colors.textSecondary}
                style={styles.settingIcon}
              />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Thursday Victory Service</Text>
                <Text style={styles.settingSubtitle}>6:00 PM</Text>
              </View>
            </View>
            <Switch
              value={thursdayReminderEnabled}
              onValueChange={(value) => handleServiceReminderToggle('thursday', value)}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={thursdayReminderEnabled ? colors.primary : colors.textSecondary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={sundayReminderEnabled ? 'calendar' : 'calendar-outline'}
                size={24}
                color={sundayReminderEnabled ? colors.primary : colors.textSecondary}
                style={styles.settingIcon}
              />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Sunday Worship</Text>
                <Text style={styles.settingSubtitle}>8:00 AM</Text>
              </View>
            </View>
            <Switch
              value={sundayReminderEnabled}
              onValueChange={(value) => handleServiceReminderToggle('sunday', value)}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={sundayReminderEnabled ? colors.primary : colors.textSecondary}
            />
          </View>

          <Text style={styles.infoText}>
            You'll be reminded 1 hour before each service
          </Text>
        </View>

        {/* Special Events Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Events</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={specialEventsEnabled ? 'star' : 'star-outline'}
                size={24}
                color={specialEventsEnabled ? colors.primary : colors.textSecondary}
                style={styles.settingIcon}
              />
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Special Events Notifications</Text>
                <Text style={styles.settingSubtitle}>Get notified about new church events</Text>
              </View>
            </View>
            <Switch
              value={specialEventsEnabled}
              onValueChange={handleSpecialEventsToggle}
              trackColor={{ false: colors.border, true: `${colors.primary}80` }}
              thumbColor={specialEventsEnabled ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationSettingsScreen;
