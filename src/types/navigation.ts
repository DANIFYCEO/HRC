// Navigation type definitions for React Navigation

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

// Root Stack Navigator params
export type RootStackParamList = {
  MainTabs: undefined;
  SignIn: undefined;
  SignUp: undefined;
  BibleScreen: undefined;
  SundaySchoolScreen: undefined;
  LessonViewerScreen: { lessonId: number; lessonTitle: string };
  ReadingPlanScreen: undefined;
  PrayerRequestScreen: undefined;
  ProfileEditScreen: undefined;
  NotificationSettingsScreen: undefined;
  ChangePasswordScreen: undefined;
};

// Bottom Tab Navigator params
export type TabParamList = {
  Home: undefined;
  Events: undefined;
  Settings: undefined;
};

// Combined navigation props for screens in tabs
export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  StackScreenProps<RootStackParamList>
>;

// Navigation props for stack screens
export type StackScreenNavigationProp<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

// Specific screen props
export type HomeScreenProps = TabScreenProps<'Home'>;
export type EventsScreenProps = TabScreenProps<'Events'>;
export type SettingsScreenProps = TabScreenProps<'Settings'>;
export type BibleScreenProps = StackScreenNavigationProp<'BibleScreen'>;
export type SundaySchoolScreenProps = StackScreenNavigationProp<'SundaySchoolScreen'>;
export type LessonViewerScreenProps = StackScreenNavigationProp<'LessonViewerScreen'>;
export type ReadingPlanScreenProps = StackScreenNavigationProp<'ReadingPlanScreen'>;
export type PrayerRequestScreenProps = StackScreenNavigationProp<'PrayerRequestScreen'>;
export type ProfileEditScreenProps = StackScreenNavigationProp<'ProfileEditScreen'>;
export type NotificationSettingsScreenProps = StackScreenNavigationProp<'NotificationSettingsScreen'>;
export type SignInScreenProps = StackScreenNavigationProp<'SignIn'>;
export type SignUpScreenProps = StackScreenNavigationProp<'SignUp'>;
