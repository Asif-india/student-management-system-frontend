// Teacher API service for frontend
import api from './authService'
import { ApiResponse, PaginatedResponse } from '../types'

export interface Teacher {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  employeeId: string
  department?: string
  qualification?: string
  specialization?: string
  assignedClasses?: string[]
  assignedSubjects?: string[]
  hireDate: string
  status: 'active' | 'inactive' | 'on-leave'
  createdAt: string
  updatedAt: string
}

export interface CreateTeacherData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth?: string
  employeeId: string
  department?: string
  qualification?: string
  specialization?: string
  assignedClasses?: string[]
  assignedSubjects?: string[]
  hireDate: string
  status?: 'active' | 'inactive' | 'on-leave'
}

export interface UpdateTeacherData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  dateOfBirth?: string
  department?: string
  qualification?: string
  specialization?: string
  assignedClasses?: string[]
  assignedSubjects?: string[]
  status?: 'active' | 'inactive' | 'on-leave'
}

export interface TeacherStats {
  total: number
  active: number
  inactive: number
  onLeave: number
}

export const teacherService = {
  // Get all teachers with pagination, search, filter, and sort
  getTeachers: async (params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    department?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}) => {
    const response = await api.get<PaginatedResponse<Teacher>>('/teachers', { params })
    return response.data
  },

  // Get a single teacher by ID
  getTeacherById: async (id: string) => {
    const response = await api.get<ApiResponse<Teacher>>(
      `/teachers/${id}`
    )
    return response.data
  },

  // Create a new teacher
  createTeacher: async (data: CreateTeacherData) => {
    const response = await api.post<ApiResponse<Teacher>>(
      '/teachers',
      data
    )
    return response.data
  },

  // Update an existing teacher
  updateTeacher: async (id: string, data: UpdateTeacherData) => {
    const response = await api.put<ApiResponse<Teacher>>(
      `/teachers/${id}`,
      data
    )
    return response.data
  },

  // Delete a teacher
  deleteTeacher: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(
      `/teachers/${id}`
    )
    return response.data
  },

  // Assign classes to a teacher
  assignClasses: async (id: string, classes: string[]) => {
    const response = await api.post<ApiResponse<Teacher>>(
      `/teachers/${id}/classes`,
      { classes }
    )
    return response.data
  },

  // Assign subjects to a teacher
  assignSubjects: async (id: string, subjects: string[]) => {
    const response = await api.post<ApiResponse<Teacher>>(
      `/teachers/${id}/subjects`,
      { subjects }
    )
    return response.data
  },

  // Get teacher statistics
  getTeacherStats: async () => {
    const response = await api.get<ApiResponse<TeacherStats>>(
      '/teachers/stats'
    )
    return response.data
  },
}
