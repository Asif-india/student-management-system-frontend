// Edit Attendance Page
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Save, Calendar, User, Users, Check, X, Clock, FileText } from 'lucide-react'
import attendanceService from '../services/attendanceService'
import { notifySuccess, notifyError } from '../utils/notifications'
import { LoadingState, ErrorState } from '../components/ui'

const EditAttendance: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const [status, setStatus] = useState<'present' | 'absent' | 'late' | 'leave'>('present')
  const [remarks, setRemarks] = useState('')

  const { data: attendance, isLoading, error } = useQuery({
    queryKey: ['attendance', id],
    queryFn: () => attendanceService.getAttendanceById(id!),
    enabled: !!id
  })

  useEffect(() => {
    if (attendance?.data) {
      setStatus(attendance.data.status)
      setRemarks(attendance.data.remarks || '')
    }
  }, [attendance])

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: 'present' | 'absent' | 'late' | 'leave'; remarks?: string } }) =>
      attendanceService.updateAttendance(id, data),
    onSuccess: (response) => {
      notifySuccess(response.message)
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      navigate(`/dashboard/attendance`)
    },
    onError: (error: any) => {
      notifyError(error.response?.data?.message || 'Failed to update attendance')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      id: id!,
      data: { status, remarks: remarks || undefined }
    })
  }

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'present':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-300 dark:border-green-700'
      case 'absent':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-300 dark:border-red-700'
      case 'late':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700'
      case 'leave':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border-gray-300 dark:border-gray-700'
      default:
        return 'bg-gray-50 dark:bg-background-tertiary text-text-secondary border-gray-200 dark:border-border-primary'
    }
  }

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'present':
        return <Check className="w-4 h-4" />
      case 'absent':
        return <X className="w-4 h-4" />
      case 'late':
        return <Clock className="w-4 h-4" />
      case 'leave':
        return <FileText className="w-4 h-4" />
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
            onClick={() => navigate(`/dashboard/attendance/${id}`)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-background-tertiary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Edit Attendance</h1>
            <p className="text-text-secondary mt-1">Update attendance record</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Attendance Info Card */}
        <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Student Information */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-background-tertiary rounded-lg">
              <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-text-tertiary mb-1">Student</h3>
                <p className="text-sm font-semibold text-text-primary">
                  {att.studentId.firstName} {att.studentId.lastName}
                </p>
                <p className="text-xs text-text-secondary">{att.studentId.email}</p>
              </div>
            </div>

            {/* Class Information */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-background-tertiary rounded-lg">
              <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <h3 className="text-xs font-medium text-text-tertiary mb-1">Class</h3>
                <p className="text-sm font-semibold text-text-primary">
                  {att.classId.name} ({att.classId.code})
                </p>
              </div>
            </div>
          </div>

          {/* Date Information */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-background-tertiary rounded-lg mb-6">
            <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-tertiary mb-1">Date</h3>
              <p className="text-sm font-semibold text-text-primary">
                {new Date(att.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-secondary mb-3">Status</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['present', 'absent', 'late', 'leave'].map((statusValue) => (
                <button
                  key={statusValue}
                  type="button"
                  onClick={() => setStatus(statusValue as any)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                    status === statusValue
                      ? `${getStatusColor(statusValue)} border-current`
                      : 'bg-gray-50 dark:bg-background-tertiary text-text-secondary border-gray-200 dark:border-border-primary hover:bg-gray-100 dark:hover:bg-background-secondary'
                  }`}
                >
                  {getStatusIcon(statusValue)}
                  <span className="text-sm font-medium capitalize">{statusValue}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="mb-6">
            <label htmlFor="remarks" className="block text-sm font-medium text-text-secondary mb-2">
              Remarks
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Add any additional notes..."
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 placeholder-text-tertiary transition-all duration-300 ease-out resize-none"
            />
            <p className="text-xs text-text-tertiary mt-1">
              {remarks.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-border-primary">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/attendance/${id}`)}
              className="px-6 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-secondary rounded-lg hover:bg-white dark:hover:bg-surface-primary hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors shadow-sm hover:shadow-md transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default EditAttendance
