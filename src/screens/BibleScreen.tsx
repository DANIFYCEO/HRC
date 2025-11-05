// BibleScreen - Bible reading with book and chapter selection

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { BibleScreenProps } from '../types/navigation';
import { Layout } from '../constants/Layout';
import { BIBLE_BOOKS, BibleBook } from '../constants/BibleBooks';

const BibleScreen: React.FC<BibleScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [selectedTestament, setSelectedTestament] = useState<'old' | 'new'>('old');
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.backgroundCard,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Layout.spacing.lg,
    },
    backButton: {
      marginRight: Layout.spacing.md,
    },
    headerTitle: {
      fontSize: Layout.fontSize.xl,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    tabsContainer: {
      flexDirection: 'row',
      paddingHorizontal: Layout.spacing.lg,
      paddingBottom: Layout.spacing.md,
    },
    tab: {
      flex: 1,
      paddingVertical: Layout.spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: Layout.fontSize.md,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.primary,
      fontWeight: '600',
    },
    bookGrid: {
      padding: Layout.spacing.md,
    },
    bookCard: {
      flex: 1,
      margin: Layout.spacing.sm,
      aspectRatio: 1.5,
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.lg,
      padding: Layout.spacing.md,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    bookName: {
      fontSize: Layout.fontSize.md,
      fontWeight: '600',
      color: colors.textPrimary,
      textAlign: 'center',
    },
    bookChapters: {
      fontSize: Layout.fontSize.xs,
      color: colors.textSecondary,
      marginTop: Layout.spacing.xs,
    },
    chapterGrid: {
      padding: Layout.spacing.md,
    },
    chapterCard: {
      flex: 1,
      margin: Layout.spacing.sm,
      aspectRatio: 1,
      backgroundColor: colors.backgroundCard,
      borderRadius: Layout.borderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    chapterNumber: {
      fontSize: Layout.fontSize.lg,
      fontWeight: '600',
      color: colors.textPrimary,
    },
  });

  const filteredBooks = BIBLE_BOOKS.filter(
    book => book.testament === selectedTestament
  );

  const renderBookCard = ({ item }: { item: BibleBook }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => setSelectedBook(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.bookName}>{item.name}</Text>
      <Text style={styles.bookChapters}>
        {item.chapters} {item.chapters === 1 ? 'chapter' : 'chapters'}
      </Text>
    </TouchableOpacity>
  );

  const renderChapterCard = ({ item }: { item: number }) => (
    <TouchableOpacity
      style={styles.chapterCard}
      onPress={() => {
        if (selectedBook) {
          navigation.navigate('BibleChapterScreen', {
            bookId: selectedBook.id,
            bookName: selectedBook.name,
            chapterNum: item,
          });
        }
      }}
      activeOpacity={0.7}
    >
      <Text style={styles.chapterNumber}>{item}</Text>
    </TouchableOpacity>
  );

  if (selectedBook) {
    // Chapter Selector View
    const chapters = Array.from({ length: selectedBook.chapters }, (_, i) => i + 1);

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => setSelectedBook(null)}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedBook.name}</Text>
          </View>
        </View>

        <FlatList
          data={chapters}
          renderItem={renderChapterCard}
          keyExtractor={(item) => item.toString()}
          numColumns={5}
          contentContainerStyle={styles.chapterGrid}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  // Book Selector View
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Bible</Text>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTestament === 'old' && styles.tabActive]}
            onPress={() => setSelectedTestament('old')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTestament === 'old' && styles.tabTextActive,
              ]}
            >
              Old Testament
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTestament === 'new' && styles.tabActive]}
            onPress={() => setSelectedTestament('new')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTestament === 'new' && styles.tabTextActive,
              ]}
            >
              New Testament
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredBooks}
        renderItem={renderBookCard}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.bookGrid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BibleScreen;
