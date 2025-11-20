# Android APK Build Guide for He Reigns Chapel App

This guide explains how to build the Android APK for distribution via Xender.

## Prerequisites

1. **Expo Account**: Create account at [expo.dev](https://expo.dev)
2. **EAS CLI**: Install globally (if not already installed)
   ```bash
   npm install -g eas-cli
   ```

## Step 1: Login to Expo

```bash
eas login
```
Enter your Expo account credentials.

## Step 2: Configure EAS

```bash
eas build:configure
```
This creates the `eas.json` file (already included in this project).

## Step 3: Update Firebase Configuration

Before building, make sure you've completed the Firebase setup in `FIREBASE_SETUP.md`:

1. ✅ Created Firebase project
2. ✅ Updated `src/constants/Config.ts` with Firebase config
3. ✅ Enabled Authentication and Firestore
4. ✅ Set up security rules

## Step 4: Build the APK

### Development Build (for testing)

```bash
eas build --platform android --profile preview
```

### Production Build (for distribution)

```bash
eas build --platform android --profile production
```

The build process:
- Takes 10-20 minutes
- Runs on Expo's cloud servers
- Provides a download link when complete
- Stores build logs in your Expo dashboard

## Step 5: Download the APK

1. EAS Build provides a download URL in the terminal
2. Also available at [expo.dev](https://expo.dev) → Projects → Builds
3. Download the APK file (e.g., `build-abc123.apk`)

## Step 6: Test the APK

### Installation
1. Enable "Unknown sources" in Android device settings
2. Transfer APK to device (USB, download, or file sharing)
3. Tap APK file to install

### Testing Checklist
- [ ] App launches successfully
- [ ] Bible reading works offline (downloaded JSON)
- [ ] Sunday School PDFs open correctly
- [ ] Reading plan loads and tracks progress
- [ ] WhatsApp integration works (requires internet)
- [ ] Authentication works (requires internet)
- [ ] Prayer requests save to Firebase (requires internet)
- [ ] Navigation flows smoothly
- [ ] Dark/light theme toggle works
- [ ] No crashes on startup

## Step 7: Share via Xender

1. Install Xender on your device
2. Open Xender and select the APK file
3. Share to other devices
4. Recipients can install without internet connection

## APK Details

### Expected File Size
- **Base app**: ~30-40 MB
- **Bible JSON**: ~6.9 MB
- **24 PDF lessons**: ~18-20 MB
- **Total**: **~55-60 MB**

### APK Information
- **Package Name**: `com.hereignschapel.app`
- **Version**: `1.0.0` (versionCode: 1)
- **Minimum Android**: API 21 (Android 5.0)
- **Target Android**: API 34 (Android 14)
- **Permissions**:
  - Camera (for profile photos)
  - Storage (for file access)
  - Notifications (for reminders)
  - Internet (for Firebase services)

## Build Optimization

The app is optimized for size and performance:

- **ProGuard enabled**: Removes unused code
- **Resource shrinking enabled**: Removes unused resources
- **Offline-first**: Core features work without internet
- **Asset bundling**: Bible data and PDFs bundled in APK

## Troubleshooting

### Common Build Issues

1. **"Expo account not found"**
   - Run `eas login` again
   - Check your email/username

2. **"Firebase not configured"**
   - Verify Firebase config in `src/constants/Config.ts`
   - Ensure all required Firebase values are set

3. **Build timeout**
   - Try again - sometimes build servers are busy
   - Check build logs in Expo dashboard

4. **APK crashes on install**
   - Test on different Android versions
   - Check device storage space
   - Enable installation from unknown sources

5. **Large APK size**
   - Already optimized with ProGuard and resource shrinking
   - 55-60 MB is reasonable for this feature set

### Get Help
- EAS Build documentation: https://docs.expo.dev/build/introduction/
- Expo Discord community: https://discord.gg/expo
- Firebase support: https://firebase.google.com/support

## Version Management

For future updates:
1. Update `version` in `app.json` (e.g., "1.0.0" → "1.0.1")
2. Update `versionCode` in `app.json` (e.g., 1 → 2)
3. Run `eas build --platform android --profile production`

Each new build will have a different URL and file name.

## Distribution

The APK is ready for:
- ✅ Xender sharing (peer-to-peer)
- ✅ Direct APK distribution
- ✅ Sideloading on Android devices
- ✅ Testing before Google Play Store submission

**Note**: For Google Play Store distribution, you'll need:
- Google Play Developer account ($25 fee)
- App signing key
- Store listing with screenshots and descriptions
- Privacy policy URL
- Content rating questionnaire

## Success!

Your He Reigns Chapel app is now ready for distribution. The APK contains:
- Complete KJV Bible (offline)
- All 24 Sunday School lessons (offline)
- Reading plan functionality
- Prayer request system
- Church contact information
- WhatsApp integration

The app works offline for core Bible features and requires internet only for:
- User authentication
- Prayer request syncing
- Special events
- WhatsApp sharing

God bless your ministry! 🙏