export type CardType = 'mastercard' | 'visa' | 'mir';
export type Currency = 'RUB' | 'USD' | 'EUR';

export interface Transaction {
  id: string;
  amount: number;
  counterpartyName: string; // ФИО отправителя/получателя
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
  name: string;
  cardNumber: string;
  type: CardType;
  balance: number;
  accountId: string;
  holderName: string;
  transactions: Transaction[];
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
  name: string;
  currency: Currency;
  cards: Card[];
  balance: number;
  monthlyBalances: MonthlyBalance[];
  dateСreation: string;
} 