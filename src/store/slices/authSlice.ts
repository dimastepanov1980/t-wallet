import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storageService } from '../../services/storageService';

interface AuthState {
  userId: string | null;
  phone: string | null;
  password: string | null;
  isLoggedIn: boolean;
}

// Инициализация состояния
const initialState: AuthState = {
  userId: null,
  phone: null,
  password: null,
  isLoggedIn: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ id: string; phone: string; deviceId?: string }>) => {
      state.userId = action.payload.id;
      state.phone = action.payload.phone;
      storageService.setItem('userId', action.payload.id);
      storageService.setItem('phone', action.payload.phone);
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
      storageService.setItem('password', action.payload);
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
      storageService.setItem('isLoggedIn', action.payload);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      storageService.setItem('isLoggedIn', false);
      // Не очищаем userId и phone, чтобы сохранить данные для повторного входа
    },
    clearAuth: (state) => {
      state.userId = null;
      state.phone = null;
      state.password = null;
      state.isLoggedIn = false;
      storageService.removeItem('userId');
      storageService.removeItem('phone');
      storageService.removeItem('password');
      storageService.removeItem('isLoggedIn');
    },
    requestPasswordReentry: (state) => {
      state.isLoggedIn = false;
      storageService.setItem('isLoggedIn', false);
      // Сохраняем userId и phone для повторного входа
    },
    clearAllData: (state) => {
      state.userId = null;
      state.phone = null;
      state.password = null;
      state.isLoggedIn = false;
      storageService.clearAllStorages();
    },
  },
});

export const { 
  setUser, 
  setPassword, 
  setIsLoggedIn, 
  logout, 
  clearAuth, 
  requestPasswordReentry,
  clearAllData 
} = authSlice.actions;

export default authSlice.reducer; 