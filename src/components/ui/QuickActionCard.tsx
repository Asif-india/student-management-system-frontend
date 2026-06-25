// Reusable Quick Action Card component
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface QuickActionCardProps {
  icon: LucideIcon
  title: string
  description: string
  onClick: () => void
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'teal' |'cyan'
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-500/5 hover:bg-blue-100 dark:hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:shadow-md hover:shadow-blue-500/10',
    green: 'bg-green-50 dark:bg-green-500/5 hover:bg-green-100 dark:hover:bg-green-500/10 text-green-600 dark:text-green-400 hover:shadow-md hover:shadow-green-500/10',
    purple: 'bg-purple-50 dark:bg-purple-500/5 hover:bg-purple-100 dark:hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:shadow-md hover:shadow-purple-500/10',
    orange: 'bg-orange-50 dark:bg-orange-500/5 hover:bg-orange-100 dark:hover:bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:shadow-md hover:shadow-orange-500/10',
    teal: 'bg-teal-50 dark:bg-teal-500/5 hover:bg-teal-100 dark:hover:bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:shadow-md hover:shadow-teal-500/10',
    cyan: 'bg-cyan-50 dark:bg-cyan-500/5 hover:bg-cyan-100 dark:hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:shadow-md hover:shadow-cyan-500/10',
  }

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-border-primary shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out ${colorClasses[color]}`}
    >
      <div className="flex flex-col items-center text-center gap-3">
        <div className="h-12 w-12 bg-white dark:bg-surface-elevated rounded-lg flex items-center justify-center shadow-sm hover:scale-110 transition-transform duration-300 ease-out">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        </div>
      </div>
    </button>
  )
}

export default QuickActionCard
