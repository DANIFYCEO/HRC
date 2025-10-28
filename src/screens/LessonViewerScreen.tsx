// LessonViewerScreen - PDF viewer for Sunday School lessons

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { LessonViewerScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { getLessonById } from '../constants/Lessons';
import CustomButton from '../components/CustomButton';
import { shareContent } from '../utils/sharing';

const LessonViewerScreen: React.FC<LessonViewerScreenProps> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { lessonId, lessonTitle } = route.params;

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

  const handleOpenPDF = () => {
    // TODO: Implement PDF opening once files are in assets
    Alert.alert(
      'PDF Not Available',
      `The PDF file for "${lessonTitle}" should be placed in:\n\nassets/lessons/${lesson?.filename}\n\nOnce the file is added, it will open automatically.`,
      [{ text: 'OK' }]
    );
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

        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>📚 How to Add This Lesson</Text>
          <Text style={styles.instructionsText}>
            To view this lesson, place the PDF file in your project's assets folder:
          </Text>
          <Text style={styles.filenameText}>
            assets/lessons/{lesson.filename}
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
