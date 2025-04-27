import localforage from 'localforage';
import { Account, Card, Transaction } from '../types/account';


const STORAGE_KEYS = {
  ACCOUNTS: 'accounts',
  SELECTED_ACCOUNT: 'selectedAccount',
  SELECTED_CARD: 'selectedCard'
};

// Инициализация localforage для счетов
const accountsStore = localforage.createInstance({
  name: 't-wallet',
  storeName: 'accounts'
});

export class LocalStorageService {
  private static instance: LocalStorageService;

  private constructor() {}

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  async getAccounts(): Promise<Account[]> {
    try {
      const accounts = await accountsStore.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS);
      return accounts || [];
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  }

  async saveAccounts(accounts: Account[]): Promise<void> {
    try {
      console.log('Saving accounts:', accounts);
      await accountsStore.setItem(STORAGE_KEYS.ACCOUNTS, accounts);
      // Проверяем, что данные сохранились
      const savedAccounts = await accountsStore.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS);
      console.log('Saved accounts:', savedAccounts);
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  }

  async addAccount(accountData: { name: string; ownerName: string; accountNumber: string }): Promise<Account> {
    try {
      const accounts = await this.getAccounts();
      console.log('Current accounts:', accounts);
      
      const newAccount: Account = {
        id: `acc-${Date.now()}`,
        name: accountData.name,
        ownerName: accountData.ownerName,
        accountNumber: accountData.accountNumber,
        cards: [],
        currency: 'RUB',
        balance: 0,
        monthlyBalances: [],
        createdAt: new Date().toISOString()
      };
      
      accounts.push(newAccount);
      await this.saveAccounts(accounts);
      
      // Проверяем, что счет добавился
      const updatedAccounts = await this.getAccounts();
      console.log('Updated accounts:', updatedAccounts);
      
      return newAccount;
    } catch (error) {
      console.error('Error adding account:', error);
      throw error;
    }
  }

  async addCard(accountId: string, cardData: Omit<Card, 'id' | 'transactions'>): Promise<Card | null> {
    try {
      const accounts = await this.getAccounts();
      console.log('Current accounts before adding card:', accounts);
      
      const accountIndex = accounts.findIndex(acc => acc.id === accountId);
      if (accountIndex === -1) {
        console.error('Account not found:', accountId);
        return null;
      }

      const newCard: Card = {
        id: `card-${Date.now()}`,
        ...cardData,
        transactions: []
      };

      accounts[accountIndex].cards.push(newCard);
      await this.saveAccounts(accounts);
      
      // Проверяем, что карта добавилась
      const updatedAccounts = await this.getAccounts();
      console.log('Updated accounts after adding card:', updatedAccounts);
      
      return newCard;
    } catch (error) {
      console.error('Error adding card:', error);
      return null;
    }
  }

  async addTransaction(accountId: string, cardId: string, transactionData: Omit<Transaction, 'id'>): Promise<Transaction | null> {
    try {
      const accounts = await this.getAccounts();
      const accountIndex = accounts.findIndex(acc => acc.id === accountId);
      
      if (accountIndex === -1) {
        return null;
      }

      const cardIndex = accounts[accountIndex].cards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) {
        return null;
      }

      const newTransaction: Transaction = {
        id: `tr-${Date.now()}`,
        ...transactionData
      };

      accounts[accountIndex].cards[cardIndex].transactions.push(newTransaction);
      await this.saveAccounts(accounts);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return null;
    }
  }

  async setSelectedAccount(accountId: string): Promise<void> {
    try {
      await accountsStore.setItem(STORAGE_KEYS.SELECTED_ACCOUNT, accountId);
    } catch (error) {
      console.error('Error setting selected account:', error);
    }
  }

  async getSelectedAccount(): Promise<string | null> {
    try {
      return await accountsStore.getItem<string>(STORAGE_KEYS.SELECTED_ACCOUNT);
    } catch (error) {
      console.error('Error getting selected account:', error);
      return null;
    }
  }

  async setSelectedCard(cardId: string): Promise<void> {
    try {
      await accountsStore.setItem(STORAGE_KEYS.SELECTED_CARD, cardId);
    } catch (error) {
      console.error('Error setting selected card:', error);
    }
  }

  async getSelectedCard(): Promise<string | null> {
    try {
      return await accountsStore.getItem<string>(STORAGE_KEYS.SELECTED_CARD);
    } catch (error) {
      console.error('Error getting selected card:', error);
      return null;
    }
  }
} 