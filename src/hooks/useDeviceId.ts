import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const DEVICE_ID_KEY = 'deviceId';

// Функция для определения типа устройства
const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  } else if (/android/.test(userAgent)) {
    return 'android';
  }
  return 'web';
};

// Функция для получения параметров устройства
const getDeviceParams = () => {
  const deviceType = getDeviceType();
  const params = [
    deviceType,
    navigator.userAgent,
    navigator.platform,
    window.screen.width,
    window.screen.height,
    window.devicePixelRatio
  ].filter(Boolean).join('|');

  return params;
};

// Функция для создания хэша из параметров
const createHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const initDeviceId = async () => {
      try {
        // Пытаемся получить сохраненный ID
      const storedId = await storageService.getItem<string>(DEVICE_ID_KEY);
      
      if (storedId) {
        setDeviceId(storedId);
        return;
      }

        // Если нет сохраненного ID, создаем новый на основе параметров устройства
        const deviceParams = getDeviceParams();
        const newId = createHash(deviceParams);
        
        // Сохраняем новый ID
      await storageService.setItem(DEVICE_ID_KEY, newId);
      setDeviceId(newId);
      } catch (error) {
        console.error('Error initializing device ID:', error);
        // В случае ошибки используем fallback на основе userAgent
        const fallbackId = createHash(navigator.userAgent);
        setDeviceId(fallbackId);
      }
    };

    initDeviceId();
  }, []);

  return deviceId;
}; 