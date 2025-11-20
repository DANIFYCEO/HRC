# Firebase Setup Guide for He Reigns Chapel App

Follow these steps to set up Firebase for the He Reigns Chapel mobile app.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Project name: `HeReignsChapel` or `HRC-App`
4. Enable Google Analytics: Optional (recommended)
5. Click "Create project"

## Step 2: Register Android App

1. In Firebase Console, click "Add app" → Android icon
2. Android package name: `com.hereignschapel.app`
3. App nickname: `HRC Android`
4. Debug signing certificate: Skip (not needed for EAS Build)
5. Click "Register app"
6. **Download google-services.json?** **Skip** - EAS manages this automatically
7. Click "Continue to console"

## Step 3: Get Firebase Configuration

1. In Project Settings → General → Your apps → Android app
2. Scroll to "SDK setup and configuration"
3. Copy the `firebaseConfig` object:
```javascript
{
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:android:abc123def456"
}
```

## Step 4: Update App Configuration

Update `src/constants/Config.ts` with your Firebase config:

```typescript
firebase: {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'your-project-id.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project-id.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
},
```

## Step 5: Enable Firebase Services

### Authentication
1. Firebase Console → Authentication → Get Started
2. Sign-in method tab → Enable "Email/Password"
3. Save

### Firestore Database
1. Firebase Console → Firestore Database → Create database
2. Start in **production mode** (we'll add rules below)
3. Choose location closest to your users (us-central recommended)
4. Create database

Add Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Prayer requests
    match /prayer_requests/{requestId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Reading progress
    match /reading_progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Events (read-only for users)
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.admin == true;
    }

    // App settings (read-only for users)
    match /app_settings/{doc} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.admin == true;
    }
  }
}
```

### Storage
1. Firebase Console → Storage → Get Started
2. Start in **production mode**
3. Create storage

Add Security Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile photos
    match /profile_photos/{userId}.{extension} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.uid == userId &&
        request.resource.size < 5 * 1024 * 1024 && // 5MB max
        request.resource.contentType.matches('image/.*');
    }

    // Event images (admin only)
    match /events/{fileName} {
      allow read: if true;
      allow write: if request.auth != null &&
        request.auth.token.admin == true;
    }
  }
}
```

## Step 6: Test Firebase Connection

1. Start the app: `npm start`
2. Try signing up for a new account
3. Check Firebase Console → Authentication for new user
4. Verify Firestore user document was created

## Step 7: Setup for Production (Optional but Recommended)

### Admin User Setup
To enable admin features (managing events):
1. In Firebase Console → Authentication
2. Select user → Set custom claims using Firebase Admin SDK or Cloud Function
3. Custom claim: `{ admin: true }`

### Admin Setup Script (Node.js)
```javascript
// Run this once to set up admin user
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const email = 'admin@hereignschapel.com';
const uid = 'user-uid-from-auth';

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log(`Admin claims set for ${email}`);
  })
  .catch(error => {
    console.error('Error setting admin claims:', error);
  });
```

## Collections Structure

### users/{userId}
- displayName: string
- email: string
- phoneNumber: string | null
- photoURL: string | null
- createdAt: Timestamp
- updatedAt: Timestamp

### prayer_requests/{requestId}
- userId: string
- name: string
- request: string
- contact: string | null
- urgency: 'routine' | 'urgent'
- status: 'pending' | 'answered'
- createdAt: Timestamp
- answeredAt: Timestamp | null

### reading_progress/{userId}
- planId: string
- startDate: string
- completedDays: array of numbers
- lastCompletedDate: string
- streak: number
- updatedAt: Timestamp

### events/{eventId}
- title: string
- description: string
- date: Timestamp
- time: string
- location: string
- imageURL: string | null
- isActive: boolean
- createdAt: Timestamp

## Troubleshooting

### Common Issues

1. **"Firebase is not configured"**
   - Make sure you updated Config.ts with actual Firebase values

2. **"Permission denied" errors**
   - Check Firestore/Storage security rules
   - Ensure user is signed in properly

3. **Build fails**
   - Check that all Firebase config values are correct
   - Ensure no syntax errors in Config.ts

4. **Authentication not working**
   - Verify Email/Password is enabled in Firebase Console
   - Check API key and authDomain in config

### Get Help
- Firebase documentation: https://firebase.google.com/docs
- React Native Firebase: https://rnfirebase.io/
- Expo Firebase setup: https://docs.expo.dev/guides/using-firebase/

## Next Steps

After Firebase setup is complete:

1. Test authentication flow
2. Test prayer request saving to Firestore
3. Test profile photo upload
4. Add initial church events in Firestore
5. Configure EAS Build for Android APK creation

The app is now ready for Firebase integration!