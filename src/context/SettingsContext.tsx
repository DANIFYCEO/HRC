// SettingsContext - Global app settings management

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/Config';
import { FontSize, NotificationSettings, UserPreferences } from '../types';

interface SettingsContextType {
  fontSize: FontSize;
  bibleTranslation: string;
  notifications: NotificationSettings;
  setFontSize: (size: FontSize) => Promise<void>;
  setBibleTranslation: (translation: string) => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  loadSettings: () => Promise<void>;
}

const defaultNotifications: NotificationSettings = {
  dailyReadingReminder: false,
  readingReminderTime: Config.notifications.readingReminderDefault,
  tuesdayService: false,
  thursdayService: false,
  sundayService: false,
  specialEvents: false,
  reminderTiming: Config.notifications.serviceReminderMinutes,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [bibleTranslation, setBibleTranslationState] = useState(
    Config.api.defaultBibleTranslation
  );
  const [notifications, setNotificationsState] =
    useState<NotificationSettings>(defaultNotifications);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load font size
      const savedFontSize = await AsyncStorage.getItem(Config.storageKeys.fontSize);
      if (
        savedFontSize === 'small' ||
        savedFontSize === 'medium' ||
        savedFontSize === 'large' ||
        savedFontSize === 'extraLarge'
      ) {
        setFontSizeState(savedFontSize);
      }

      // Load Bible translation
      const savedTranslation = await AsyncStorage.getItem(Config.storageKeys.bibleTranslation);
      if (savedTranslation) {
        setBibleTranslationState(savedTranslation);
      }

      // Load notification settings
      const savedNotifications = await AsyncStorage.getItem(Config.storageKeys.notifications);
      if (savedNotifications) {
        setNotificationsState(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const setFontSize = async (size: FontSize) => {
    try {
      await AsyncStorage.setItem(Config.storageKeys.fontSize, size);
      setFontSizeState(size);
    } catch (error) {
      console.error('Error saving font size:', error);
      throw error;
    }
  };

  const setBibleTranslation = async (translation: string) => {
    try {
      await AsyncStorage.setItem(Config.storageKeys.bibleTranslation, translation);
      setBibleTranslationState(translation);
    } catch (error) {
      console.error('Error saving Bible translation:', error);
      throw error;
    }
  };

  const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...notifications, ...settings };
      await AsyncStorage.setItem(Config.storageKeys.notifications, JSON.stringify(updatedSettings));
      setNotificationsState(updatedSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      throw error;
    }
  };

  const value = {
    fontSize,
    bibleTranslation,
    notifications,
    setFontSize,
    setBibleTranslation,
    updateNotificationSettings,
    loadSettings,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

// Custom hook to use settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
