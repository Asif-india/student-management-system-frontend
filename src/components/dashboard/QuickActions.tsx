// Quick Actions section component
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, GraduationCap, Calendar, BookOpen, Layers } from 'lucide-react'
import { QuickActionCard } from '../ui'

const QuickActions: React.FC = () => {
  const navigate = useNavigate()

  const actions = [
    {
      icon: UserPlus,
      title: 'Add Student',
      description: 'Register a new student',
      onClick: () => navigate('/dashboard/students/add'),
      color: 'blue' as const,
    },
    {
      icon: GraduationCap,
      title: 'Add Teacher',
      description: 'Register a new teacher',
      onClick: () => navigate('/dashboard/teachers/add'),
      color: 'green' as const,
    },
    {
      icon: Layers,
      title: 'Add Class',
      description: 'Create a new class schedule',
      onClick: () => navigate('/dashboard/classes/add'),
      color: 'purple' as const,
    },
    {
      icon: BookOpen,
      title: 'Add Subject',
      description: 'Create a new subject',
      onClick: () => navigate('/dashboard/subjects/add'),
      color: 'orange' as const,
    },
    {
      icon: Calendar,
      title: 'Mark Attendance',
      description: 'Record attendance',
      onClick: () => navigate('/dashboard/attendance/mark'),
      color: 'cyan' as const,
    },
  ]

  return (
    <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-6 hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
      <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <QuickActionCard
            key={index}
            icon={action.icon}
            title={action.title}
            description={action.description}
            onClick={action.onClick}
            color={action.color}
          />
        ))}
      </div>
    </div>
  )
}

export default QuickActions
