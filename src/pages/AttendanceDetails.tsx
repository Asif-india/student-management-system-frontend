// Attendance Details Page
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Calendar, User, Users, Check, X, Clock, FileText, Edit, Trash2 } from 'lucide-react'
import attendanceService  from '../services/attendanceService'
import { LoadingState, ErrorState } from '../components/ui'
import { notifyError, notifySuccess } from '../utils/notifications'

const AttendanceDetails: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { data: attendance, isLoading, error } = useQuery({
    queryKey: ['attendance', id],
    queryFn: () => attendanceService.getAttendanceById(id!),
    enabled: !!id
  })

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      attendanceService.deleteAttendance(id!)
        .then((response) => {
          notifySuccess(response.message)
          navigate('/dashboard/attendance')
        })
        .catch((error: any) => {
          notifyError(error.response?.data?.message || 'Failed to delete attendance')
        })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
      case 'absent':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
      case 'late':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
      case 'leave':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <Check className="w-5 h-5" />
      case 'absent':
        return <X className="w-5 h-5" />
      case 'late':
        return <Clock className="w-5 h-5" />
      case 'leave':
        return <FileText className="w-5 h-5" />
      default:
        return null
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading attendance details..." />
  }

  if (error) {
    return <ErrorState message="Failed to load attendance details" onRetry={() => window.location.reload()} />
  }

  if (!attendance?.data) {
    return <ErrorState message="Attendance not found" onRetry={() => navigate('/dashboard/attendance')} />
  }

  const att = attendance.data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/attendance')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Attendance Details</h1>
            <p className="text-text-secondary mt-1">View attendance record information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/attendance/${id}/edit`)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-secondary rounded-lg hover:bg-white dark:hover:bg-surface-primary hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 text-error-text rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 ease-out"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Attendance Info Card */}
      <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary overflow-hidden">
        {/* Status Banner */}
        <div className={`px-6 py-4 flex items-center gap-3 ${getStatusColor(att.status)}`}>
          {getStatusIcon(att.status)}
          <span className="text-lg font-semibold capitalize">{att.status}</span>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Information */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-accent-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-text-tertiary mb-1">Student</h3>
              <p className="text-lg font-semibold text-text-primary">
                {att.studentId.firstName} {att.studentId.lastName}
              </p>
              <p className="text-sm text-text-secondary">{att.studentId.email}</p>
            </div>
          </div>

          {/* Class Information */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-accent-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-text-tertiary mb-1">Class</h3>
              <p className="text-lg font-semibold text-text-primary">
                {att.classId.name} ({att.classId.code})
              </p>
            </div>
          </div>

          {/* Date Information */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-accent-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-text-tertiary mb-1">Date</h3>
              <p className="text-lg font-semibold text-text-primary">
                {new Date(att.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Remarks */}
          {att.remarks && (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-accent-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-text-tertiary mb-1">Remarks</h3>
                <p className="text-base text-text-primary">{att.remarks}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-6 border-t border-gray-200 dark:border-border-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-tertiary">Marked By:</span>
                <span className="ml-2 text-text-primary">
                  {att.markedBy ? `${att.markedBy.name} (${att.markedBy.email})` : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-text-tertiary">Created At:</span>
                <span className="ml-2 text-text-primary">
                  {new Date(att.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-text-tertiary">Last Updated:</span>
                <span className="ml-2 text-text-primary">
                  {new Date(att.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceDetails
