import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  // Add your Firebase config here
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface User {
  id: string;
  phone: string;
  allowed: boolean;
  expires_at: Timestamp;
  deviceId?: string;
  password: string | null;
}

export const findUserByPhone = async (phone: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('phone', '==', phone));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return {
      id: userDoc.id,
      ...userDoc.data()
    } as User;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

export const updatePassword = async (userId: string, password: string): Promise<boolean> => {
  try {
    console.log('Updating password for user:', userId);
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { password });
    console.log('Password updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
};

export const updateDeviceId = async (userId: string, deviceId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { deviceId });
    return true;
  } catch (error) {
    console.error('Error updating deviceId:', error);
    return false;
  }
}; 