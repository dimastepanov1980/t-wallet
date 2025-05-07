import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Загружаем переменные окружения
dotenv.config({ path: join(__dirname, '..', '.env') });

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

/**
 * @typedef {Object} UserData
 * @property {string} phone
 * @property {string} full_name
 * @property {boolean} allowed
 * @property {string|null} deviceId
 * @property {import('firebase/firestore').Timestamp} created_at
 * @property {import('firebase/firestore').Timestamp} expires_at
 * @property {boolean} is_demo
 */

async function createUser(userData) {
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
const demoUser = {
  phone: "+79891111111",
  full_name: "Chrome",
  allowed: true,
  deviceId: null,
  created_at: Timestamp.now(),
  expires_at: Timestamp.fromDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)), // 1 год
  is_demo: false
};

// Запускаем создание пользователя
createUser(demoUser)
  .then(userId => console.log(`ID созданного пользователя: ${userId}`))
  .catch(error => console.error('Ошибка:', error)); 