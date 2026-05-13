import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState } from '../../types';
import { authApi } from '../../utils/api';

const storedUser = localStorage.getItem('social_user');
const storedToken = localStorage.getItem('social_token');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,
  isLoading: false,
  error: null,
};

export const loginThunk = createAsyncThunk('auth/login', async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
  try {
    const res = await authApi.login(email, password);
    localStorage.setItem('social_token', res.data.token);
    localStorage.setItem('social_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } } };
    return rejectWithValue(error.response?.data?.error || 'Login failed');
  }
});

export const registerThunk = createAsyncThunk('auth/register', async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
  try {
    const res = await authApi.register(name, email, password);
    localStorage.setItem('social_token', res.data.token);
    localStorage.setItem('social_user', JSON.stringify(res.data.user));
    return res.data;
  } catch (err: unknown) {
    const error = err as { response?: { data?: { error?: string } } };
    return rejectWithValue(error.response?.data?.error || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('social_token');
      localStorage.removeItem('social_user');
    },
    clearError: (state) => { state.error = null; },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('social_user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    const pending = (state: AuthState) => { state.isLoading = true; state.error = null; };
    const fulfilled = (state: AuthState, action: { payload: { token: string; user: AuthState['user'] } }) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
    };
    const rejected = (state: AuthState, action: { payload?: unknown }) => {
      state.isLoading = false;
      state.error = action.payload as string;
    };
    builder
      .addCase(loginThunk.pending, pending).addCase(loginThunk.fulfilled, fulfilled).addCase(loginThunk.rejected, rejected)
      .addCase(registerThunk.pending, pending).addCase(registerThunk.fulfilled, fulfilled).addCase(registerThunk.rejected, rejected);
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
