import { Account, Card, Transaction } from '../types/account';
import { NewAccountFormData } from '../store/slices/accountSlice';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  ACCOUNTS: 'tbank_accounts',
  SELECTED_ACCOUNT: 'tbank_selected_account',
  SELECTED_CARD: 'tbank_selected_card'
};

export class LocalStorageService {
  private static instance: LocalStorageService;
  private readonly ACCOUNTS_KEY = 'accounts';

  private constructor() {}

  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Accounts
  getAccounts(): Account[] {
    const accounts = localStorage.getItem(this.ACCOUNTS_KEY);
    return accounts ? JSON.parse(accounts) : [];
  }

  saveAccounts(accounts: Account[]): void {
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
  }

  addAccount(accountData: NewAccountFormData): Account {
    const newAccount: Account = {
      id: uuidv4(),
      ...accountData,
      cards: [],
      balance: 0,
      monthlyBalances: [],
      createdAt: new Date().toISOString()
    };

    const accounts = this.getAccounts();
    accounts.push(newAccount);
    this.saveAccounts(accounts);

    return newAccount;
  }

  // Cards
  addCard(accountId: string, cardData: Omit<Card, 'id' | 'transactions'>): Card | null {
    const accounts = this.getAccounts();
    const accountIndex = accounts.findIndex(acc => acc.id === accountId);
    
    if (accountIndex === -1) return null;

    const newCard: Card = {
      ...cardData,
      id: Date.now().toString(),
      transactions: []
    };

    accounts[accountIndex].cards.push(newCard);
    this.saveAccounts(accounts);
    return newCard;
  }

  // Transactions
  addTransaction(accountId: string, cardId: string, transaction: Omit<Transaction, 'id'>): Transaction | null {
    const accounts = this.getAccounts();
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return null;

    const card = account.cards.find(c => c.id === cardId);
    if (!card) return null;

    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };

    // Add transaction to card
    card.transactions.push(newTransaction);

    // Update account balance
    account.balance += transaction.type === 'incoming' ? transaction.amount : -transaction.amount;

    // Update monthly balance
    const transactionDate = new Date(transaction.date);
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

    this.saveAccounts(accounts);
    return newTransaction;
  }

  // Selected Account/Card
  setSelectedAccount(accountId: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_ACCOUNT, accountId);
  }

  getSelectedAccount(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_ACCOUNT);
  }

  setSelectedCard(cardId: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CARD, cardId);
  }

  getSelectedCard(): string | null {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_CARD);
  }
} 