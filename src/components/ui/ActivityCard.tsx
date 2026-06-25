// Reusable Activity Card component
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ActivityCardProps {
  icon: LucideIcon
  title: string
  description: string
  time: string
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'teal' | 'cyan'
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  icon: Icon,
  title,
  description,
  time,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-accent-muted text-blue-600 dark:text-accent-primary',
    green: 'bg-green-50 dark:bg-success-bg text-green-600 dark:text-success-text',
    yellow: 'bg-yellow-50 dark:bg-warning-bg text-yellow-600 dark:text-warning-text',
    red: 'bg-red-50 dark:bg-error-bg text-red-600 dark:text-error-text',
    purple: 'bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
    teal: 'bg-teal-50 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400',
    cyan: 'bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-white dark:bg-surface-primary rounded-lg border border-gray-200 dark:border-border-primary shadow-sm dark:shadow-none hover:border-gray-300 dark:hover:border-border-secondary transition-colors">
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-sm text-text-secondary mt-1 truncate">{description}</p>
        <p className="text-xs text-text-tertiary mt-2">{time}</p>
      </div>
    </div>
  )
}

export default ActivityCard
