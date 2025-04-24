import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  userId: string | null;
  phone: string | null;
  password: string | null;
  isDemo: boolean;
  deviceId: string | null;
}

const initialState: AuthState = {
  userId: null,
  phone: null,
  password: null,
  isDemo: false,
  deviceId: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setUser: (state, action: PayloadAction<{ userId: string; phone: string; password: string }>) => {
      state.userId = action.payload.userId;
      state.phone = action.payload.phone;
      state.password = action.payload.password;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setIsDemo: (state, action: PayloadAction<boolean>) => {
      state.isDemo = action.payload;
    },
    setDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload;
    },
    logout: (state) => {
      state.userId = null;
      state.phone = null;
      state.password = null;
      state.isDemo = false;
      state.deviceId = null;
    },
  },
});

export const { setPhone, setUser, setPassword, setIsDemo, setDeviceId, logout } = authSlice.actions;
export default authSlice.reducer; 