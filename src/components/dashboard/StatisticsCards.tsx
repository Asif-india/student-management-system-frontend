// Statistics Cards component for Admin Dashboard
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Users, GraduationCap, BookOpen, TrendingUp, Layers } from 'lucide-react'
import { StatCard } from '../ui'
import dashboardService from '../../services/dashboardService'
import { LoadingState } from '../ui'

const StatisticsCards: React.FC = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: dashboardService.getDashboardOverview,
    staleTime: 60000, // Cache for 1 minute
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <LoadingState key={i} />
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: 'Total Students',
      value: dashboardData?.data.totalStudents.toLocaleString() || '0',
      icon: Users,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Total Teachers',
      value: dashboardData?.data.totalTeachers.toLocaleString() || '0',
      icon: GraduationCap,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Total Classes',
      value: dashboardData?.data.totalClasses.toLocaleString() || '0',
      icon: Layers,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Total Subjects',
      value: dashboardData?.data.totalSubjects.toLocaleString() || '0',
      icon: BookOpen,
      trend: { value: 0, isPositive: true },
    },
    {
      title: 'Attendance Rate',
      value: `${dashboardData?.data.attendance.attendanceRate || '0'}%`,
      icon: TrendingUp,
      trend: { value: 0, isPositive: true },
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
        />
      ))}
    </div>
  )
}

export default StatisticsCards
