// TypeScript type definitions for the frontend
// This file will contain all shared types used across the application

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  enrollmentDate: string
  status: 'active' | 'inactive' | 'graduated'
  createdAt: string
  updatedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  timestamp: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  timestamp: string
}
