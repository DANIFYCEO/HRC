// AppNavigator - Root navigator with stack navigation

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../types/navigation';

// Import navigators and screens
import TabNavigator from './TabNavigator';

// Import screens (will be created later)
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import BibleScreen from '../screens/BibleScreen';
import BibleChapterScreen from '../screens/BibleChapterScreen';
import SundaySchoolScreen from '../screens/SundaySchoolScreen';
import LessonViewerScreen from '../screens/LessonViewerScreen';
import ReadingPlanScreen from '../screens/ReadingPlanScreen';
import PrayerRequestScreen from '../screens/PrayerRequestScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.backgroundCard,
            borderBottomColor: colors.border,
            borderBottomWidth: 1,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {/* Main Tabs (Home, Events, Settings) */}
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />

        {/* Auth Screens */}
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ title: 'Create Account' }}
        />

        {/* Feature Screens */}
        <Stack.Screen
          name="BibleScreen"
          component={BibleScreen}
          options={{ title: 'Bible' }}
        />
        <Stack.Screen
          name="SundaySchoolScreen"
          component={SundaySchoolScreen}
          options={{ title: 'Sunday School' }}
        />
        <Stack.Screen
          name="LessonViewerScreen"
          component={LessonViewerScreen}
          options={({ route }) => ({ title: route.params.lessonTitle || 'Lesson' })}
        />
        <Stack.Screen
          name="ReadingPlanScreen"
          component={ReadingPlanScreen}
          options={{ title: 'Reading Plans' }}
        />
        <Stack.Screen
          name="PrayerRequestScreen"
          component={PrayerRequestScreen}
          options={{ title: 'Prayer Request' }}
        />

        {/* Settings Screens */}
        <Stack.Screen
          name="ProfileEditScreen"
          component={ProfileEditScreen}
          options={{ title: 'Edit Profile' }}
        />
        <Stack.Screen
          name="NotificationSettingsScreen"
          component={NotificationSettingsScreen}
          options={{ title: 'Notifications' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
