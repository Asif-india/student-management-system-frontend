// Authentication API service
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        })

        const { accessToken, refreshToken: newRefreshToken } = response.data.data

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: 'ADMIN' | 'TEACHER' | 'STUDENT'
    }
    accessToken: string
    refreshToken: string
  }
  message: string
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  refreshToken: async (refreshToken: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
      refreshToken,
    })
    return response.data
  },
}

export default api
