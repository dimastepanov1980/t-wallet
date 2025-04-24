import { Account, Card, Transaction, MonthlyBalance } from '../types/account';
import { v4 as uuidv4 } from 'uuid';

const ACCOUNTS_STORAGE_KEY = 'tbank_accounts';

export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Получить все счета
  getAccounts(): Account[] {
    const accounts = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return accounts ? JSON.parse(accounts) : [];
  }

  // Получить конкретный счет
  getAccount(accountId: string): Account | null {
    const accounts = this.getAccounts();
    return accounts.find(account => account.id === accountId) || null;
  }

  // Создать новый счет
  createAccount(accountData: Omit<Account, 'id' | 'cards' | 'balance' | 'monthlyBalances' | 'createdAt'>): Account {
    const accounts = this.getAccounts();
    
    const newAccount: Account = {
      ...accountData,
      id: uuidv4(),
      cards: [],
      balance: 0,
      monthlyBalances: [],
      createdAt: new Date().toISOString()
    };

    accounts.push(newAccount);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    
    return newAccount;
  }

  // Добавить карту к счету
  addCard(accountId: string, cardData: Omit<Card, 'id' | 'transactions'>): Card | null {
    const accounts = this.getAccounts();
    const accountIndex = accounts.findIndex(account => account.id === accountId);
    
    if (accountIndex === -1) return null;

    const newCard: Card = {
      ...cardData,
      id: uuidv4(),
      transactions: []
    };

    accounts[accountIndex].cards.push(newCard);
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));

    return newCard;
  }

  // Добавить транзакцию к карте
  addTransaction(accountId: string, cardId: string, transactionData: Omit<Transaction, 'id'>): Transaction | null {
    const accounts = this.getAccounts();
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return null;

    const card = account.cards.find(c => c.id === cardId);
    if (!card) return null;

    const newTransaction: Transaction = {
      ...transactionData,
      id: uuidv4()
    };

    // Добавляем транзакцию к карте
    card.transactions.push(newTransaction);

    // Обновляем баланс счета
    account.balance += transactionData.type === 'incoming' ? transactionData.amount : -transactionData.amount;

    // Обновляем месячный баланс
    const transactionDate = new Date(transactionData.date);
    const monthlyBalanceIndex = account.monthlyBalances.findIndex(
      mb => mb.month === transactionDate.getMonth() && mb.year === transactionDate.getFullYear()
    );

    if (monthlyBalanceIndex === -1) {
      account.monthlyBalances.push({
        month: transactionDate.getMonth(),
        year: transactionDate.getFullYear(),
        balance: account.balance
      });
    } else {
      account.monthlyBalances[monthlyBalanceIndex].balance = account.balance;
    }

    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    return newTransaction;
  }

  // Получить транзакции карты
  getCardTransactions(accountId: string, cardId: string): Transaction[] {
    const account = this.getAccount(accountId);
    if (!account) return [];

    const card = account.cards.find(c => c.id === cardId);
    return card ? card.transactions : [];
  }

  // Получить месячные балансы счета
  getAccountMonthlyBalances(accountId: string): MonthlyBalance[] {
    const account = this.getAccount(accountId);
    return account ? account.monthlyBalances : [];
  }
} 