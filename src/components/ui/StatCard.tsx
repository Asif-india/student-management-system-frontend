// Reusable Stat Card component
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  loading?: boolean
  error?: boolean
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  loading = false,
  error = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none p-6 border border-gray-200 dark:border-border-primary">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 dark:bg-background-tertiary rounded w-24"></div>
            <div className="h-10 w-10 bg-gray-200 dark:bg-background-tertiary rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-background-tertiary rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-background-tertiary rounded w-20"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none p-6 border border-error-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-error-text mt-1">Error</p>
          </div>
          <div className="h-12 w-12 bg-error-bg rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-error-text" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none p-6 border border-gray-200 dark:border-border-primary hover:-translate-y-1 hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success-text' : 'text-error-text'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-sm text-text-secondary ml-2">from last month</span>
            </div>
          )}
        </div>
        <div className="h-14 w-14 bg-accent-muted rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 ease-out">
          <Icon className="w-7 h-7 text-accent-primary" />
        </div>
      </div>
    </div>
  )
}

export default StatCard
