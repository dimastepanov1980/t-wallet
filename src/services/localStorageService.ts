import { Account, Card, Transaction, Currency } from '../types/account';
import { stores } from './config';

const STORAGE_KEYS = {
  ACCOUNTS: 'accounts',
  SELECTED_ACCOUNT: 'selectedAccount',
  SELECTED_CARD: 'selectedCard'
};

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
      const accounts = await stores.accounts.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS);
      return accounts || [];
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  }

  async saveAccounts(accounts: Account[]): Promise<void> {
    try {
      console.log('Saving accounts:', accounts);
      await stores.accounts.setItem(STORAGE_KEYS.ACCOUNTS, accounts);
      // Проверяем, что данные сохранились
      const savedAccounts = await stores.accounts.getItem<Account[]>(STORAGE_KEYS.ACCOUNTS);
      console.log('Saved accounts:', savedAccounts);
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  }

  async addAccount(accountData: { 
    name: string; 
    ownerName: string; 
    accountNumber: string;
    currency: Currency;
  }): Promise<Account> {
    try {
      const accounts = await this.getAccounts();
      console.log('Current accounts:', accounts);
      
      const newAccount: Account = {
        id: `acc-${Date.now()}`,
        name: accountData.name,
        ownerName: accountData.ownerName,
        accountNumber: accountData.accountNumber,
        cards: [],
        currency: accountData.currency,
        balance: 0,
        monthlyBalances: [],
        createdAt: new Date().toISOString()
      };
      
      accounts.push(newAccount);
      await this.saveAccounts(accounts);
      
      console.log('Created new account with balance:', newAccount.balance);
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
        transactions: [],
        balance: 0
      };

      const account = accounts[accountIndex];
      account.cards.push(newCard);
      
      // Обновляем баланс счета после добавления новой карты
      account.balance = account.cards.reduce((total, card) => {
        const cardBalance = Number(card.balance) || 0;
        return total + cardBalance;
      }, 0);

      await this.saveAccounts(accounts);
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

      // Обновляем баланс карты
      const card = accounts[accountIndex].cards[cardIndex];
      const transactionAmount = Number(newTransaction.amount);
      
      if (isNaN(transactionAmount)) {
        console.error('Invalid transaction amount:', newTransaction.amount);
        return null;
      }

      if (isNaN(card.balance)) {
        console.log('Resetting invalid card balance to 0');
        card.balance = 0;
      }

      // Обновляем баланс карты
      if (newTransaction.type === 'incoming') {
        card.balance = Number(card.balance) + transactionAmount;
      } else {
        card.balance = Number(card.balance) - transactionAmount;
      }

      // Добавляем транзакцию
      card.transactions.push(newTransaction);
      
      // Обновляем баланс счета как сумму балансов всех карт
      const account = accounts[accountIndex];
      account.balance = account.cards.reduce((total, currentCard) => {
        const cardBalance = Number(currentCard.balance) || 0;
        return total + cardBalance;
      }, 0);

      console.log('Updated account balance:', account.balance);
      
      await this.saveAccounts(accounts);
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      return null;
    }
  }

  async setSelectedAccount(accountId: string): Promise<void> {
    try {
      await stores.accounts.setItem(STORAGE_KEYS.SELECTED_ACCOUNT, accountId);
    } catch (error) {
      console.error('Error setting selected account:', error);
    }
  }

  async getSelectedAccount(): Promise<string | null> {
    try {
      return await stores.accounts.getItem<string>(STORAGE_KEYS.SELECTED_ACCOUNT);
    } catch (error) {
      console.error('Error getting selected account:', error);
      return null;
    }
  }

  async setSelectedCard(cardId: string): Promise<void> {
    try {
      await stores.accounts.setItem(STORAGE_KEYS.SELECTED_CARD, cardId);
    } catch (error) {
      console.error('Error setting selected card:', error);
    }
  }

  async getSelectedCard(): Promise<string | null> {
    try {
      return await stores.accounts.getItem<string>(STORAGE_KEYS.SELECTED_CARD);
    } catch (error) {
      console.error('Error getting selected card:', error);
      return null;
    }
  }
} 