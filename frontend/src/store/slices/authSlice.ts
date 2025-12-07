import { createSlice } from '@reduxjs/toolkit';
import type { IUser } from '../../types';
import type { PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  selectedCompanyId: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: !!localStorage.getItem('token'),
  selectedCompanyId: localStorage.getItem('selectedCompanyId'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.selectedCompanyId = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('selectedCompanyId');
    },
    setSelectedCompany: (state, action: PayloadAction<string>) => {
      state.selectedCompanyId = action.payload;
      localStorage.setItem('selectedCompanyId', action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
        } catch (error) {
          console.error('Failed to parse user from localStorage:', error);
        }
      }
    },
  },
});

export const { setCredentials, logout, setLoading, loadUserFromStorage, setSelectedCompany } = authSlice.actions;
export default authSlice.reducer;
