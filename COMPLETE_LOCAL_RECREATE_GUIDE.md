# HRC Church App - Complete Local Recreate Guide

## 🎯 PERFECT SOLUTION - Build on Your Computer

Since Compyle doesn't allow easy file access, let's recreate your complete church app locally. This will be faster and give you full control!

---

## 📱 STEP 1: CREATE NEW PROJECT (5 minutes)

On your computer (Windows/Mac/Linux):

```bash
# 1. Install Node.js first if not installed (download from nodejs.org)

# 2. Create new React Native project
npx create-expo-app HRC-Church
cd HRC-Church

# 3. Install required packages
npm install firebase
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install @react-native-async-storage/async-storage
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm install react-native-screens react-native-safe-area-context
npm install @expo/vector-icons expo-file-system expo-image-picker expo-notifications
```

---

## 📋 STEP 2: PROJECT STRUCTURE

Create these folders in your HRC-Church project:

```
HRC-Church/
├── src/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── navigation/
│   ├── screens/
│   ├── services/
│   └── types/
├── assets/
│   ├── bible/
│   ├── lessons/
│   └── images/
└── app.json
```

---

## 📄 STEP 3: CONFIGURATION FILES

### app.json (Replace existing content):
```json
{
  "expo": {
    "name": "He Reigns Chapel",
    "slug": "hrc-church",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.hereignschapel.app"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-image-picker",
      "expo-notifications"
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id-here"
      }
    }
  }
}
```

### package.json (Update scripts section):
```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web"
},
```

---

## 🔥 STEP 4: FIREBASE CONFIGURATION

### src/constants/Config.ts:
```typescript
export const Config = {
  // Firebase Configuration (REPLACE WITH YOURS)
  firebase: {
    apiKey: 'AIzaSyDmo9dxOTlTgwhpJ26BqKIYaZLPNUXVapA',
    authDomain: 'hrc-app-e7d59.firebaseapp.com',
    projectId: 'hrc-app-e7d59',
    storageBucket: 'hrc-app-e7d59.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:android:abc123def456'
  },

  // App Configuration
  appName: 'He Reigns Chapel',
  version: '1.0.0',

  // Storage Keys
  storageKeys: {
    userToken: '@hrc_user_token',
    userProfile: '@hrc_user_profile',
    theme: '@hrc_theme',
    bibleBookmarks: '@hrc_bible_bookmarks',
    readingProgress: '@hrc_reading_progress',
    notifications: '@hrc_notifications'
  },

  // Default Settings
  defaultSettings: {
    theme: 'light',
    fontSize: 'medium',
    autoPlayAudio: false
  }
};
```

---

## 🎨 STEP 5: CORE APP FILES

### App.tsx:
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { SettingsProvider } from './src/context/SettingsContext';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
}
```

### src/navigation/AppNavigator.tsx:
```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Import Screens (will create in next steps)
import WelcomeScreen from '../screens/WelcomeScreen';
import AuthScreen from '../screens/AuthScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import HomeScreen from '../screens/HomeScreen';
import BibleScreen from '../screens/BibleScreen';
import BibleChapterScreen from '../screens/BibleChapterScreen';
import SundaySchoolScreen from '../screens/SundaySchoolScreen';
import PrayerRequestScreen from '../screens/PrayerRequestScreen';
import EventsScreen from '../screens/EventsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { colors, theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Bible':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'Lessons':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'Prayer':
              iconName = focused ? 'pray' : 'pray-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.backgroundCard,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.backgroundCard,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.textPrimary,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen
        name="Bible"
        component={BibleScreen}
        options={{ title: 'Bible' }}
      />
      <Tab.Screen
        name="Lessons"
        component={SundaySchoolScreen}
        options={{ title: 'Lessons' }}
      />
      <Tab.Screen
        name="Prayer"
        component={PrayerRequestScreen}
        options={{ title: 'Prayer' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.backgroundCard,
        },
        headerTintColor: colors.textPrimary,
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BibleChapter"
        component={BibleChapterScreen}
        options={{ title: 'Bible Chapter' }}
      />
      <Stack.Screen
        name="Events"
        component={EventsScreen}
        options={{ title: 'Church Events' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
```

---

## 🏗️ STEP 6: CONTEXT PROVIDERS

### src/context/ThemeContext.tsx:
```typescript
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Config } from '../constants/Config';

export const ThemeContext = createContext();

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const colors = {
    light: {
      primary: '#2563eb',
      secondary: '#10b981',
      background: '#ffffff',
      backgroundCard: '#f3f4f6',
      textPrimary: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
    },
    dark: {
      primary: '#3b82f6',
      secondary: '#34d399',
      background: '#111827',
      backgroundCard: '#1f2937',
      textPrimary: '#f9fafb',
      textSecondary: '#d1d5db',
      border: '#374151',
      error: '#f87171',
      warning: '#fbbf24',
      success: '#34d399',
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    AsyncStorage.setItem(Config.storageKeys.theme, newTheme);
  };

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(Config.storageKeys.theme);
      if (savedTheme) {
        setTheme(savedTheme as 'light' | 'dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      colors: colors[theme],
      toggleTheme,
      setTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

---

## ⏭️ NEXT STEPS

This covers the **complete foundation** of your church app!

**What you need to do next:**

1. **Create the project** using the commands above
2. **Add the files** I've provided
3. **I'll provide** all the remaining screens and components

**Your app will have:**
✅ Complete navigation system
✅ Theme support (dark/light)
✅ Firebase integration ready
✅ Bottom tab navigation
✅ Beautiful UI foundation

**Would you like me to continue with the remaining screens and components?**

I can provide:
- All screen components (Bible, Prayer Request, Events, etc.)
- Firebase services for authentication and database
- Complete UI components
- KJV Bible data integration
- APK build instructions

**Your He Reigns Chapel app will be fully functional on your local computer!** 🎉