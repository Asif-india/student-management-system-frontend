// Global Search Service
import api from './authService'
import { ApiResponse } from '../types'

export interface SearchResult {
  type: 'student' | 'teacher' | 'class' | 'subject'
  id: string
  title: string
  subtitle: string
  metadata: Record<string, any>
  url: string
}

export interface SearchResponse {
  query: string
  results: SearchResult[]
  total: number
  byType: {
    student: number
    teacher: number
    class: number
    subject: number
  }
}

const searchService = {
  // Global search across all entities
  globalSearch: async (params: {
    q: string
    limit?: number
    type?: 'student' | 'teacher' | 'class' | 'subject'
  }) => {
    const response = await api.get<ApiResponse<SearchResponse>>('/search', { params })
    return response.data
  },
}

export default searchService
