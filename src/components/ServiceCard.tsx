// ServiceCard - Display recurring weekly service information

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import { Layout } from '../constants/Layout';
import { Contacts } from '../constants/Contacts';
import {
  getNextOccurrence,
  formatFullDate,
  format12HourTime,
  getDayName,
} from '../utils/dateHelpers';

interface ServiceCardProps {
  serviceKey: string;
  serviceName: string;
  dayOfWeek: number;
  time: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  serviceKey,
  serviceName,
  dayOfWeek,
  time,
}) => {
  const { colors } = useTheme();
  const [reminderEnabled, setReminderEnabled] = useState(false);

  useEffect(() => {
    // Load reminder preference from AsyncStorage
    loadReminderPreference();
  }, [serviceKey]);

  const loadReminderPreference = async () => {
    try {
      const value = await AsyncStorage.getItem(`@HRC:reminder_${serviceKey}`);
      if (value !== null) {
        setReminderEnabled(value === 'true');
      }
    } catch (error) {
      console.error('Error loading reminder preference:', error);
    }
  };

  const handleToggleReminder = async (value: boolean) => {
    try {
      setReminderEnabled(value);
      await AsyncStorage.setItem(`@HRC:reminder_${serviceKey}`, value.toString());
      // TODO: Schedule/cancel local notification when notification system is implemented
    } catch (error) {
      console.error('Error saving reminder preference:', error);
    }
  };

  const nextOccurrence = getNextOccurrence(dayOfWeek, time);
  const dayName = getDayName(dayOfWeek);
  const formattedTime = format12HourTime(time);
  const formattedDate = formatFullDate(nextOccurrence);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.lg,
      marginBottom: Layout.spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Layout.spacing.md,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flex: 1,
    },
    iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Layout.spacing.md,
    },
    dayText: {
      fontSize: Layout.fontSize.md,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    infoSection: {
      flex: 1,
    },
    serviceName: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    dayAndTime: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
    },
    reminderSection: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: Layout.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: Layout.spacing.md,
    },
    reminderIcon: {
      marginRight: Layout.spacing.sm,
    },
    reminderText: {
      flex: 1,
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
    },
    locationSection: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: Layout.spacing.sm,
    },
    locationIcon: {
      marginRight: Layout.spacing.sm,
      marginTop: 2,
    },
    locationText: {
      flex: 1,
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    nextOccurrence: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Layout.spacing.sm,
    },
    nextOccurrenceIcon: {
      marginRight: Layout.spacing.sm,
    },
    nextOccurrenceText: {
      fontSize: Layout.fontSize.sm,
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.dayText}>{dayName.substring(0, 3).toUpperCase()}</Text>
          </View>
          <View style={styles.infoSection}>
            <Text style={styles.serviceName}>{serviceName}</Text>
            <Text style={styles.dayAndTime}>
              {dayName}s at {formattedTime}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.locationSection}>
        <Ionicons
          name="location"
          size={16}
          color={colors.textSecondary}
          style={styles.locationIcon}
        />
        <Text style={styles.locationText}>{Contacts.churchAddress}</Text>
      </View>

      <View style={styles.nextOccurrence}>
        <Ionicons
          name="calendar-outline"
          size={16}
          color={colors.primary}
          style={styles.nextOccurrenceIcon}
        />
        <Text style={styles.nextOccurrenceText}>Next: {formattedDate}</Text>
      </View>

      <View style={styles.reminderSection}>
        <Ionicons
          name={reminderEnabled ? 'notifications' : 'notifications-outline'}
          size={20}
          color={reminderEnabled ? colors.primary : colors.textSecondary}
          style={styles.reminderIcon}
        />
        <Text style={styles.reminderText}>Remind me before service</Text>
        <Switch
          value={reminderEnabled}
          onValueChange={handleToggleReminder}
          trackColor={{ false: colors.border, true: `${colors.primary}80` }}
          thumbColor={reminderEnabled ? colors.primary : colors.textSecondary}
        />
      </View>
    </View>
  );
};

export default ServiceCard;
