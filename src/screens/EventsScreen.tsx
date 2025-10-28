// EventsScreen - Display weekly services and special events

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { EventsScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { Config } from '../constants/Config';
import { getUpcomingEvents } from '../services/firestore';
import { FirestoreEvent } from '../types/firestore';
import ServiceCard from '../components/ServiceCard';
import EventCard from '../components/EventCard';

const EventsScreen: React.FC<EventsScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [specialEvents, setSpecialEvents] = useState<FirestoreEvent[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSpecialEvents();
  }, []);

  const loadSpecialEvents = async () => {
    try {
      setError(null);
      const events = await getUpcomingEvents();
      setSpecialEvents(events);
    } catch (err: any) {
      console.error('Error loading special events:', err);
      // If Firebase is not configured, just show empty state
      if (err.message?.includes('not initialized')) {
        setSpecialEvents([]);
      } else {
        setError(err.message || 'Failed to load special events');
      }
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSpecialEvents();
    setRefreshing(false);
  }, []);

  const handleRetry = () => {
    setLoading(true);
    loadSpecialEvents();
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
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: Layout.fontSize.xl,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    refreshButton: {
      padding: Layout.spacing.sm,
    },
    scrollContent: {
      padding: Layout.spacing.lg,
    },
    sectionTitle: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: Layout.spacing.md,
      marginTop: Layout.spacing.sm,
    },
    sectionTitleFirst: {
      marginTop: 0,
    },
    emptyContainer: {
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyIcon: {
      marginBottom: Layout.spacing.md,
    },
    emptyText: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    errorContainer: {
      backgroundColor: `${colors.error}20`,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.lg,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.error,
      marginBottom: Layout.spacing.lg,
    },
    errorText: {
      fontSize: Layout.fontSize.md,
      color: colors.error,
      textAlign: 'center',
      marginBottom: Layout.spacing.md,
    },
    retryButton: {
      backgroundColor: colors.error,
      paddingHorizontal: Layout.spacing.lg,
      paddingVertical: Layout.spacing.sm,
      borderRadius: Layout.borderRadius.md,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
    },
    loadingContainer: {
      padding: Layout.spacing.xl,
      alignItems: 'center',
    },
    loadingText: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
      marginTop: Layout.spacing.md,
    },
  });

  const services = [
    {
      key: 'tuesday',
      ...Config.services.tuesday,
    },
    {
      key: 'thursday',
      ...Config.services.thursday,
    },
    {
      key: 'sunday',
      ...Config.services.sunday,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Church Events</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Recurring Services Section */}
        <Text style={[styles.sectionTitle, styles.sectionTitleFirst]}>Weekly Services</Text>
        {services.map((service) => (
          <ServiceCard
            key={service.key}
            serviceKey={service.key}
            serviceName={service.name}
            dayOfWeek={service.day}
            time={service.time}
          />
        ))}

        {/* Special Events Section */}
        <Text style={styles.sectionTitle}>Upcoming Special Events</Text>

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!error && loading && (
          <View style={styles.loadingContainer}>
            <Ionicons name="sync" size={48} color={colors.textSecondary} />
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        )}

        {!error && !loading && specialEvents.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={64}
              color={colors.textSecondary}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              No upcoming special events at this time.{'\n'}Check back later for updates!
            </Text>
          </View>
        )}

        {!error && !loading && specialEvents.length > 0 && (
          <>
            {specialEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default EventsScreen;
