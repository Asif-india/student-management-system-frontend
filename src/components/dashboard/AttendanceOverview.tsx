// Attendance Overview component
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import dashboardService from '../../services/dashboardService'
import { LoadingState } from '../ui'

const AttendanceOverview: React.FC = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardService.getDashboardOverview,
    staleTime: 60000, // Cache for 1 minute
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
        <LoadingState />
      </div>
    )
  }

  const attendanceStats = dashboardData?.data.attendance || {
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    total: 0,
    attendanceRate: '0',
  }

  const percentages = {
    present: attendanceStats.total > 0
      ? ((attendanceStats.present / attendanceStats.total) * 100).toFixed(1)
      : '0',
    absent: attendanceStats.total > 0
      ? ((attendanceStats.absent / attendanceStats.total) * 100).toFixed(1)
      : '0',
    late: attendanceStats.total > 0
      ? ((attendanceStats.late / attendanceStats.total) * 100).toFixed(1)
      : '0',
  }

  return (
    <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
      <h2 className="text-lg font-semibold text-text-primary mb-6">Attendance Overview</h2>

      {/* Progress bars */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success-text" />
              <span className="text-sm font-medium text-text-secondary">Present</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {attendanceStats.present} ({percentages.present}%)
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-success-text rounded-full transition-all duration-500"
              style={{ width: `${percentages.present}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning-text" />
              <span className="text-sm font-medium text-text-secondary">Late</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {attendanceStats.late} ({percentages.late}%)
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-warning-text rounded-full transition-all duration-500"
              style={{ width: `${percentages.late}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-error-text" />
              <span className="text-sm font-medium text-text-secondary">Absent</span>
            </div>
            <span className="text-sm font-semibold text-text-primary">
              {attendanceStats.absent} ({percentages.absent}%)
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-background-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-error-text rounded-full transition-all duration-500"
              style={{ width: `${percentages.absent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-background-secondary rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Total Students</span>
          <span className="text-lg font-bold text-text-primary">{attendanceStats.total}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-text-secondary">Overall Attendance</span>
          <span className="text-lg font-bold text-success-text">{attendanceStats.attendanceRate}%</span>
        </div>
      </div>
    </div>
  )
}

export default AttendanceOverview
