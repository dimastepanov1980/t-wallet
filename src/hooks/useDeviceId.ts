import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = 't-wallet-device-id';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem(DEVICE_ID_KEY);
    if (storedId) {
      setDeviceId(storedId);
    } else {
      const newId = uuidv4();
      localStorage.setItem(DEVICE_ID_KEY, newId);
      setDeviceId(newId);
    }
  }, []);

  return deviceId;
}; 