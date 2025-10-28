// AuthContext - Global authentication state management

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthChange, getCurrentUser } from '../services/auth';
import { getUser, createUser } from '../services/firestore';
import { User } from '../types';
import { FirestoreUser } from '../types/firestore';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  isGuest: boolean;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserProfile = async () => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      try {
        const profile = await getUser(currentUser.uid);
        if (profile) {
          setUserProfile(convertFirestoreUser(profile));
        } else {
          // Create new user profile in Firestore
          await createUser(currentUser.uid, {
            name: currentUser.displayName || 'User',
            email: currentUser.email || '',
            phone: currentUser.phoneNumber || undefined,
            photoURL: currentUser.photoURL || undefined,
          });
          const newProfile = await getUser(currentUser.uid);
          if (newProfile) {
            setUserProfile(convertFirestoreUser(newProfile));
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // User is signed in, fetch their profile
        await refreshUserProfile();
      } else {
        // User is signed out
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isGuest = !user;

  const value = {
    user,
    userProfile,
    loading,
    isGuest,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to convert Firestore user to app User type
const convertFirestoreUser = (firestoreUser: FirestoreUser): User => {
  return {
    uid: firestoreUser.uid,
    name: firestoreUser.name,
    email: firestoreUser.email,
    phone: firestoreUser.phone,
    photoURL: firestoreUser.photoURL,
    createdAt: firestoreUser.createdAt.toDate(),
    updatedAt: firestoreUser.updatedAt.toDate(),
  };
};

export default AuthContext;
