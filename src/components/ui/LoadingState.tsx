// Loading State component
import React from 'react'

interface LoadingStateProps {
  message?: string
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mb-4"></div>
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  )
}

export default LoadingState
