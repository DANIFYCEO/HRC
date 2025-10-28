// HomeScreen - Main landing screen with resources and quick actions

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { HomeScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { Contacts } from '../constants/Contacts';
import { contactPastor } from '../utils/whatsapp';
import { makePhoneCall } from '../utils/phone';
import { shareApp } from '../utils/sharing';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const { isGuest } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: Layout.spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: Layout.spacing.xl,
    },
    logo: {
      width: Layout.logo.width,
      height: Layout.logo.height,
      marginBottom: Layout.spacing.md,
    },
    churchName: {
      fontSize: Layout.fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    tagline: {
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: Layout.spacing.xs,
    },
    welcomeBanner: {
      backgroundColor: colors.primary,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.xl,
      marginBottom: Layout.spacing.xxl,
      alignItems: 'center',
    },
    welcomeText: {
      fontSize: Layout.fontSize.xl,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    welcomeSubtext: {
      fontSize: Layout.fontSize.md,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: Layout.spacing.sm,
    },
    sectionTitle: {
      fontSize: Layout.fontSize.xl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: Layout.spacing.md,
    },
    resourceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Layout.spacing.md,
      marginBottom: Layout.spacing.xxl,
    },
    resourceCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Layout.spacing.xl,
      alignItems: 'center',
      width: '48%',
      minHeight: 120,
    },
    resourceIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Layout.spacing.md,
    },
    resourceTitle: {
      fontSize: Layout.fontSize.md,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    resourceSubtitle: {
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: Layout.spacing.xs,
    },
    quickActionsScroll: {
      marginBottom: Layout.spacing.xxl,
    },
    quickActionButton: {
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Layout.spacing.md,
      marginRight: Layout.spacing.md,
      minWidth: 100,
      alignItems: 'center',
    },
    quickActionText: {
      fontSize: Layout.fontSize.sm,
      color: colors.textPrimary,
      marginTop: Layout.spacing.xs,
      textAlign: 'center',
    },
  });

  const resourceCards = [
    {
      id: 'bible',
      icon: '📖',
      iconColor: colors.iconGreen,
      title: 'Bible',
      subtitle: 'Read & Study',
      onPress: () => navigation.navigate('BibleScreen'),
    },
    {
      id: 'sunday-school',
      icon: '🎓',
      iconColor: colors.iconOrange,
      title: 'Sunday School',
      subtitle: '24 Lessons',
      onPress: () => navigation.navigate('SundaySchoolScreen'),
    },
    {
      id: 'reading-plan',
      icon: '📅',
      iconColor: colors.iconPurple,
      title: 'Bible in One Year',
      subtitle: 'Daily Reading',
      onPress: () => navigation.navigate('ReadingPlanScreen'),
    },
    {
      id: 'prayer-requests',
      icon: '❤️',
      iconColor: colors.iconRed,
      title: 'Prayer Requests',
      subtitle: 'Send to Pastor',
      onPress: () => navigation.navigate('PrayerRequestScreen'),
    },
  ];

  const quickActions = [
    {
      id: 'prayer',
      icon: 'hand-right',
      title: 'Submit Prayer',
      onPress: () => navigation.navigate('PrayerRequestScreen'),
    },
    {
      id: 'whatsapp',
      icon: 'logo-whatsapp',
      title: 'WhatsApp Pastor',
      onPress: () => contactPastor(),
    },
    {
      id: 'service',
      icon: 'time',
      title: 'Next Service',
      onPress: () => navigation.navigate('MainTabs', { screen: 'Events' }),
    },
    {
      id: 'share',
      icon: 'share-social',
      title: 'Share App',
      onPress: () => shareApp(),
    },
    {
      id: 'call',
      icon: 'call',
      title: 'Call Office',
      onPress: () => makePhoneCall(Contacts.churchOffice),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          {/* Logo placeholder - will add actual logo later */}
          <View style={styles.logo}>
            <Ionicons name="book" size={60} color={colors.primary} />
          </View>
          <Text style={styles.churchName}>HE REIGNS CHAPEL</Text>
          <Text style={styles.tagline}>POWERLINE LIVING WATER MINISTRIES</Text>
        </View>

        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <Text style={styles.welcomeText}>Welcome to He Reigns Chapel</Text>
          <Text style={styles.welcomeSubtext}>Where Everybody is Somebody</Text>
        </View>

        {/* Spiritual Resources */}
        <Text style={styles.sectionTitle}>Spiritual Resources</Text>
        <View style={styles.resourceGrid}>
          {resourceCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.resourceCard}
              onPress={card.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.resourceIcon, { backgroundColor: card.iconColor }]}>
                <Text style={{ fontSize: 24 }}>{card.icon}</Text>
              </View>
              <Text style={styles.resourceTitle}>{card.title}</Text>
              <Text style={styles.resourceSubtitle}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsScroll}
        >
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <Ionicons name={action.icon as any} size={24} color={colors.primary} />
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
