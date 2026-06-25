// Admin Dashboard page
import React, { useState, useEffect } from 'react'
import {
  StatisticsCards,
  RecentActivities,
  QuickActions,
  AnalyticsChart,
  AttendanceOverview,
} from '../components/dashboard'
import { LoadingState, ErrorState } from '../components/ui'

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setLoading(false)
      } catch (err) {
        setError('Failed to load dashboard data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRetry = () => {
    // Refetch data
    window.location.reload()
  }

  if (loading) {
    return <LoadingState message="Loading dashboard..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-secondary mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Chart */}
        <AnalyticsChart />

        {/* Attendance Overview */}
        <AttendanceOverview />
      </div>

      {/* Recent Activities */}
      <RecentActivities />
    </div>
  )
}

export default AdminDashboard
