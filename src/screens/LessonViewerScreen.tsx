// LessonViewerScreen - PDF viewer for Sunday School lessons

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { useTheme } from '../context/ThemeContext';
import { LessonViewerScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { getLessonById } from '../constants/Lessons';
import CustomButton from '../components/CustomButton';
import { shareContent } from '../utils/sharing';

const LessonViewerScreen: React.FC<LessonViewerScreenProps> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { lessonId, lessonTitle } = route.params;
  const [loading, setLoading] = useState(false);

  const lesson = getLessonById(lessonId);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: Layout.spacing.lg,
    },
    header: {
      backgroundColor: colors.backgroundCard,
      padding: Layout.spacing.xl,
      borderRadius: Layout.borderRadius.lg,
      marginBottom: Layout.spacing.xl,
      alignItems: 'center',
    },
    lessonNumber: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Layout.spacing.lg,
    },
    lessonNumberText: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    lessonTitle: {
      fontSize: Layout.fontSize.xxl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: Layout.spacing.sm,
    },
    lessonSubtitle: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    infoCard: {
      backgroundColor: colors.backgroundCard,
      padding: Layout.spacing.lg,
      borderRadius: Layout.borderRadius.lg,
      marginBottom: Layout.spacing.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Layout.spacing.md,
    },
    infoIcon: {
      marginRight: Layout.spacing.md,
    },
    infoText: {
      flex: 1,
      fontSize: Layout.fontSize.md,
      color: colors.textPrimary,
      lineHeight: 22,
    },
    infoTitle: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: Layout.spacing.md,
    },
    instructionsCard: {
      backgroundColor: `${colors.primary}10`,
      padding: Layout.spacing.lg,
      borderRadius: Layout.borderRadius.lg,
      marginBottom: Layout.spacing.xl,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    instructionsTitle: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: Layout.spacing.md,
    },
    instructionsText: {
      fontSize: Layout.fontSize.md,
      color: colors.textPrimary,
      lineHeight: 22,
      marginBottom: Layout.spacing.sm,
    },
    filenameText: {
      fontSize: Layout.fontSize.sm,
      fontFamily: 'monospace',
      color: colors.textSecondary,
      backgroundColor: colors.backgroundCard,
      padding: Layout.spacing.sm,
      borderRadius: Layout.borderRadius.sm,
      marginTop: Layout.spacing.sm,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: Layout.spacing.md,
      marginTop: Layout.spacing.lg,
    },
    button: {
      flex: 1,
    },
  });

  const handleOpenPDF = async () => {
    if (!lesson) return;

    setLoading(true);

    try {
      // Get the PDF asset from the bundled assets
      // The require statement needs to be dynamic based on the lesson filename
      // For simplicity, we'll use a mapping approach
      const lessonAssets: { [key: string]: any } = {
        'Teach them to study - 1.pdf': require('../../assets/lessons/Teach them to study - 1.pdf'),
        'Teach them to seek God - 2.pdf': require('../../assets/lessons/Teach them to seek God - 2.pdf'),
        'Teach them to avoid evil company - 3.pdf': require('../../assets/lessons/Teach them to avoid evil company - 3.pdf'),
        'Abraham - 4.pdf': require('../../assets/lessons/Abraham - 4.pdf'),
        'Burial - 5.pdf': require('../../assets/lessons/Burial - 5.pdf'),
        'Widowhood - 6.pdf': require('../../assets/lessons/Widowhood - 6.pdf'),
        'SUB-THEME- Familly Vices 1- Remiss - 7.pdf': require('../../assets/lessons/SUB-THEME- Familly Vices 1- Remiss - 7.pdf'),
        'Family Vices 2 - Infidelity - 8.pdf': require('../../assets/lessons/Family Vices 2 - Infidelity - 8.pdf'),
        'Family Vices 3 - Adultery - 9.pdf': require('../../assets/lessons/Family Vices 3 - Adultery - 9.pdf'),
        'Family Vices 4 - Separation - 10.pdf': require('../../assets/lessons/Family Vices 4 - Separation - 10.pdf'),
        'Fathers, Where are you - 11.pdf': require('../../assets/lessons/Fathers, Where are you - 11.pdf'),
        'Family Vices 5 - Divorce - 12.pdf': require('../../assets/lessons/Family Vices 5 - Divorce - 12.pdf'),
        'Envy - 13.pdf': require('../../assets/lessons/Envy - 13.pdf'),
        'Unforgiveness - 14.pdf': require('../../assets/lessons/Unforgiveness - 14.pdf'),
        'Rebellion - 15.pdf': require('../../assets/lessons/Rebellion - 15.pdf'),
        'Modesty - 16.pdf': require('../../assets/lessons/Modesty - 16.pdf'),
        'Loyalty - 17.pdf': require('../../assets/lessons/Loyalty - 17.pdf'),
        'The fundamental principles of loyalty - 18.pdf': require('../../assets/lessons/The fundamental principles of loyalty - 18.pdf'),
        'Attitude and habits of a loyal individual towards his church - 19.pdf': require('../../assets/lessons/Attitude and habits of a loyal individual towards his church - 19.pdf'),
        'The Three tests of loyalty - 20.pdf': require('../../assets/lessons/The Three tests of loyalty - 20.pdf'),
        'Gratitude and testimonies - 21.pdf': require('../../assets/lessons/Gratitude and testimonies - 21.pdf'),
        'Understanding Harvest - 22.pdf': require('../../assets/lessons/Understanding Harvest - 22.pdf'),
        'The Rewards of service - 23.pdf': require('../../assets/lessons/The Rewards of service - 23.pdf'),
        'Why his Birth - 24.pdf': require('../../assets/lessons/Why his Birth - 24.pdf'),
      };

      const pdfAsset = lessonAssets[lesson.filename];

      if (!pdfAsset) {
        Alert.alert('Error', 'PDF file not found in assets');
        setLoading(false);
        return;
      }

      // Load the asset
      const asset = Asset.fromModule(pdfAsset);
      await asset.downloadAsync();

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable && asset.localUri) {
        // Open the PDF using the system's default PDF viewer
        await Sharing.shareAsync(asset.localUri, {
          mimeType: 'application/pdf',
          dialogTitle: lesson.title,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert(
          'Cannot Open PDF',
          'PDF viewing is not available on this device. Please install a PDF viewer app.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Error opening PDF:', error);
      Alert.alert(
        'Error',
        'Failed to open PDF. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShareLesson = () => {
    shareContent(
      `Sunday School Lesson ${lessonId}`,
      `Check out this Sunday School lesson: "${lessonTitle}" - Lesson ${lessonId} of 24`
    );
  };

  if (!lesson) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Ionicons name="alert-circle" size={80} color={colors.error} />
        <Text style={[styles.lessonTitle, { marginTop: Layout.spacing.lg }]}>
          Lesson Not Found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Lesson Header */}
        <View style={styles.header}>
          <View style={styles.lessonNumber}>
            <Text style={styles.lessonNumberText}>{lesson.id}</Text>
          </View>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <Text style={styles.lessonSubtitle}>Lesson {lesson.id} of 24</Text>
        </View>

        {/* Info Card */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📚 About This Lesson</Text>
          <Text style={styles.instructionsText}>
            Tap "Open PDF" below to view this Sunday School lesson. The PDF will open in your device's default PDF viewer.
          </Text>
        </View>

        {/* Lesson Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Lesson Information</Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="document-text"
              size={24}
              color={colors.primary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: '600' }}>Filename: </Text>
              {lesson.filename}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="book"
              size={24}
              color={colors.primary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: '600' }}>Category: </Text>
              Sunday School
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="people"
              size={24}
              color={colors.primary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              <Text style={{ fontWeight: '600' }}>For: </Text>
              He Reigns Chapel Members
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <CustomButton
            title="Open PDF"
            onPress={handleOpenPDF}
            loading={loading}
            disabled={loading}
            style={styles.button}
          />
          <CustomButton
            title="Share"
            onPress={handleShareLesson}
            variant="outline"
            style={styles.button}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default LessonViewerScreen;
