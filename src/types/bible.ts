// API.Bible type definitions

// Bible translation
export interface BibleTranslation {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  language: {
    id: string;
    name: string;
  };
}

// Bible book
export interface BibleBook {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
}

// Bible chapter
export interface BibleChapter {
  id: string;
  bibleId: string;
  bookId: string;
  number: string;
  content: string;
  copyright?: string;
  reference: string;
  verseCount: number;
  next?: {
    id: string;
    number: string;
  };
  previous?: {
    id: string;
    number: string;
  };
}

// Bible verse
export interface BibleVerse {
  id: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright?: string;
}

// API response wrapper
export interface BibleApiResponse<T> {
  data: T;
}

// API error response
export interface BibleApiError {
  statusCode: number;
  error: string;
  message: string;
}

// Cached Bible content for offline access
export interface CachedBibleChapter {
  chapterId: string;
  content: BibleChapter;
  cachedAt: number; // timestamp
}

// Bible reading for a day (used in reading plans)
export interface DailyReading {
  day: number;
  readings: {
    book: string;
    startChapter: number;
    endChapter: number;
    startVerse?: number;
    endVerse?: number;
  }[];
}
