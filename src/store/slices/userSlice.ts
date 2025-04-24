import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  full_name: string | null;
  is_demo: boolean;
}

const initialState: UserState = {
  full_name: null,
  is_demo: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<{ full_name: string; is_demo: boolean }>) => {
      state.full_name = action.payload.full_name;
      state.is_demo = action.payload.is_demo;
    },
    clearUserData: (state) => {
      state.full_name = null;
      state.is_demo = false;
    },
  },
});

export const { setUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer; 