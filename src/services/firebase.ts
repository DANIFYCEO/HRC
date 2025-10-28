// Firebase initialization and configuration

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Config } from '../constants/Config';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: Config.firebase.apiKey,
  authDomain: Config.firebase.authDomain,
  projectId: Config.firebase.projectId,
  storageBucket: Config.firebase.storageBucket,
  messagingSenderId: Config.firebase.messagingSenderId,
  appId: Config.firebase.appId,
};

// Initialize Firebase (only if configured)
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

// Check if Firebase is configured before initializing
const isConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== '' &&
  firebaseConfig.projectId !== ''
);

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
} else {
  console.warn(
    'Firebase not configured. Please add Firebase credentials to src/constants/Config.ts'
  );
}

// Helper function to check if Firebase is configured
export const isFirebaseConfigured = (): boolean => {
  return (
    !!firebaseConfig.apiKey &&
    !!firebaseConfig.authDomain &&
    !!firebaseConfig.projectId &&
    firebaseConfig.apiKey !== '' &&
    firebaseConfig.authDomain !== ''
  );
};

// Export Firebase services with fallback
// These will throw errors if used before configuration
export const getAuthInstance = (): Auth => {
  if (!auth) {
    throw new Error('Firebase Auth not initialized. Please configure Firebase first.');
  }
  return auth;
};

export const getFirestoreInstance = (): Firestore => {
  if (!firestore) {
    throw new Error('Firebase Firestore not initialized. Please configure Firebase first.');
  }
  return firestore;
};

export const getStorageInstance = (): FirebaseStorage => {
  if (!storage) {
    throw new Error('Firebase Storage not initialized. Please configure Firebase first.');
  }
  return storage;
};

// Export raw instances (may be undefined)
export { app, auth, firestore, storage };

export default app;
