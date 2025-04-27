import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Account, Card } from '../../types/account';
import { LocalStorageService } from '../../services/localStorageService';

export interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null
};

export type NewAccountFormData = {
  name: string;
  ownerName: string;
  accountNumber: string;
};

export type NewCard = Omit<Card, 'id' | 'transactions'>;

// Асинхронные действия
export const fetchAccounts = createAsyncThunk(
  'account/fetchAccounts',
  async () => {
    console.log('Fetching accounts from storage...');
    const accounts = await LocalStorageService.getInstance().getAccounts();
    console.log('Fetched accounts:', accounts);
    return accounts;
  }
);

export const createAccount = createAsyncThunk(
  'account/createAccount',
  async (accountData: NewAccountFormData) => {
    console.log('Creating new account:', accountData);
    const newAccount = await LocalStorageService.getInstance().addAccount(accountData);
    if (!newAccount) {
      throw new Error('Failed to create account');
    }
    console.log('Created account:', newAccount);
    return newAccount;
  }
);

export const addCardToAccount = createAsyncThunk(
  'account/addCard',
  async ({ accountId, card }: { accountId: string; card: NewCard }) => {
    console.log('Adding card to account:', { accountId, card });
    const newCard = await LocalStorageService.getInstance().addCard(accountId, card);
    if (!newCard) {
      throw new Error('Failed to add card');
    }
    console.log('Added card:', newCard);
    return { accountId, card: newCard };
  }
);

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
      LocalStorageService.getInstance().saveAccounts(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Обработка fetchAccounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
        LocalStorageService.getInstance().saveAccounts(action.payload);
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch accounts';
      })
      // Обработка createAccount
      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts.push(action.payload);
        LocalStorageService.getInstance().saveAccounts(state.accounts);
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create account';
      })
      // Обработка addCardToAccount
      .addCase(addCardToAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCardToAccount.fulfilled, (state, action) => {
        state.loading = false;
        const accountIndex = state.accounts.findIndex(acc => acc.id === action.payload.accountId);
        if (accountIndex !== -1) {
          state.accounts[accountIndex].cards.push(action.payload.card);
          LocalStorageService.getInstance().saveAccounts(state.accounts);
        }
      })
      .addCase(addCardToAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add card';
      });
  }
});

export const { 
  setAccounts, 
  setLoading, 
  setError 
} = accountSlice.actions;

export default accountSlice.reducer; 