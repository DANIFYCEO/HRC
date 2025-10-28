# He Reigns Chapel Mobile App

A cross-platform mobile app for He Reigns Chapel (Powerline Living Water Ministries) built with React Native/Expo. The app provides spiritual resources including Bible study, Sunday School lessons, daily reading plans, and prayer request submission.

## Project Status

### ✅ Phase 1: Core Infrastructure (COMPLETED)

The foundation of the app has been successfully implemented with a clean, scalable architecture:

**Completed Components:**
- ✅ React Native/Expo project initialized with TypeScript
- ✅ Complete project folder structure created
- ✅ All core dependencies installed (navigation, Firebase, UI libraries)
- ✅ Constants defined (Colors, Contacts, Layout, Config)
- ✅ TypeScript types for all data models
- ✅ Context providers (Auth, Theme, Settings)
- ✅ Navigation structure (Bottom tabs + Stack navigation)
- ✅ Firebase services (Auth, Firestore, Storage)
- ✅ All screen placeholders created
- ✅ Home screen fully implemented with design from mockup
- ✅ App.tsx configured with all providers
- ✅ TypeScript compilation verified (no errors)

## Architecture

### Project Structure

```
HRC/
├── App.tsx                    # Root component with providers
├── src/
│   ├── navigation/            # Navigation configuration
│   │   ├── AppNavigator.tsx   # Stack navigation
│   │   └── TabNavigator.tsx   # Bottom tabs
│   ├── screens/               # All screen components
│   │   ├── HomeScreen.tsx     # ✅ Fully implemented
│   │   ├── EventsScreen.tsx   # Placeholder
│   │   ├── SettingsScreen.tsx # Placeholder
│   │   └── ...                # Other screens (placeholders)
│   ├── components/            # Reusable UI components (to be built)
│   ├── services/              # Backend services
│   │   ├── firebase.ts        # ✅ Firebase initialization
│   │   ├── auth.ts            # ✅ Authentication methods
│   │   ├── firestore.ts       # ✅ Database operations
│   │   └── ...                # Other services (to be built)
│   ├── context/               # Global state management
│   │   ├── AuthContext.tsx    # ✅ Auth state
│   │   ├── ThemeContext.tsx   # ✅ Theme (dark/light)
│   │   └── SettingsContext.tsx # ✅ App settings
│   ├── constants/             # App constants
│   │   ├── Colors.ts          # ✅ Color palette
│   │   ├── Contacts.ts        # ✅ Church info
│   │   ├── Layout.ts          # ✅ Spacing/sizing
│   │   └── Config.ts          # ✅ App configuration
│   ├── types/                 # TypeScript definitions
│   ├── utils/                 # Helper functions (to be built)
│   └── hooks/                 # Custom hooks (to be built)
└── assets/                    # Images, fonts, etc.
```

## Tech Stack

- **Framework:** React Native with Expo SDK 54
- **Language:** TypeScript
- **Navigation:** React Navigation 6 (Stack + Bottom Tabs)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **State Management:** React Context API
- **Styling:** React Native StyleSheet API
- **Icons:** @expo/vector-icons

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo Go app (for testing on physical devices)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd HRC
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com
   - Register your app (iOS and Android)
   - Update `src/constants/Config.ts` with your Firebase credentials:
     ```typescript
     firebase: {
       apiKey: 'YOUR_API_KEY',
       authDomain: 'YOUR_AUTH_DOMAIN',
       projectId: 'YOUR_PROJECT_ID',
       storageBucket: 'YOUR_STORAGE_BUCKET',
       messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
       appId: 'YOUR_APP_ID',
     }
     ```

4. **Configure API.Bible:**
   - Get an API key from https://scripture.api.bible
   - Update `src/constants/Config.ts`:
     ```typescript
     api: {
       bibleApiKey: 'YOUR_BIBLE_API_KEY',
     }
     ```

5. **Run the app:**
   ```bash
   npm start
   # Then press:
   # - 'a' for Android
   # - 'i' for iOS
   # - 'w' for web
   ```

## Features

### Implemented Features

#### Home Screen ✅
- Church logo and branding
- Welcome banner with tagline
- 4 spiritual resource cards:
  - Bible (Read & Study)
  - Sunday School (24 Lessons)
  - Bible in One Year (Daily Reading)
  - Prayer Requests (Send to Pastor)
- Quick actions row:
  - Submit Prayer
  - WhatsApp Pastor
  - Next Service
  - Share App
  - Call Office

#### Navigation System ✅
- Bottom tab navigation (Home, Events, Settings)
- Stack navigation for sub-screens
- Consistent header styling
- Smooth transitions

#### Theme System ✅
- Dark mode (default)
- Light mode available
- Persistent theme preference
- Smooth theme switching

#### Authentication System ✅
- Firebase Auth integration
- Guest mode support
- User profile management
- Context-based auth state

