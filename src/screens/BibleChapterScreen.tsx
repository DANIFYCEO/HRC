// BibleChapterScreen - Read Bible chapter with verses

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { BibleChapterScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { getChapter, formatVerseReference, BibleChapter } from '../services/bible';
import { getBookById } from '../constants/BibleBooks';

const BibleChapterScreen: React.FC<BibleChapterScreenProps> = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { bookId, bookName, chapterNum } = route.params;

  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChapter();
  }, [bookId, chapterNum]);

  const loadChapter = () => {
    setLoading(true);
    const data = getChapter(bookId, chapterNum);

    if (data) {
      setChapterData(data.chapter);
    } else {
      Alert.alert('Error', 'Chapter not found');
      navigation.goBack();
    }
    setLoading(false);
  };

  const handlePreviousChapter = () => {
    if (chapterNum > 1) {
      navigation.setParams({
        bookId,
        bookName,
        chapterNum: chapterNum - 1,
      });
    } else {
      // Go to previous book's last chapter
      const book = getBookById(bookId);
      if (book) {
        const bookIndex = book.testament === 'old' ? book.id : book.id;
        // For now, just show message
        Alert.alert('First Chapter', 'This is the first chapter of ' + bookName);
      }
    }
  };

  const handleNextChapter = () => {
    const book = getBookById(bookId);
    if (book && chapterNum < book.chapters) {
      navigation.setParams({
        bookId,
        bookName,
        chapterNum: chapterNum + 1,
      });
    } else {
      // Go to next book's first chapter
      Alert.alert('Last Chapter', 'This is the last chapter of ' + bookName);
    }
  };

  const handleShare = async () => {
    if (!chapterData) return;

    const reference = formatVerseReference(bookName, chapterNum);
    const versesText = chapterData.verses
      .map(v => `${v.number}. ${v.text}`)
      .join('\n\n');

    const shareContent = `${reference}\n\n${versesText}\n\n- King James Version (KJV)`;

    try {
      await Share.share({
        message: shareContent,
        title: reference,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: Layout.spacing.lg,
      backgroundColor: colors.backgroundCard,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    backButton: {
      marginRight: Layout.spacing.md,
    },
    headerTitle: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    shareButton: {
      marginLeft: Layout.spacing.md,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: Layout.spacing.lg,
      paddingBottom: Layout.spacing.xxl,
    },
    verseContainer: {
      marginBottom: Layout.spacing.lg,
      flexDirection: 'row',
    },
    verseNumber: {
      fontSize: Layout.fontSize.sm,
      fontWeight: '600',
      color: colors.primary,
      marginRight: Layout.spacing.sm,
      marginTop: 2,
      minWidth: 24,
    },
    verseText: {
      flex: 1,
      fontSize: Layout.fontSize.md,
      lineHeight: 24,
      color: colors.textPrimary,
    },
    footer: {
      flexDirection: 'row',
      padding: Layout.spacing.lg,
      backgroundColor: colors.backgroundCard,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      gap: Layout.spacing.md,
    },
    navButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: Layout.spacing.md,
      backgroundColor: colors.background,
      borderRadius: Layout.borderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    navButtonDisabled: {
      opacity: 0.4,
    },
    navButtonText: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.textPrimary,
      marginHorizontal: Layout.spacing.sm,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: Layout.fontSize.md,
      color: colors.textSecondary,
      marginTop: Layout.spacing.md,
    },
  });

  if (loading || !chapterData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Loading...</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons name="book" size={48} color={colors.textSecondary} />
          <Text style={styles.loadingText}>Loading chapter...</Text>
        </View>
      </View>
    );
  }

  const book = getBookById(bookId);
  const isFirstChapter = chapterNum === 1;
  const isLastChapter = book ? chapterNum === book.chapters : true;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {bookName} {chapterNum}
          </Text>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Chapter Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {chapterData.verses.map((verse) => (
          <View key={verse.number} style={styles.verseContainer}>
            <Text style={styles.verseNumber}>{verse.number}</Text>
            <Text style={styles.verseText}>{verse.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, isFirstChapter && styles.navButtonDisabled]}
          onPress={handlePreviousChapter}
          disabled={isFirstChapter}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={isFirstChapter ? colors.textSecondary : colors.textPrimary}
          />
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, isLastChapter && styles.navButtonDisabled]}
          onPress={handleNextChapter}
          disabled={isLastChapter}
          activeOpacity={0.7}
        >
          <Text style={styles.navButtonText}>Next</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isLastChapter ? colors.textSecondary : colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BibleChapterScreen;
