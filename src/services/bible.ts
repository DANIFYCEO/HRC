// Bible service for loading and accessing KJV Bible data

import bibleData from '../../assets/bible/kjv.json';

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  number: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  id: string;
  name: string;
  chapters: BibleChapter[];
  testament: 'old' | 'new';
}

export interface BibleBookMetadata {
  id: string;
  name: string;
  chaptersCount: number;
  testament: 'old' | 'new';
}

export interface BibleSearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

// In-memory cache of Bible data
let cachedBible: BibleBook[] | null = null;

/**
 * Load and cache Bible data in memory
 * Should be called on app initialization
 */
export const loadBibleData = (): BibleBook[] => {
  if (cachedBible) {
    return cachedBible;
  }

  try {
    const otBooks = bibleData.old_testament.books.map(book => ({
      ...book,
      testament: 'old' as const,
    }));

    const ntBooks = bibleData.new_testament.books.map(book => ({
      ...book,
      testament: 'new' as const,
    }));

    cachedBible = [...otBooks, ...ntBooks];
    return cachedBible;
  } catch (error) {
    console.error('Error loading Bible data:', error);
    throw new Error('Failed to load Bible data');
  }
};

/**
 * Get list of all 66 books with metadata (without full chapter/verse data)
 */
export const getBooks = (): BibleBookMetadata[] => {
  const bible = loadBibleData();

  return bible.map(book => ({
    id: book.id,
    name: book.name,
    chaptersCount: book.chapters.length,
    testament: book.testament,
  }));
};

/**
 * Get specific book data with all chapters and verses
 */
export const getBook = (bookId: string): BibleBook | null => {
  const bible = loadBibleData();
  const book = bible.find(b => b.id.toLowerCase() === bookId.toLowerCase());
  return book || null;
};

/**
 * Get specific chapter from a book
 */
export const getChapter = (
  bookId: string,
  chapterNum: number
): { book: BibleBookMetadata; chapter: BibleChapter } | null => {
  const book = getBook(bookId);

  if (!book) {
    return null;
  }

  const chapter = book.chapters.find(ch => ch.number === chapterNum);

  if (!chapter) {
    return null;
  }

  return {
    book: {
      id: book.id,
      name: book.name,
      chaptersCount: book.chapters.length,
      testament: book.testament,
    },
    chapter,
  };
};

/**
 * Get verse by book, chapter, and verse number
 */
export const getVerse = (
  bookId: string,
  chapterNum: number,
  verseNum: number
): { book: BibleBookMetadata; chapter: number; verse: BibleVerse } | null => {
  const chapterData = getChapter(bookId, chapterNum);

  if (!chapterData) {
    return null;
  }

  const verse = chapterData.chapter.verses.find(v => v.number === verseNum);

  if (!verse) {
    return null;
  }

  return {
    book: chapterData.book,
    chapter: chapterNum,
    verse,
  };
};

/**
 * Get multiple chapters for reading plans
 * Example: getReadingPlanText('gn', 1, 3) returns Genesis chapters 1-3
 */
export const getReadingPlanText = (
  bookId: string,
  chapterStart: number,
  chapterEnd: number
): { book: BibleBookMetadata; chapters: BibleChapter[] } | null => {
  const book = getBook(bookId);

  if (!book) {
    return null;
  }

  const chapters = book.chapters.filter(
    ch => ch.number >= chapterStart && ch.number <= chapterEnd
  );

  return {
    book: {
      id: book.id,
      name: book.name,
      chaptersCount: book.chapters.length,
      testament: book.testament,
    },
    chapters,
  };
};

/**
 * Search verses across the entire Bible
 * Basic case-insensitive string matching
 */
export const searchVerses = (
  query: string,
  limit: number = 50
): BibleSearchResult[] => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  const bible = loadBibleData();
  const results: BibleSearchResult[] = [];
  const searchQuery = query.toLowerCase().trim();

  for (const book of bible) {
    for (const chapter of book.chapters) {
      for (const verse of chapter.verses) {
        if (verse.text.toLowerCase().includes(searchQuery)) {
          results.push({
            bookId: book.id,
            bookName: book.name,
            chapter: chapter.number,
            verse: verse.number,
            text: verse.text,
          });

          // Limit results
          if (results.length >= limit) {
            return results;
          }
        }
      }
    }
  }

  return results;
};

/**
 * Get books by testament
 */
export const getBooksByTestament = (
  testament: 'old' | 'new'
): BibleBookMetadata[] => {
  const books = getBooks();
  return books.filter(book => book.testament === testament);
};

/**
 * Get total verse count for a book
 */
export const getBookVerseCount = (bookId: string): number => {
  const book = getBook(bookId);

  if (!book) {
    return 0;
  }

  return book.chapters.reduce((total, chapter) => {
    return total + chapter.verses.length;
  }, 0);
};

/**
 * Format verse reference (e.g., "Genesis 1:1")
 */
export const formatVerseReference = (
  bookName: string,
  chapter: number,
  verse?: number
): string => {
  if (verse) {
    return `${bookName} ${chapter}:${verse}`;
  }
  return `${bookName} ${chapter}`;
};

// Export default service object
export default {
  loadBibleData,
  getBooks,
  getBook,
  getChapter,
  getVerse,
  getReadingPlanText,
  searchVerses,
  getBooksByTestament,
  getBookVerseCount,
  formatVerseReference,
};
