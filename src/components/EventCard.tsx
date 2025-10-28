// EventCard - Display special event information

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Layout } from '../constants/Layout';
import { FirestoreEvent } from '../types/firestore';
import { formatFullDate, format12HourTime } from '../utils/dateHelpers';

interface EventCardProps {
  event: FirestoreEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleAddToCalendar = () => {
    // TODO: Implement actual calendar integration when ready
    Alert.alert(
      'Add to Calendar',
      'Calendar integration will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const eventDate = event.dateTime.toDate();
  const formattedDate = formatFullDate(eventDate);
  const timeString = eventDate.toTimeString().substring(0, 5); // Get "HH:MM"
  const formattedTime = format12HourTime(timeString);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.lg,
      marginBottom: Layout.spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: 180,
      backgroundColor: colors.border,
    },
    content: {
      padding: Layout.spacing.lg,
    },
    title: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: Layout.spacing.sm,
    },
    dateTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Layout.spacing.sm,
    },
    icon: {
      marginRight: Layout.spacing.sm,
    },
    dateTimeText: {
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: Layout.spacing.md,
    },
    locationText: {
      flex: 1,
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    descriptionContainer: {
      marginTop: Layout.spacing.sm,
    },
    description: {
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    descriptionCollapsed: {
      maxHeight: 60,
      overflow: 'hidden',
    },
    showMoreButton: {
      marginTop: Layout.spacing.sm,
    },
    showMoreText: {
      fontSize: Layout.fontSize.sm,
      color: colors.primary,
      fontWeight: '600',
    },
    buttonContainer: {
      marginTop: Layout.spacing.md,
      paddingTop: Layout.spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    addToCalendarButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: `${colors.primary}20`,
      paddingVertical: Layout.spacing.md,
      borderRadius: Layout.borderRadius.md,
    },
    addToCalendarText: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.primary,
      marginLeft: Layout.spacing.sm,
    },
  });

  return (
    <View style={styles.card}>
      {event.imageUrl && (
        <Image source={{ uri: event.imageUrl }} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>

        <View style={styles.dateTimeRow}>
          <Ionicons name="calendar" size={16} color={colors.primary} style={styles.icon} />
          <Text style={styles.dateTimeText}>{formattedDate}</Text>
        </View>

        <View style={styles.dateTimeRow}>
          <Ionicons name="time" size={16} color={colors.primary} style={styles.icon} />
          <Text style={styles.dateTimeText}>{formattedTime}</Text>
        </View>

        {event.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={colors.primary} style={styles.icon} />
            <Text style={styles.locationText}>{event.location}</Text>
          </View>
        )}

        {event.description && (
          <View style={styles.descriptionContainer}>
            <Text
              style={[styles.description, !expanded && styles.descriptionCollapsed]}
              numberOfLines={expanded ? undefined : 3}
            >
              {event.description}
            </Text>
            {event.description.length > 100 && (
              <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                style={styles.showMoreButton}
              >
                <Text style={styles.showMoreText}>
                  {expanded ? 'Show Less' : 'Show More'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.addToCalendarButton}
            onPress={handleAddToCalendar}
            activeOpacity={0.7}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.addToCalendarText}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EventCard;
