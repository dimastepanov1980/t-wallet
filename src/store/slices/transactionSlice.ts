import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '../../types/account';
import { LocalStorageService } from '../../services/localStorageService';

export interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  selectedAccountId: string | null;
  selectedCardId: string | null;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
  error: null,
  selectedAccountId: null,
  selectedCardId: null
};

export type NewTransaction = Omit<Transaction, 'id'>;

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action: PayloadAction<NewTransaction>) => {
      if (!state.selectedAccountId || !state.selectedCardId) {
        state.error = 'Account or card not selected';
        return;
      }
      
      LocalStorageService.getInstance().addTransaction(
        state.selectedAccountId,
        state.selectedCardId,
        action.payload
      ).then(newTransaction => {
        if (newTransaction) {
          state.transactions.push(newTransaction);
          state.error = null;
        } else {
          state.error = 'Failed to create transaction';
        }
      });
    },
    setSelectedAccount: (state, action: PayloadAction<string>) => {
      state.selectedAccountId = action.payload;
      LocalStorageService.getInstance().setSelectedAccount(action.payload);
    },
    setSelectedCard: (state, action: PayloadAction<string>) => {
      state.selectedCardId = action.payload;
      LocalStorageService.getInstance().setSelectedCard(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setTransactions, 
  addTransaction, 
  setSelectedAccount, 
  setSelectedCard, 
  setLoading, 
  setError 
} = transactionSlice.actions;

export default transactionSlice.reducer; 