// Mark Attendance Page
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Users, Check, X, Clock, FileText, Save, ArrowLeft } from 'lucide-react'
import classService from '../services/classService'
import { studentService } from '../services/studentService'
import attendanceService from '../services/attendanceService'
import { notifySuccess, notifyError } from '../utils/notifications'
import { LoadingState } from '../components/ui'

const MarkAttendance: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'leave'>>({})

  // Fetch classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getAllClasses({ page: 1, limit: 100 })
  })

  // Fetch students when class is selected
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', selectedClassId],
    queryFn: () => studentService.getStudents({ page: 1, limit: 100 }),
    enabled: !!selectedClassId
  })

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: attendanceService.markAttendance,
    onSuccess: (response) => {
      notifySuccess(response.message)
      if (response.errors && response.errors.length > 0) {
        notifyError(`${response.errors.length} records failed to update`)
      }
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      navigate('/dashboard/attendance')
    },
    onError: (error: any) => {
      notifyError(error.response?.data?.message || 'Failed to mark attendance')
    }
  })

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId)
    setAttendance({})
  }

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleMarkAllPresent = () => {
    if (studentsData?.data) {
      const allPresent: Record<string, 'present' | 'absent' | 'late' | 'leave'> = {}
      studentsData.data.forEach(student => {
        allPresent[student._id] = 'present'
      })
      setAttendance(allPresent)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClassId || Object.keys(attendance).length === 0) {
      notifyError('Please select a class and mark attendance for at least one student')
      return
    }

    const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status
    }))

    markAttendanceMutation.mutate({
      classId: selectedClassId,
      date: selectedDate,
      attendance: attendanceData
    })
  }

  const getStatusColor = (status: 'present' | 'absent' | 'late' | 'leave') => {
    switch (status) {
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

  const getStatusIcon = (status: 'present' | 'absent' | 'late' | 'leave') => {
    switch (status) {
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

  if (classesLoading) {
    return <LoadingState message="Loading classes..." />
  }

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
            <h1 className="text-2xl font-bold text-text-primary">Mark Attendance</h1>
            <p className="text-text-secondary mt-1">Mark attendance for students in a class</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selection Section */}
        <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Select Class
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 transition-all duration-300 ease-out"
                required
              >
                <option value="">Select a class</option>
                {classes?.data?.map((classItem: any) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name} ({classItem.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 transition-all duration-300 ease-out"
                required
              />
            </div>
          </div>
        </div>

        {/* Students List */}
        {selectedClassId && studentsLoading && <LoadingState message="Loading students..." />}

        {selectedClassId && studentsData?.data && studentsData.data.length > 0 && (
          <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-border-primary flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">
                Students ({studentsData.data.length})
              </h2>
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-accent-primary/10 text-accent-primary rounded-lg hover:bg-accent-primary/20 transition-colors"
              >
                <Check className="w-4 h-4" />
                Mark All Present
              </button>
            </div>

            <div className="divide-y divide-gray-200 dark:divide-border-primary">
              {studentsData.data.map((student: any) => (
                <div key={student._id} className="p-6 hover:bg-gray-50 dark:hover:bg-background-secondary transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-accent-primary font-semibold">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-text-secondary">{student.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {['present', 'absent', 'late', 'leave'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => handleStatusChange(student._id, status as any)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                            attendance[student._id] === status
                              ? getStatusColor(status as any)
                              : 'bg-gray-50 dark:bg-background-tertiary text-text-secondary border-gray-200 dark:border-border-primary hover:bg-gray-100 dark:hover:bg-background-secondary'
                          }`}
                        >
                          {getStatusIcon(status as any)}
                          <span className="ml-1 capitalize">{status}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-border-primary flex justify-end">
              <button
                type="submit"
                disabled={markAttendanceMutation.isPending || Object.keys(attendance).length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors shadow-sm hover:shadow-md transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {markAttendanceMutation.isPending ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        )}

        {selectedClassId && studentsData?.data && studentsData.data.length === 0 && (
          <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-12 text-center">
            <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-secondary text-lg">No students found in this class</p>
          </div>
        )}
      </form>
    </div>
  )
}

export default MarkAttendance
