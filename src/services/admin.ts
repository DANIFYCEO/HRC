// Firebase service for admin content management (Events, Devotionals, etc.)

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where
} from 'firebase/firestore';
import { firestore } from './firebase';

// COLLECTIONS
const EVENTS_COLLECTION = 'events';
const DEVOTIONALS_COLLECTION = 'devotionals';
const ANNOUNCEMENTS_COLLECTION = 'announcements';

// Types
export interface Event {
  id?: string;
  title: string;
  description: string;
  date: Date; // Event date
  time: string; // Event time (e.g., "10:00 AM")
  location: string;
  category: 'service' | 'meeting' | 'special' | 'youth' | 'prayer' | 'other';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean; // To show/hide events
}

export interface Devotional {
  id?: string;
  title: string;
  bibleVerse: string;
  content: string;
  prayerPoint: string;
  date: Date; // Devotional date
  author: string; // Pastor/admin name
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id?: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  expiresAt?: Date; // Optional expiration
  isActive: boolean;
}

// ===== EVENTS =====
export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const event = {
      ...eventData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(firestore, EVENTS_COLLECTION), event);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create event');
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const q = query(
      collection(firestore, EVENTS_COLLECTION),
      where('isActive', '==', true),
      orderBy('date', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    } as Event));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get events');
  }
};

export const getUpcomingEvents = async (limitCount: number = 5): Promise<Event[]> => {
  try {
    const now = new Date();
    const q = query(
      collection(firestore, EVENTS_COLLECTION),
      where('isActive', '==', true),
      where('date', '>=', now),
      orderBy('date', 'asc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    } as Event));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get upcoming events');
  }
};

// ===== DEVOTIONALS =====
export const createDevotional = async (devotionalData: Omit<Devotional, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const devotional = {
      ...devotionalData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(firestore, DEVOTIONALS_COLLECTION), devotional);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create devotional');
  }
};

export const getDevotionals = async (): Promise<Devotional[]> => {
  try {
    const q = query(
      collection(firestore, DEVOTIONALS_COLLECTION),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    } as Devotional));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get devotionals');
  }
};

export const getTodaysDevotional = async (): Promise<Devotional | null> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const q = query(
      collection(firestore, DEVOTIONALS_COLLECTION),
      where('date', '>=', today),
      where('date', '<', tomorrow),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    } as Devotional;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get today\'s devotional');
  }
};

// ===== ANNOUNCEMENTS =====
export const createAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const announcement = {
      ...announcementData,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(firestore, ANNOUNCEMENTS_COLLECTION), announcement);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create announcement');
  }
};

export const getActiveAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const now = new Date();
    const q = query(
      collection(firestore, ANNOUNCEMENTS_COLLECTION),
      where('isActive', '==', true),
      where('expiresAt', '>', now)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      expiresAt: doc.data().expiresAt?.toDate(),
    } as Announcement));
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get announcements');
  }
};

export default {
  // Events
  createEvent,
  getEvents,
  getUpcomingEvents,

  // Devotionals
  createDevotional,
  getDevotionals,
  getTodaysDevotional,

  // Announcements
  createAnnouncement,
  getActiveAnnouncements,
};