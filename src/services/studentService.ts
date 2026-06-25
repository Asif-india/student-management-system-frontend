// Student API service for frontend
import api from './authService'
import { ApiResponse, PaginatedResponse } from '../types'

export interface Student {
  _id: string
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

export interface CreateStudentData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  enrollmentDate: string
  status?: 'active' | 'inactive' | 'graduated'
}

export interface UpdateStudentData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  status?: 'active' | 'inactive' | 'graduated'
}

export interface StudentStats {
  total: number
  active: number
  inactive: number
  graduated: number
}

export const studentService = {
  // Get all students with pagination, search, filter, and sort
  getStudents: async (params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}) => {
    const response = await api.get<PaginatedResponse<Student>>('/students', { params })
    return response.data
  },

  // Get a single student by ID
  getStudentById: async (id: string) => {
    const response = await api.get<ApiResponse<Student>>(
      `/students/${id}`
    )
    return response.data
  },

  // Create a new student
  createStudent: async (data: CreateStudentData) => {
    const response = await api.post<ApiResponse<Student>>(
      '/students',
      data
    )
    return response.data
  },

  // Update an existing student
  updateStudent: async (id: string, data: UpdateStudentData) => {
    const response = await api.put<ApiResponse<Student>>(
      `/students/${id}`,
      data
    )
    return response.data
  },

  // Delete a student
  deleteStudent: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/students/${id}`
    )
    return response.data
  },

  // Get student statistics
  getStudentStats: async () => {
    const response = await api.get<ApiResponse<StudentStats>>(
      '/students/stats'
    )
    return response.data
  },
}
