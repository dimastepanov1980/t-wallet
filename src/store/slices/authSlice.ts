import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';
import { LocalStorageService } from '../../services/localStorageService';
import { User } from '../../types/interface';

// Инициализация состояния
const initialState: User = {
  userId: null,
  phone: null,
  password: null,
  full_name: null,
  isLoggedIn: false,
  demoMode: false,
  email: null,
  address: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ 
      id: string; 
      phone: string; 
      full_name: string; 
      deviceId?: string;
      email?: string;
      address?: string;
    }>) => {
      state.userId = action.payload.id;
      state.phone = action.payload.phone;
      state.full_name = action.payload.full_name;
      state.email = action.payload.email || null;
      state.address = action.payload.address || null;
      storageService.setItem('userId', action.payload.id, state.demoMode);
      storageService.setItem('phone', action.payload.phone, state.demoMode);
      storageService.setItem('email', action.payload.email, state.demoMode);
      storageService.setItem('address', action.payload.address, state.demoMode);
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      storageService.setItem('password', action.payload, state.demoMode);
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
      storageService.setItem('isLoggedIn', action.payload, state.demoMode);
    },
    setDemoMode: (state, action: PayloadAction<boolean>) => {
      state.demoMode = action.payload;
    },
    clearDemoMode: (state) => {
      state.demoMode = false;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      storageService.setItem('isLoggedIn', false, state.demoMode);
      // Не очищаем userId и phone, чтобы сохранить данные для повторного входа
    },
    clearAuth: (state) => {
      state.userId = null;
      state.phone = null;
      state.password = null;
      state.isLoggedIn = false;
      state.demoMode = false;
      state.email = null;
      state.address = null;
      storageService.removeItem('userId', state.demoMode);
      storageService.removeItem('phone', state.demoMode);
      storageService.removeItem('password', state.demoMode);
      storageService.removeItem('isLoggedIn', state.demoMode);
      storageService.removeItem('email', state.demoMode);
      storageService.removeItem('address', state.demoMode);
    },
    requestPasswordReentry: (state) => {
      state.isLoggedIn = false;
      storageService.setItem('isLoggedIn', false, state.demoMode);
      // Сохраняем userId и phone для повторного входа
    },
    clearAllData: (state) => {
      // Очищаем состояние Redux
      state.userId = null;
      state.phone = null;
      state.password = null;
      state.isLoggedIn = false;
      state.demoMode = false;
      
      // Очищаем все хранилища
      storageService.clearAllStorages(state.demoMode);
      // Также очищаем LocalStorageService
      LocalStorageService.getInstance().setDemoMode(false);
      LocalStorageService.getInstance().saveAccounts([]);
    },
    updateUserProfile: (state, action: PayloadAction<Partial<typeof initialState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { 
  setUser, 
  setPassword, 
  setIsLoggedIn, 
  setDemoMode, 
  clearDemoMode, 
  logout, 
  clearAuth, 
  requestPasswordReentry,
  clearAllData,
  updateUserProfile
} = authSlice.actions;

export default authSlice.reducer; 