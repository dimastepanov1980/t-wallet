import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Загружаем переменные окружения
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface UserData {
  phone: string;
  full_name: string;
  allowed: boolean;
  pin: string | null;
  device_id: string | null;
  created_at: ReturnType<typeof Timestamp.now>;
  expires_at: ReturnType<typeof Timestamp.fromDate>;
  is_demo: boolean;
}

async function createUser(userData: UserData) {
  try {
    const userId = `user-${uuidv4().slice(0, 4)}`;
    await setDoc(doc(db, "users", userId), userData);
    console.log(`Пользователь ${userId} успешно создан!`);
    return userId;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
}

// Пример использования
const demoUser: UserData = {
  phone: "+79891234567",
  full_name: "Миша Школьник",
  allowed: true,
  pin: null,
  device_id: null,
  created_at: Timestamp.now(),
  expires_at: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 дней
  is_demo: false
};

// Запускаем создание пользователя
createUser(demoUser)
  .then(userId => console.log(`ID созданного пользователя: ${userId}`))
  .catch(error => console.error('Ошибка:', error)); 