// Class API service
import api from './authService'
import { ApiResponse, PaginatedResponse } from '../types'

export interface Class {
  _id: string
  name: string
  code: string
  grade: string
  section: string
  academicYear: string
  classTeacher?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    employeeId?: string
  }
  students?: Array<{
    _id: string
    firstName: string
    lastName: string
    email: string
    studentId?: string
  }>
  subjects?: Array<{
    _id: string
    name: string
    code: string
    credits?: number
    type?: string
  }>
  capacity: number
  status: 'active' | 'inactive' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface CreateClassData {
  name: string
  code: string
  grade: string
  section: string
  academicYear: string
  classTeacher?: string
  students?: string[]
  subjects?: string[]
  capacity: number
  status?: 'active' | 'inactive' | 'archived'
}

export interface UpdateClassData {
  name?: string
  code?: string
  grade?: string
  section?: string
  academicYear?: string
  classTeacher?: string
  students?: string[]
  subjects?: string[]
  capacity?: number
  status?: 'active' | 'inactive' | 'archived'
}

export interface ClassStats {
  total: number
  active: number
  inactive: number
  archived: number
}

const classService = {
  // Get all classes with pagination and filters
  getAllClasses: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    grade?: string
    academicYear?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) => {
    const response = await api.get<PaginatedResponse<Class>>('/classes', { params })
    return response.data
  },

  // Get single class by ID
  getClassById: async (id: string) => {
    const response = await api.get<ApiResponse<Class>>(`/classes/${id}`)
    return response.data
  },

  // Create new class
  createClass: async (classData: CreateClassData) => {
    const response = await api.post<ApiResponse<Class>>('/classes', classData)
    return response.data
  },

  // Update class
  updateClass: async (id: string, classData: UpdateClassData) => {
    const response = await api.put<ApiResponse<Class>>(`/classes/${id}`, classData)
    return response.data
  },

  // Delete class
  deleteClass: async (id: string) => {
    const response = await api.delete<ApiResponse<{ message: string }>>(`/classes/${id}`)
    return response.data
  },

  // Assign class teacher
  assignClassTeacher: async (id: string, teacherId: string) => {
    const response = await api.post<ApiResponse<Class>>(`/classes/${id}/teacher`, { teacherId })
    return response.data
  },

  // Assign students to class
  assignClassStudents: async (id: string, studentIds: string[]) => {
    const response = await api.post<ApiResponse<Class>>(`/classes/${id}/students`, { studentIds })
    return response.data
  },

  // Assign subjects to class
  assignClassSubjects: async (id: string, subjectIds: string[]) => {
    const response = await api.post<ApiResponse<Class>>(`/classes/${id}/subjects`, { subjectIds })
    return response.data
  },

  // Get class statistics
  getClassStats: async () => {
    const response = await api.get<ApiResponse<ClassStats>>('/classes/stats')
    return response.data
  },
}

export default classService
