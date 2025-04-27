import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storageService';

const DEVICE_ID_KEY = 'deviceId';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const initDeviceId = async () => {
      const storedId = await storageService.getItem<string>(DEVICE_ID_KEY);
      
      if (storedId) {
        setDeviceId(storedId);
        return;
      }

      const newId = uuidv4();
      await storageService.setItem(DEVICE_ID_KEY, newId);
      setDeviceId(newId);
    };

    initDeviceId();
  }, []);

  return deviceId;
}; 