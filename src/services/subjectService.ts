// Subject API service
import api from './authService'
import { ApiResponse, PaginatedResponse } from '../types'

export interface Subject {
  _id: string
  name: string
  code: string
  description?: string
  credits: number
  type: 'core' | 'elective' | 'optional'
  grade: string
  assignedTeachers?: Array<{
    _id: string
    firstName: string
    lastName: string
    email: string
    employeeId?: string
  }>
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface CreateSubjectData {
  name: string
  code: string
  description?: string
  credits: number
  type?: 'core' | 'elective' | 'optional'
  grade: string
  assignedTeachers?: string[]
  status?: 'active' | 'inactive'
}

export interface UpdateSubjectData {
  name?: string
  code?: string
  description?: string
  credits?: number
  type?: 'core' | 'elective' | 'optional'
  grade?: string
  assignedTeachers?: string[]
  status?: 'active' | 'inactive'
}

export interface SubjectStats {
  total: number
  active: number
  inactive: number
  core: number
  elective: number
  optional: number
}

const subjectService = {
  // Get all subjects with pagination and filters
  getAllSubjects: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    grade?: string
    type?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    const response = await api.get<PaginatedResponse<Subject>>('/subjects', { params })
    return response.data
  },

  // Get single subject by ID
  getSubjectById: async (id: string) => {
    const response = await api.get<ApiResponse<Subject>>(`/subjects/${id}`)
    return response.data
  },

  // Create new subject
  createSubject: async (subjectData: CreateSubjectData) => {
    const response = await api.post<ApiResponse<Subject>>('/subjects', subjectData)
    return response.data
  },

  // Update subject
  updateSubject: async (id: string, subjectData: UpdateSubjectData) => {
    const response = await api.put<ApiResponse<Subject>>(`/subjects/${id}`, subjectData)
    return response.data
  },

  // Delete subject
  deleteSubject: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/subjects/${id}`)
    return response.data
  },

  // Assign teachers to subject
  assignSubjectTeachers: async (id: string, teacherIds: string[]) => {
    const response = await api.post<ApiResponse<Subject>>(`/subjects/${id}/teachers`, { teacherIds })
    return response.data
  },

  // Get subject statistics
  getSubjectStats: async () => {
    const response = await api.get<ApiResponse<SubjectStats>>('/subjects/stats')
    return response.data
  },
}

export default subjectService
