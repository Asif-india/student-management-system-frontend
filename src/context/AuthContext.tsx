// Authentication context for managing auth state
import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '../store'
import { login, logout, setCredentials, clearCredentials } from '../store/authSlice'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth)

  // Load credentials from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedAccessToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')

    if (storedUser && storedAccessToken && storedRefreshToken) {
      dispatch(
        setCredentials({
          user: JSON.parse(storedUser),
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
        })
      )
    }
  }, [dispatch])

  // Save credentials to localStorage when they change
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await dispatch(login({ email, password })).unwrap()
      localStorage.setItem('accessToken', result.data.accessToken)
      localStorage.setItem('refreshToken', result.data.refreshToken)
    } catch (error) {
      throw error
    }
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch(clearCredentials())
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }
  }

  const clearError = () => {
    dispatch({ type: 'auth/clearError' })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login: handleLogin,
        logout: handleLogout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
