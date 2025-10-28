// SundaySchoolScreen - List of 24 Sunday School lessons

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SundaySchoolScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { LESSONS, Lesson } from '../constants/Lessons';

const SundaySchoolScreen: React.FC<SundaySchoolScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();

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
    },
    headerTitle: {
      fontSize: Layout.fontSize.xl,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginBottom: Layout.spacing.xs,
    },
    headerSubtitle: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
    },
    listContent: {
      padding: Layout.spacing.lg,
    },
    lessonCard: {
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.lg,
      marginBottom: Layout.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    lessonNumber: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Layout.spacing.md,
    },
    lessonNumberText: {
      fontSize: Layout.fontSize.xl,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    lessonContent: {
      flex: 1,
    },
    lessonTitle: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    lessonSubtitle: {
      fontSize: Layout.fontSize.sm,
      color: colors.textSecondary,
    },
    lessonIcon: {
      marginLeft: Layout.spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: Layout.spacing.xxl,
    },
    emptyIcon: {
      marginBottom: Layout.spacing.lg,
    },
    emptyText: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: Layout.spacing.sm,
    },
    emptySubtext: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  const handleLessonPress = (lesson: Lesson) => {
    // Navigate to PDF viewer with lesson details
    navigation.navigate('LessonViewerScreen', {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    });
  };

  const renderLesson = ({ item }: { item: Lesson }) => (
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={() => handleLessonPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.lessonNumber}>
        <Text style={styles.lessonNumberText}>{item.id}</Text>
      </View>
      <View style={styles.lessonContent}>
        <Text style={styles.lessonTitle}>{item.title}</Text>
        <Text style={styles.lessonSubtitle}>Lesson {item.id} of 24</Text>
      </View>
      <Ionicons
        name="document-text"
        size={24}
        color={colors.primary}
        style={styles.lessonIcon}
      />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="book-outline"
        size={80}
        color={colors.textSecondary}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>No Lessons Available</Text>
      <Text style={styles.emptySubtext}>
        Sunday School lessons will appear here when they are added
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sunday School Lessons</Text>
        <Text style={styles.headerSubtitle}>
          {LESSONS.length} lessons available for study
        </Text>
      </View>

      {/* Lesson List */}
      <FlatList
        data={LESSONS}
        renderItem={renderLesson}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default SundaySchoolScreen;
