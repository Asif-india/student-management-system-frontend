// Error State component
import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

const ErrorState: React.FC<ErrorStateProps> = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="h-16 w-16 bg-error-bg rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-error-text" />
      </div>
      <p className="text-text-primary font-medium mb-2">{message}</p>
      <p className="text-text-secondary text-sm mb-4">Please try again later</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  )
}

export default ErrorState
