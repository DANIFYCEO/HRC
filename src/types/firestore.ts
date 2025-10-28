// Firestore document type definitions

import { Timestamp } from 'firebase/firestore';

// User document in 'users' collection
export interface FirestoreUser {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Reading progress document in 'reading_progress' collection
export interface FirestoreReadingProgress {
  userId: string;
  planId: string;
  startDate: Timestamp;
  completedDays: number[];
  currentDay: number;
  lastReadDate: Timestamp;
}

// Event document in 'events' collection
export interface FirestoreEvent {
  id: string;
  title: string;
  description: string;
  dateTime: Timestamp;
  location?: string;
  imageUrl?: string;
  isRecurring: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// App settings document (single document)
export interface FirestoreAppSettings {
  recurringServices: {
    tuesday: {
      name: string;
      time: string;
    };
    thursday: {
      name: string;
      time: string;
    };
    sunday: {
      name: string;
      time: string;
    };
  };
  contacts: {
    pastorWhatsApp: string;
    churchOffice: string;
    supportWhatsApp: string;
  };
  churchInfo: {
    name: string;
    tagline: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

// Helper type for creating new documents (without server-generated fields)
export type NewFirestoreUser = Omit<FirestoreUser, 'uid' | 'createdAt' | 'updatedAt'>;
export type NewFirestoreEvent = Omit<FirestoreEvent, 'id' | 'createdAt' | 'updatedAt'>;
export type NewFirestoreReadingProgress = Omit<FirestoreReadingProgress, 'createdAt' | 'updatedAt'>;
