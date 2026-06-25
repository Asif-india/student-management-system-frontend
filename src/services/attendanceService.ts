import api from './authService'

export interface Attendance {
  _id: string
  studentId: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  classId: {
    _id: string
    name: string
    code: string
  }
  date: string
  status: 'present' | 'absent' | 'late' | 'leave'
  remarks?: string
  markedBy?: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

export interface AttendanceStats {
  present: number
  absent: number
  late: number
  leave: number
  total: number
  percentage?: string
}

export interface AttendanceListResponse {
  data: Attendance[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface MarkAttendanceRequest {
  classId: string
  date: string
  attendance: Array<{
    studentId: string
    status: 'present' | 'absent' | 'late' | 'leave'
    remarks?: string
  }>
}

export interface MarkAttendanceResponse {
  success: boolean
  message: string
  data: Attendance[]
  errors?: Array<{
    studentId: string
    error: string
  }>
}

const attendanceService = {
  /**
   * Mark attendance for multiple students in a class
   */
  markAttendance: async (data: MarkAttendanceRequest): Promise<MarkAttendanceResponse> => {
    const response = await api.post('/attendance/mark', data)
    return response.data
  },

  /**
   * Get attendance by ID
   */
  getAttendanceById: async (id: string): Promise<{ success: boolean; data: Attendance }> => {
    const response = await api.get(`/attendance/${id}`)
    return response.data
  },

  /**
   * Get attendance list with filters and pagination
   */
  getAttendanceList: async (params: {
    page?: number
    limit?: number
    search?: string
    studentId?: string
    classId?: string
    date?: string
    status?: string
    startDate?: string
    endDate?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<AttendanceListResponse> => {
    const response = await api.get('/attendance', { params })
    return response.data
  },

  /**
   * Update attendance
   */
  updateAttendance: async (
    id: string,
    data: {
      status?: 'present' | 'absent' | 'late' | 'leave'
      remarks?: string
    }
  ): Promise<{ success: boolean; message: string; data: Attendance }> => {
    const response = await api.put(`/attendance/${id}`, data)
    return response.data
  },

  /**
   * Delete attendance
   */
  deleteAttendance: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/attendance/${id}`)
    return response.data
  },

  /**
   * Get attendance statistics for a class
   */
  getClassAttendanceStats: async (
    classId: string,
    date?: string
  ): Promise<{ success: boolean; data: AttendanceStats }> => {
    const response = await api.get(`/attendance/stats/class/${classId}`, {
      params: { date }
    })
    return response.data
  },

  /**
   * Get attendance statistics for a student
   */
  getStudentAttendanceStats: async (
    studentId: string,
    startDate?: string,
    endDate?: string
  ): Promise<{ success: boolean; data: AttendanceStats }> => {
    const response = await api.get(`/attendance/stats/student/${studentId}`, {
      params: { startDate, endDate }
    })
    return response.data
  },

  /**
   * Get today's attendance summary
   */
  getTodayAttendanceSummary: async (): Promise<{ success: boolean; data: AttendanceStats }> => {
    const response = await api.get('/attendance/summary/today')
    return response.data
  },

  /**
   * Get monthly attendance analytics
   */
  getMonthlyAttendanceAnalytics: async (
    month: number,
    year: number
  ): Promise<{ success: boolean; data: any[] }> => {
    const response = await api.get('/attendance/analytics/monthly', {
      params: { month, year }
    })
    return response.data
  }
}

export default attendanceService
