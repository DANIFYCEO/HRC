// General app type definitions

export type Theme = 'light' | 'dark';

export type FontSize = 'small' | 'medium' | 'large' | 'extraLarge';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReadingProgress {
  userId: string;
  planId: string;
  startDate: Date;
  completedDays: number[];
  currentDay: number;
  lastReadDate: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  location?: string;
  imageUrl?: string;
  isRecurring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringService {
  name: string;
  time: string;
  day: number; // 0-6 (Sunday-Saturday)
}

export interface AppSettings {
  recurringServices: {
    tuesday: RecurringService;
    thursday: RecurringService;
    sunday: RecurringService;
  };
  contacts: {
    pastorWhatsApp: string;
    churchOffice: string;
    supportWhatsApp: string;
  };
  churchInfo: {
    name: string;
    tagline: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export interface ReadingPlan {
  id: string;
  name: string;
  duration: number;
  description: string;
}

export interface PrayerRequest {
  name: string;
  request: string;
  contact?: string;
  urgency: 'routine' | 'urgent';
}

export interface NotificationSettings {
  dailyReadingReminder: boolean;
  readingReminderTime: string;
  tuesdayService: boolean;
  thursdayService: boolean;
  sundayService: boolean;
  specialEvents: boolean;
  reminderTiming: number; // minutes before
}

export interface UserPreferences {
  theme: Theme;
  bibleTranslation: string;
  fontSize: FontSize;
  notifications: NotificationSettings;
}

export interface Lesson {
  id: number;
  title: string;
  filename: string;
}
