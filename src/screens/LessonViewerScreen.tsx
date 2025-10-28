// LessonViewerScreen - PDF viewer for lessons

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LessonViewerScreen: React.FC = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lesson Viewer Screen</Text>
    </View>
  );
};

export default LessonViewerScreen;
