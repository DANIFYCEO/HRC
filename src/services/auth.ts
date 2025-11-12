// Firebase Auth service for user authentication

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  signInWithPhoneNumber,
  getAuth,
  RecaptchaVerifier,
  PhoneAuthProvider,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { getAuthInstance, auth, isFirebaseConfigured } from './firebase';

/**
 * Sign up a new user with email and password
 */
export const signUp = async (
  email: string,
  password: string,
  name: string
): Promise<FirebaseUser> => {
  try {
    const authInstance = getAuthInstance();
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);

    // Update display name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name,
      });
    }

    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up');
  }
};

/**
 * Sign in an existing user
 */
export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  try {
    const authInstance = getAuthInstance();
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign out the current user
 */
export const logOut = async (): Promise<void> => {
  try {
    const authInstance = getAuthInstance();
    await signOut(authInstance);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    const authInstance = getAuthInstance();
    await sendPasswordResetEmail(authInstance, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send password reset email');
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  user: FirebaseUser,
  updates: { displayName?: string; photoURL?: string }
): Promise<void> => {
  try {
    await updateProfile(user, updates);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

/**
 * Update user email
 */
export const updateUserEmail = async (
  user: FirebaseUser,
  newEmail: string
): Promise<void> => {
  try {
    await updateEmail(user, newEmail);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update email');
  }
};

/**
 * Update user password
 */
export const updateUserPassword = async (
  user: FirebaseUser,
  newPassword: string
): Promise<void> => {
  try {
    await updatePassword(user, newPassword);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update password');
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): FirebaseUser | null => {
  if (!isFirebaseConfigured() || !auth) {
    return null;
  }
  return auth.currentUser;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

/**
 * Sign in with phone number
 */
export const signInWithPhone = async (
  phoneNumber: string,
  verificationCode: string
): Promise<FirebaseUser> => {
  try {
    const authInstance = getAuthInstance();

    // Create phone auth provider
    const phoneAuthProvider = new PhoneAuthProvider(authInstance);

    // Create credential with verification code
    const credential = phoneAuthProvider.credential(verificationCode);

    // Sign in with credential
    const userCredential = await signInWithCredential(authInstance, credential);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in with phone number');
  }
};

/**
 * Send phone verification code
 */
export const sendPhoneVerification = async (
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<string> => {
  try {
    const authInstance = getAuthInstance();
    const phoneAuthProvider = new PhoneAuthProvider(authInstance);

    const verificationId = await phoneAuthProvider.verifyPhoneNumber(
      phoneNumber,
      recaptchaVerifier
    );

    return verificationId;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send verification code');
  }
};

export default {
  signUp,
  signIn,
  signInWithPhone,
  sendPhoneVerification,
  logOut,
  resetPassword,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  getCurrentUser,
  onAuthChange,
};
