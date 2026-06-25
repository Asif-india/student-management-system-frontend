// Analytics Chart component
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Users, Calendar } from 'lucide-react'
import dashboardService from '../../services/dashboardService'
import { LoadingState } from '../ui'

const AnalyticsChart: React.FC = () => {
  const { data: monthlyData, isLoading } = useQuery({
    queryKey: ['monthly-analytics'],
    queryFn: () => dashboardService.getMonthlyAnalytics(),
    staleTime: 300000, // Cache for 5 minutes
  })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
        <LoadingState />
      </div>
    )
  }

  const currentYearData = monthlyData?.data || []
  const currentYear = new Date().getFullYear()

  // Calculate summary stats
  const totalAttendance = currentYearData.reduce((sum: number, month: any) => sum + month.total, 0)
  const avgAttendance = currentYearData.length > 0
    ? (currentYearData.reduce((sum: number, month: any) => sum + month.present + month.late, 0) / totalAttendance) * 100
    : 0

  const maxValue = Math.max(...currentYearData.map((d: any) => d.total), 1)

  return (
    <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Monthly Attendance Analytics ({currentYear})</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-blue-50 dark:bg-accent-muted text-blue-600 dark:text-accent-primary rounded-lg hover:bg-blue-100 dark:hover:bg-accent-primary/20 transition-colors">
            Attendance
          </button>
        </div>
      </div>

      {/* Simple bar chart visualization */}
      <div className="space-y-4">
        {currentYearData.slice(0, 6).map((data: any, index: number) => {
          const attendanceRate = data.total > 0
            ? ((data.present + data.late) / data.total) * 100
            : 0
          return (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 text-sm text-text-secondary">{data.monthName}</div>
              <div className="flex-1">
                <div className="relative h-8 bg-gray-100 dark:bg-background-tertiary rounded-lg overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-accent-primary rounded-lg transition-all duration-500"
                    style={{ width: `${(data.total / maxValue) * 100}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-xs font-medium text-text-primary">{data.total}</span>
                  </div>
                </div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-medium text-success-text">{attendanceRate.toFixed(0)}%</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-border-primary">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-accent-primary mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Total</span>
          </div>
          <p className="text-lg font-bold text-text-primary">{totalAttendance.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-success-text mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Avg</span>
          </div>
          <p className="text-lg font-bold text-text-primary">{avgAttendance.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-accent-primary mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Months</span>
          </div>
          <p className="text-lg font-bold text-text-primary">{currentYearData.length}</p>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsChart
