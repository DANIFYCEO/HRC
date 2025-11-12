// Firestore service for database operations

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { getFirestoreInstance } from './firebase';
import {
  FirestoreUser,
  FirestoreReadingProgress,
  FirestoreEvent,
  FirestoreAppSettings,
} from '../types/firestore';

// Collection names
const USERS = 'users';
const READING_PROGRESS = 'reading_progress';
const PRAYER_REQUESTS = 'prayer_requests';
const EVENTS = 'events';
const APP_SETTINGS = 'app_settings';

/**
 * User operations
 */
export const createUser = async (uid: string, userData: Partial<FirestoreUser>): Promise<void> => {
  try {
    const firestore = getFirestoreInstance();
    await setDoc(doc(firestore, USERS, uid), {
      ...userData,
      uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export const getUser = async (uid: string): Promise<FirestoreUser | null> => {
  try {
    const firestore = getFirestoreInstance();
    const userDoc = await getDoc(doc(firestore, USERS, uid));
    return userDoc.exists() ? (userDoc.data() as FirestoreUser) : null;
  } catch (error: any) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

export const updateUser = async (uid: string, updates: Partial<FirestoreUser>): Promise<void> => {
  try {
    const firestore = getFirestoreInstance();
    await updateDoc(doc(firestore, USERS, uid), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

/**
 * Reading progress operations
 */
export const createReadingProgress = async (
  progressData: Omit<FirestoreReadingProgress, 'createdAt' | 'updatedAt'>
): Promise<void> => {
  try {
    const firestore = getFirestoreInstance();
    const progressId = `${progressData.userId}_${progressData.planId}`;
    await setDoc(doc(firestore, READING_PROGRESS, progressId), {
      ...progressData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Failed to create reading progress: ${error.message}`);
  }
};

export const getReadingProgress = async (
  userId: string,
  planId: string
): Promise<FirestoreReadingProgress | null> => {
  try {
    const firestore = getFirestoreInstance();
    const progressId = `${userId}_${planId}`;
    const progressDoc = await getDoc(doc(firestore, READING_PROGRESS, progressId));
    return progressDoc.exists() ? (progressDoc.data() as FirestoreReadingProgress) : null;
  } catch (error: any) {
    throw new Error(`Failed to get reading progress: ${error.message}`);
  }
};

export const updateReadingProgress = async (
  userId: string,
  planId: string,
  updates: Partial<FirestoreReadingProgress>
): Promise<void> => {
  try {
    const firestore = getFirestoreInstance();
    const progressId = `${userId}_${planId}`;
    await updateDoc(doc(firestore, READING_PROGRESS, progressId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Failed to update reading progress: ${error.message}`);
  }
};

/**
 * Prayer request operations
 */
export const savePrayerRequest = async (data: {
  name: string;
  request: string;
  contact: string | null;
  urgency: 'routine' | 'urgent';
  userId: string;
  createdAt: Date;
  status: 'pending' | 'answered';
}) => {
  try {
    const firestore = getFirestoreInstance();
    const prayerRef = doc(collection(firestore, PRAYER_REQUESTS));
    await setDoc(prayerRef, {
      ...data,
      id: prayerRef.id,
      createdAt: Timestamp.now(),
    });
    return prayerRef.id;
  } catch (error: any) {
    throw new Error(`Failed to save prayer request: ${error.message}`);
  }
};

export const getUserPrayerRequests = async (userId: string) => {
  try {
    const firestore = getFirestoreInstance();
    const q = query(
      collection(firestore, PRAYER_REQUESTS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    }));
  } catch (error: any) {
    throw new Error(`Failed to get prayer requests: ${error.message}`);
  }
};

export const deletePrayerRequest = async (requestId: string, userId: string) => {
  try {
    const firestore = getFirestoreInstance();
    const requestRef = doc(firestore, PRAYER_REQUESTS, requestId);
    // Verify user owns this request before deleting
    const requestDoc = await getDoc(requestRef);
    if (!requestDoc.exists()) {
      throw new Error('Prayer request not found');
    }
    if (requestDoc.data().userId !== userId) {
      throw new Error('Not authorized to delete this request');
    }
    await deleteDoc(requestRef);
  } catch (error: any) {
    throw new Error(`Failed to delete prayer request: ${error.message}`);
  }
};

/**
 * Event operations
 */
export const createEvent = async (
  eventData: Omit<FirestoreEvent, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const firestore = getFirestoreInstance();
    const eventRef = doc(collection(firestore, EVENTS));
    await setDoc(eventRef, {
      ...eventData,
      id: eventRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return eventRef.id;
  } catch (error: any) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
};

export const getEvents = async (isRecurring?: boolean): Promise<FirestoreEvent[]> => {
  try {
    const firestore = getFirestoreInstance();
    let q = query(collection(firestore, EVENTS), orderBy('dateTime', 'asc'));

    if (isRecurring !== undefined) {
      q = query(
        collection(firestore, EVENTS),
        where('isRecurring', '==', isRecurring),
        orderBy('dateTime', 'asc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as FirestoreEvent);
  } catch (error: any) {
    throw new Error(`Failed to get events: ${error.message}`);
  }
};

export const getUpcomingEvents = async (): Promise<FirestoreEvent[]> => {
  try {
    const firestore = getFirestoreInstance();
    const now = Timestamp.now();
    const q = query(
      collection(firestore, EVENTS),
      where('dateTime', '>=', now),
      where('isRecurring', '==', false),
      orderBy('dateTime', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as FirestoreEvent);
  } catch (error: any) {
    throw new Error(`Failed to get upcoming events: ${error.message}`);
  }
};

export const updateEvent = async (
  eventId: string,
  updates: Partial<FirestoreEvent>
): Promise<void> => {
  try {
    const firestore = getFirestoreInstance();
    await updateDoc(doc(firestore, EVENTS, eventId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Failed to update event: ${error.message}`);
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const firestore = getFirestoreInstance();
    await deleteDoc(doc(firestore, EVENTS, eventId));
  } catch (error: any) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
};

/**
 * App settings operations
 */
export const getAppSettings = async (): Promise<FirestoreAppSettings | null> => {
  try {
    const firestore = getFirestoreInstance();
    const settingsDoc = await getDoc(doc(firestore, APP_SETTINGS, 'config'));
    return settingsDoc.exists() ? (settingsDoc.data() as FirestoreAppSettings) : null;
  } catch (error: any) {
    throw new Error(`Failed to get app settings: ${error.message}`);
  }
};

export const updateAppSettings = async (
  updates: Partial<FirestoreAppSettings>
): Promise<void> => {
  try {
    const firestore = getFirestoreInstance();
    await setDoc(doc(firestore, APP_SETTINGS, 'config'), updates, { merge: true });
  } catch (error: any) {
    throw new Error(`Failed to update app settings: ${error.message}`);
  }
};

export default {
  createUser,
  getUser,
  updateUser,
  createReadingProgress,
  getReadingProgress,
  updateReadingProgress,
  createEvent,
  getEvents,
  getUpcomingEvents,
  updateEvent,
  deleteEvent,
  getAppSettings,
  updateAppSettings,
};
