import api from './authService'

export interface DashboardOverview {
  totalStudents: number
  totalTeachers: number
  totalClasses: number
  totalSubjects: number
  attendance: {
    present: number
    absent: number
    late: number
    leave: number
    total: number
    attendanceRate: string
  }
}

export interface AttendanceStats {
  present: number
  absent: number
  late: number
  leave: number
  total: number
  attendanceRate: string
}

export interface MonthlyAnalytics {
  month: number
  monthName: string
  present: number
  absent: number
  late: number
  leave: number
  total: number
}

export interface RecentActivities {
  students: Array<{
    _id: string
    firstName: string
    lastName: string
    createdAt: string
  }>
  teachers: Array<{
    _id: string
    firstName: string
    lastName: string
    department?: string
    createdAt: string
  }>
  classes: Array<{
    _id: string
    name: string
    grade: string
    section: string
    createdAt: string
  }>
  subjects: Array<{
    _id: string
    name: string
    type: string
    createdAt: string
  }>
  attendance: Array<{
    _id: string
    studentId: {
      _id: string
      firstName: string
      lastName: string
    }
    status: string
    createdAt: string
  }>
}

const dashboardService = {
  /**
   * Get dashboard overview
   */
  getDashboardOverview: async (): Promise<{ success: boolean; data: DashboardOverview }> => {
    const response = await api.get('/dashboard/overview')
    return response.data
  },

  /**
   * Get attendance statistics
   */
  getAttendanceStats: async (): Promise<{ success: boolean; data: AttendanceStats }> => {
    const response = await api.get('/dashboard/attendance-stats')
    return response.data
  },

  /**
   * Get monthly analytics
   */
  getMonthlyAnalytics: async (
    year?: number
  ): Promise<{ success: boolean; data: MonthlyAnalytics[] }> => {
    const response = await api.get('/dashboard/monthly-analytics', {
      params: year ? { year } : undefined,
    })
    return response.data
  },

  /**
   * Get recent activities
   */
  getRecentActivities: async (): Promise<{ success: boolean; data: RecentActivities }> => {
    const response = await api.get('/dashboard/recent-activities')
    return response.data
  },
}

export default dashboardService
