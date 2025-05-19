import { getStores } from './config';

export const storageService = {
  async setItem(key: string, value: any, isDemoMode: boolean = false): Promise<void> {
    try {
      const stores = getStores(isDemoMode);
      await stores.auth.setItem(key, value);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  async getItem<T>(key: string, isDemoMode: boolean = false): Promise<T | null> {
    try {
      const stores = getStores(isDemoMode);
      return await stores.auth.getItem<T>(key);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  async removeItem(key: string, isDemoMode: boolean = false): Promise<void> {
    try {
      const stores = getStores(isDemoMode);
      await stores.auth.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },

  async clear(isDemoMode: boolean = false): Promise<void> {
    try {
      const stores = getStores(isDemoMode);
      await stores.auth.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  async clearAllStorages(isDemoMode: boolean = false): Promise<void> {
    try {
      const stores = getStores(isDemoMode);
      await stores.auth.clear();
      await stores.accounts.clear();
    } catch (error) {
      console.error('Error clearing all storages:', error);
    }
  }
}; 