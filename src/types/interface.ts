export type CardType = 'mastercard' | 'visa' | 'mir';
export type Currency = 'RUB' | 'USD' | 'EUR';

export interface Transaction {
  id: string;
  amount: number;
  counterpartyName: string;
  date: string;
  type: 'incoming' | 'outgoing';
  bankName?: string;
  cardNumber?: string;
  description?: string;
  processingDate?: string;
  currency?: Currency;
  cardCurrency?: Currency;
  accountName?: string;
}

export interface Card {
  id: string;
  type: CardType;
  holderName: string;
  cardNumber: string;
  name: string;
  accountId: string;
  transactions: Transaction[];
  balance: number;
}

export interface MonthlyBalance {
  month: number; // 0-11
  year: number;
  balance: number;
}

export interface Account {
  id: string;
  ownerName: string;
  accountNumber: string;
  contractNumber: string;
  name: string;
  currency: Currency;
  cards: Card[];
  balance: number;
  monthlyBalances: MonthlyBalance[];
  dateСreation: string;
} 

export interface User {
  userId: string | null;
  phone: string | null;
  password: string | null;
  full_name: string | null;
  isLoggedIn: boolean;
  demoMode: boolean;
  email: string | null;
  address: string | null;
}