// App configuration constants

export const Config = {
  // App information
  appName: 'He Reigns Chapel',
  appVersion: '1.0.0',
  appTagline: 'Powerline Living Water Ministries',

  // API Configuration
  api: {
    bibleApiBaseUrl: 'https://api.scripture.api.bible/v1',
    bibleApiKey: '', // TODO: Add API key from https://scripture.api.bible
    defaultBibleTranslation: 'de4e12af7f28f599-02', // KJV Bible ID
  },

  // Firebase Configuration
  firebase: {
    apiKey: 'AIzaSyDmo9dxOTlTgwhpJ26BqKIYaZLPNUXVapA',
    authDomain: 'hrc-app-e7d59.firebaseapp.com',
    projectId: 'hrc-app-e7d59',
    storageBucket: 'hrc-app-e7d59.appspot.com',
    messagingSenderId: '966073822149',
    appId: '1:966073822149:android:b1621ebbf0061f87a2f9ac',
  },

  // Storage keys for AsyncStorage
  storageKeys: {
    theme: '@HRC:theme',
    user: '@HRC:user',
    bibleTranslation: '@HRC:bibleTranslation',
    fontSize: '@HRC:fontSize',
    notifications: '@HRC:notifications',
    readingPlan: '@HRC:readingPlan',
    bibleCache: '@HRC:bibleCache',
  },

  // Cache settings
  cache: {
    bibleMaxCachedChapters: 10,
    cacheExpiryDays: 7,
  },

  // Reading plans
  readingPlans: {
    bibleOneYearChronological: {
      id: 'bible_one_year_chronological',
      name: 'Bible in One Year (Chronological)',
      duration: 365,
      description: 'Read the Bible in historical order',
    },
    bibleOneYearCanonical: {
      id: 'bible_one_year_canonical',
      name: 'Bible in One Year (Canonical)',
      duration: 365,
      description: 'Read from Genesis to Revelation',
    },
    newTestament90Days: {
      id: 'new_testament_90_days',
      name: 'New Testament in 90 Days',
      duration: 90,
      description: 'Complete the New Testament in 3 months',
    },
    psalmsProverbs30Days: {
      id: 'psalms_proverbs_30_days',
      name: 'Psalms & Proverbs in 30 Days',
      duration: 30,
      description: 'Daily wisdom from Psalms and Proverbs',
    },
  },

  // Service times
  services: {
    tuesday: {
      name: 'Bible Study',
      time: '18:00',
      day: 2, // Tuesday = 2 (0 = Sunday)
    },
    thursday: {
      name: 'Victory Service',
      time: '18:00',
      day: 4, // Thursday = 4
    },
    sunday: {
      name: 'Worship Service',
      time: '08:00',
      day: 0, // Sunday = 0
    },
  },

  // Notification settings
  notifications: {
    readingReminderDefault: '08:00', // 8 AM
    serviceReminderMinutes: 60, // Remind 1 hour before
  },

  // Sunday School lessons
  sundaySchool: {
    totalLessons: 24,
    lessonPrefix: 'lesson_',
    lessonExtension: '.pdf',
  },

  // Feature flags
  features: {
    enableGuestMode: true,
    enablePushNotifications: true,
    enableOfflineMode: true,
    enableSocialSharing: true,
  },
};

export default Config;
