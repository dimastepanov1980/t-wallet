import localforage from 'localforage';

// Инициализация localforage
localforage.config({
  name: 't-wallet',
  storeName: 'auth',
  description: 'T-Wallet authentication storage'
});

// Создаем экземпляр для счетов
const accountsStore = localforage.createInstance({
  name: 't-wallet',
  storeName: 'accounts'
});

export const storageService = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      await localforage.setItem(key, value);
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      return await localforage.getItem<T>(key);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await localforage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await localforage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  async clearAllStorages(): Promise<void> {
    try {
      console.log('Clearing all storages...');
      // Очищаем основное хранилище
      await localforage.clear();
      // Очищаем хранилище счетов
      await accountsStore.clear();
      console.log('All storages cleared successfully');
    } catch (error) {
      console.error('Error clearing all storages:', error);
    }
  }
}; 