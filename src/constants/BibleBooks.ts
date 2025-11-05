// Bible books metadata
// 66 books: 39 Old Testament + 27 New Testament

export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: 'old' | 'new';
}

export const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament (39 books)
  { id: 'gn', name: 'Genesis', chapters: 50, testament: 'old' },
  { id: 'ex', name: 'Exodus', chapters: 40, testament: 'old' },
  { id: 'lv', name: 'Leviticus', chapters: 27, testament: 'old' },
  { id: 'nm', name: 'Numbers', chapters: 36, testament: 'old' },
  { id: 'dt', name: 'Deuteronomy', chapters: 34, testament: 'old' },
  { id: 'js', name: 'Joshua', chapters: 24, testament: 'old' },
  { id: 'jud', name: 'Judges', chapters: 21, testament: 'old' },
  { id: 'rt', name: 'Ruth', chapters: 4, testament: 'old' },
  { id: '1sm', name: '1 Samuel', chapters: 31, testament: 'old' },
  { id: '2sm', name: '2 Samuel', chapters: 24, testament: 'old' },
  { id: '1kgs', name: '1 Kings', chapters: 22, testament: 'old' },
  { id: '2kgs', name: '2 Kings', chapters: 25, testament: 'old' },
  { id: '1ch', name: '1 Chronicles', chapters: 29, testament: 'old' },
  { id: '2ch', name: '2 Chronicles', chapters: 36, testament: 'old' },
  { id: 'ezr', name: 'Ezra', chapters: 10, testament: 'old' },
  { id: 'ne', name: 'Nehemiah', chapters: 13, testament: 'old' },
  { id: 'et', name: 'Esther', chapters: 10, testament: 'old' },
  { id: 'job', name: 'Job', chapters: 42, testament: 'old' },
  { id: 'ps', name: 'Psalms', chapters: 150, testament: 'old' },
  { id: 'prv', name: 'Proverbs', chapters: 31, testament: 'old' },
  { id: 'ec', name: 'Ecclesiastes', chapters: 12, testament: 'old' },
  { id: 'so', name: 'Song of Solomon', chapters: 8, testament: 'old' },
  { id: 'is', name: 'Isaiah', chapters: 66, testament: 'old' },
  { id: 'jr', name: 'Jeremiah', chapters: 52, testament: 'old' },
  { id: 'lm', name: 'Lamentations', chapters: 5, testament: 'old' },
  { id: 'ez', name: 'Ezekiel', chapters: 48, testament: 'old' },
  { id: 'dn', name: 'Daniel', chapters: 12, testament: 'old' },
  { id: 'ho', name: 'Hosea', chapters: 14, testament: 'old' },
  { id: 'jl', name: 'Joel', chapters: 3, testament: 'old' },
  { id: 'am', name: 'Amos', chapters: 9, testament: 'old' },
  { id: 'ob', name: 'Obadiah', chapters: 1, testament: 'old' },
  { id: 'jn', name: 'Jonah', chapters: 4, testament: 'old' },
  { id: 'mi', name: 'Micah', chapters: 7, testament: 'old' },
  { id: 'na', name: 'Nahum', chapters: 3, testament: 'old' },
  { id: 'hk', name: 'Habakkuk', chapters: 3, testament: 'old' },
  { id: 'zp', name: 'Zephaniah', chapters: 3, testament: 'old' },
  { id: 'hg', name: 'Haggai', chapters: 2, testament: 'old' },
  { id: 'zc', name: 'Zechariah', chapters: 14, testament: 'old' },
  { id: 'ml', name: 'Malachi', chapters: 4, testament: 'old' },

  // New Testament (27 books)
  { id: 'mt', name: 'Matthew', chapters: 28, testament: 'new' },
  { id: 'mk', name: 'Mark', chapters: 16, testament: 'new' },
  { id: 'lk', name: 'Luke', chapters: 24, testament: 'new' },
  { id: 'jo', name: 'John', chapters: 21, testament: 'new' },
  { id: 'act', name: 'Acts', chapters: 28, testament: 'new' },
  { id: 'rm', name: 'Romans', chapters: 16, testament: 'new' },
  { id: '1co', name: '1 Corinthians', chapters: 16, testament: 'new' },
  { id: '2co', name: '2 Corinthians', chapters: 13, testament: 'new' },
  { id: 'gl', name: 'Galatians', chapters: 6, testament: 'new' },
  { id: 'eph', name: 'Ephesians', chapters: 6, testament: 'new' },
  { id: 'ph', name: 'Philippians', chapters: 4, testament: 'new' },
  { id: 'cl', name: 'Colossians', chapters: 4, testament: 'new' },
  { id: '1ts', name: '1 Thessalonians', chapters: 5, testament: 'new' },
  { id: '2ts', name: '2 Thessalonians', chapters: 3, testament: 'new' },
  { id: '1tm', name: '1 Timothy', chapters: 6, testament: 'new' },
  { id: '2tm', name: '2 Timothy', chapters: 4, testament: 'new' },
  { id: 'tt', name: 'Titus', chapters: 3, testament: 'new' },
  { id: 'phm', name: 'Philemon', chapters: 1, testament: 'new' },
  { id: 'hb', name: 'Hebrews', chapters: 13, testament: 'new' },
  { id: 'jm', name: 'James', chapters: 5, testament: 'new' },
  { id: '1pe', name: '1 Peter', chapters: 5, testament: 'new' },
  { id: '2pe', name: '2 Peter', chapters: 3, testament: 'new' },
  { id: '1jo', name: '1 John', chapters: 5, testament: 'new' },
  { id: '2jo', name: '2 John', chapters: 1, testament: 'new' },
  { id: '3jo', name: '3 John', chapters: 1, testament: 'new' },
  { id: 'jd', name: 'Jude', chapters: 1, testament: 'new' },
  { id: 're', name: 'Revelation', chapters: 22, testament: 'new' },
];

// Helper functions
export const getOldTestamentBooks = (): BibleBook[] => {
  return BIBLE_BOOKS.filter(book => book.testament === 'old');
};

export const getNewTestamentBooks = (): BibleBook[] => {
  return BIBLE_BOOKS.filter(book => book.testament === 'new');
};

export const getBookById = (id: string): BibleBook | undefined => {
  return BIBLE_BOOKS.find(book => book.id.toLowerCase() === id.toLowerCase());
};

export const getBookByName = (name: string): BibleBook | undefined => {
  return BIBLE_BOOKS.find(
    book => book.name.toLowerCase() === name.toLowerCase()
  );
};

export default BIBLE_BOOKS;
