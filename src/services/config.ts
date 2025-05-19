import localforage from 'localforage';

// Создаем сервис для сессионного хранилища
class SessionStorageService {
  async setItem(key: string, value: any): Promise<void> {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  async getItem<T>(key: string): Promise<T | null> {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async removeItem(key: string): Promise<void> {
    sessionStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    sessionStorage.clear();
  }
}

// Создаем экземпляры для демо-режима
const demoStores = {
  auth: new SessionStorageService(),
  accounts: new SessionStorageService()
};

// Основные хранилища
const persistentStores = {
    auth: localforage.createInstance({
      name: 't-wallet',
      storeName: 'auth',
      description: 'T-Wallet authentication storage'
    }),
    
    accounts: localforage.createInstance({
      name: 't-wallet',
    storeName: 'accounts',
    description: 'T-Wallet accounts storage'
    })
  };

export const getStores = (isDemoMode: boolean) => {
  return isDemoMode ? demoStores : persistentStores;
};