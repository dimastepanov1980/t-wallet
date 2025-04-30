import { stores } from './config';

export const storageService = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      await stores.auth.setItem(key, value);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      return await stores.auth.getItem<T>(key);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await stores.auth.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await stores.auth.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  async clearAllStorages(): Promise<void> {
    try {
      console.log('Clearing all storages...');
      // Очищаем все хранилища
      await stores.auth.clear();
      await stores.accounts.clear();
      console.log('All storages cleared successfully');
    } catch (error) {
      console.error('Error clearing all storages:', error);
    }
  }
}; 