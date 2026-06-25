// Authentication slice for Redux Toolkit
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Login failed')
    return data
  }
)

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const state = getState() as { auth: AuthState }
  await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.auth.accessToken}`,
    },
  })
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { getState }) => {
  const state = getState() as { auth: AuthState }
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${state.auth.accessToken}`,
    },
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to fetch user')
  return data
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        refreshToken: string
      }>
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.data.user
        state.accessToken = action.payload.data.accessToken
        state.refreshToken = action.payload.data.refreshToken
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.refreshToken = null
        state.isAuthenticated = false
      })
      // Get current user
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.data
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isAuthenticated = false
        state.accessToken = null
        state.refreshToken = null
      })
  },
})

export const { setCredentials, clearCredentials, clearError } = authSlice.actions
export default authSlice.reducer