#### Settings Management ✅
- Font size preferences
- Bible translation selection
- Notification preferences
- Persistent storage with AsyncStorage

### Features To Be Implemented

The following features are specified in `planning.md` and need to be built:

#### Bible Screen
- Book selection (Old/New Testament)
- Chapter reading with verse numbers
- API.Bible integration
- Translation selector
- Offline caching
- Navigation between chapters

#### Sunday School Screen
- 24 PDF lesson library
- PDF viewer integration
- Lesson navigation
- Share functionality

#### Reading Plans Screen
- 4 reading plan options
- Progress tracking
- Calendar view
- Daily reading reminders
- Streak counting

#### Prayer Request Screen
- Form with validation
- WhatsApp integration
- Pre-filled message templates
- Submit to pastor (+2348051368669)

#### Events Screen
- Weekly recurring services display
- Special events from Firestore
- Reminder toggles
- Add to calendar functionality

#### Settings Screen
- Profile editing
- Photo upload
- Theme toggle
- Font size selector
- Notification settings
- Contact actions (call, WhatsApp, map)

## Configuration

### Church Contact Information

All church contact details are defined in `src/constants/Contacts.ts`:

- **Pastor WhatsApp:** +2348051368669
- **Church Office:** 08168007749
- **Support WhatsApp:** 07042650401
- **Address:** No 1 mission road, Ata Udo Usung, Ikot Abasi, Akwa Ibom State

### Service Times

Defined in `src/constants/Config.ts`:

- **Tuesday:** Bible Study - 6:00 PM
- **Thursday:** Victory Service - 6:00 PM
- **Sunday:** Worship Service - 8:00 AM

## Development Guidelines

### Adding a New Screen

1. Create screen file in `src/screens/YourScreen.tsx`
2. Add route to `src/types/navigation.ts`
3. Register in `src/navigation/AppNavigator.tsx`
4. Implement screen following existing patterns

### Adding a New Service

1. Create service file in `src/services/yourService.ts`
2. Define types in `src/types/`
3. Export functions with proper error handling
4. Document functions with JSDoc comments

### Styling Guidelines

- Use `useTheme()` hook for colors
- Import spacing from `Layout` constant
- Follow existing component patterns
- Ensure dark and light theme compatibility

## Firebase Setup

### Required Firebase Features

1. **Authentication:**
   - Email/Password provider enabled
   - Optional: Google/Apple sign-in for future

2. **Firestore Collections:**
   - `users` - User profiles
   - `reading_progress` - Reading plan tracking
   - `events` - Church events
   - `app_settings` - App configuration

3. **Storage:**
   - User profile photos
   - Event flyers/images

### Security Rules

Firestore security rules should restrict access:
- Users can only read/write their own data
- Events are read-only for users
- App settings are read-only for users

## Testing

### Manual Testing Checklist

- [ ] App launches without errors
- [ ] Navigation between tabs works
- [ ] Theme toggle switches correctly
- [ ] Firebase integration (when configured)
- [ ] All placeholder screens accessible
- [ ] No console warnings or errors

### Run TypeScript Check

```bash
npx tsc --noEmit
```

## Next Steps

### Immediate Priorities

1. **Implement remaining screens:**
   - Bible screen with API.Bible integration
   - Sunday School with PDF viewer
   - Reading Plans with progress tracking
   - Prayer Request form with WhatsApp
   - Events screen with recurring services
   - Settings screen with all options

2. **Add utility functions:**
   - WhatsApp deep linking helper
   - Phone dialer integration
   - Map integration for church location
   - Share functionality
   - Date/time helpers

3. **Create reusable components:**
   - CustomButton
   - CustomInput
   - LoadingSpinner
   - ResourceCard
   - QuickActionButton
   - EventCard
   - ServiceCard

4. **Implement services:**
   - Bible API service
   - Notification service
   - Storage service (for images)
   - Cache service (for offline access)

5. **Add assets:**
   - Church logo image
   - App icon
   - Splash screen
   - 24 Sunday School PDF files

### Future Enhancements (Post-MVP)

- Push notifications for announcements
- Live streaming integration
- Sermon library
- Giving/donations feature
- Community discussion forums
- Multi-language support
- Bible highlights and notes
- Social media sharing

## Deployment

### iOS Deployment

1. Create Apple Developer account
2. Configure app.json for iOS
3. Build with EAS Build
4. Submit to App Store

### Android Deployment

1. Create Google Play Developer account
2. Configure app.json for Android
3. Build with EAS Build
4. Submit to Google Play

## Contributing

This is a church app project. For questions or contributions, contact the development team.

## License

Proprietary - He Reigns Chapel (Powerline Living Water Ministries)

## Support

For technical support or questions:
- WhatsApp: 07042650401
- Church Office: 08168007749

---

**Built with ❤️ for He Reigns Chapel**

*Powerline Living Water Ministries*
