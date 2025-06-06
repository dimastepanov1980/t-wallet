import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Account, Card, Currency } from '../../types/interface';
import { LocalStorageService } from '../../services/localStorageService';

export interface AccountState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  selectedAccountId: string | null;
  cards: Card[];
  transactions: any[];
}

const initialState: AccountState = {
  accounts: [],
  loading: false,
  error: null,
  selectedAccountId: null,
  cards: [],
  transactions: [],
};

export type AccountFormData = {
  name: string;
  ownerName: string;
  accountNumber: string;
  dateСreation: string;
  contractNumber: string;
  currency: Currency;
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
  async (accountData: AccountFormData) => {
    console.log('Creating new account:', accountData);
    const newAccount = await LocalStorageService.getInstance().addAccount(accountData);
    if (!newAccount) {
      throw new Error('Failed to create account');
    }
    console.log('Created account:', newAccount);
    return newAccount;
  }
);


export const updateAccount = createAsyncThunk(
  'account/updateAccount',
  async ({ accountId, data }: { accountId: string; data: AccountFormData }) => {
    const updatedAccount = await LocalStorageService.getInstance().updateAccount(accountId, data);
    if (!updatedAccount) {
      throw new Error('Failed to update account');
    }
    return updatedAccount;
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
    },
    setSelectedAccountId: (state, action: PayloadAction<string | null>) => {
      state.selectedAccountId = action.payload;
    },
    deleteAccount: (state, action: PayloadAction<string>) => {
      const accountId = action.payload;
      // Удаляем счет
      state.accounts = state.accounts.filter(account => account.id !== accountId);
      // Удаляем все карты этого счета
      state.cards = state.cards.filter(card => card.accountId !== accountId);
      // Удаляем все транзакции этого счета
      state.transactions = state.transactions.filter(
        transaction => transaction.accountId !== accountId
      );
      
      // Сохраняем изменения в хранилище
      LocalStorageService.getInstance().saveAccounts(state.accounts);
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
  setError,
  setSelectedAccountId,
  deleteAccount
} = accountSlice.actions;

export default accountSlice.reducer; 