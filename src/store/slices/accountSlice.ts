import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account, Card } from '../../types/account';
import { LocalStorageService } from '../../services/localStorageService';

export interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: LocalStorageService.getInstance().getAccounts(),
  loading: false,
  error: null
};

export type NewAccountFormData = {
  name: string;
  ownerName: string;
  accountNumber: string;
};

export type NewCard = Omit<Card, 'id' | 'transactions'>;

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
      LocalStorageService.getInstance().saveAccounts(action.payload);
    },
    addAccount: (state, action: PayloadAction<NewAccountFormData>) => {
      const storageService = LocalStorageService.getInstance();
      const newAccount = storageService.addAccount(action.payload);
      state.accounts.push(newAccount);
    },
    addCard: (state, action: PayloadAction<{ accountId: string; card: NewCard }>) => {
      const storageService = LocalStorageService.getInstance();
      const newCard = storageService.addCard(action.payload.accountId, action.payload.card);
      
      if (newCard) {
        const accountIndex = state.accounts.findIndex(acc => acc.id === action.payload.accountId);
        if (accountIndex !== -1) {
          state.accounts[accountIndex].cards.push(newCard);
        }
        state.error = null;
      } else {
        state.error = 'Failed to add card';
      }
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
  setAccounts, 
  addAccount, 
  addCard, 
  setLoading, 
  setError 
} = accountSlice.actions;

export default accountSlice.reducer; 