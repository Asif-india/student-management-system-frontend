// Student Details page
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentService } from '../services/studentService'
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react'
import { LoadingState, ErrorState } from '../components/ui'
import { notifySuccess, notifyError } from '../utils/notifications'

const StudentDetails: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: studentData, isLoading, error } = useQuery({
    queryKey: ['student', id],
    queryFn: () => studentService.getStudentById(id!),
    enabled: !!id,
  })

  // const deleteMutation = useMutation({
  //   mutationFn: studentService.deleteStudent,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['students'] })
  //     navigate('/dashboard/students')
  //   },
  // })

  const deleteMutation = useMutation({
      mutationFn: studentService.deleteStudent,
      onSuccess: (response) => {
        notifySuccess(response.message)
        queryClient.invalidateQueries({ queryKey: ['students'] })
        navigate('/dashboard/students')
      },
      onError: (error: any) => {
        notifyError(error.response?.data?.message || 'Failed to delete student')
      },
      
    })

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteMutation.mutate(id!)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-success-text" />
      case 'inactive':
        return <XCircle className="w-5 h-5 text-text-tertiary" />
      case 'graduated':
        return <Clock className="w-5 h-5 text-accent-primary" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-bg text-success-text'
      case 'inactive':
        return 'bg-background-tertiary text-text-secondary'
      case 'graduated':
        return 'bg-accent-muted text-accent-primary'
      default:
        return 'bg-background-tertiary text-text-secondary'
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading student details..." />
  }

  if (error) {
    return <ErrorState message="Failed to load student details" onRetry={() => window.location.reload()} />
  }

  const student = studentData?.data

  if (!student) {
    return <ErrorState message="Student not found" onRetry={() => navigate('/dashboard/students')} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/students')}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
                   </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Student Details</h1>
            <p className="text-text-secondary mt-1">View and manage student information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/students/${student._id}/edit`)}
            className="flex items-center gap-2 px-4 py-2 border border-border-primary bg-background-tertiary text-text-secondary rounded-lg hover:bg-background-secondary transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-error-bg text-error-text rounded-lg hover:bg-error-border transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-accent-muted rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-accent-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-primary">
                {student.firstName} {student.lastName}
              </h2>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(student.status)}`}>
                {student.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-text-secondary">
              {getStatusIcon(student.status)}
              <span className="capitalize">{student.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-text-tertiary mt-0.5" />
              <div>
                <p className="text-sm text-text-tertiary">Email</p>
                <p className="text-text-primary">{student.email}</p>
              </div>
            </div>
            {student.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-text-tertiary mt-0.5" />
                <div>
                  <p className="text-sm text-text-tertiary">Phone</p>
                  <p className="text-text-primary">{student.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h3>
          <div className="space-y-4">
            {student.dateOfBirth && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-text-tertiary mt-0.5" />
                <div>
                  <p className="text-sm text-text-tertiary">Date of Birth</p>
                  <p className="text-text-primary">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-text-tertiary mt-0.5" />
              <div>
                <p className="text-sm text-text-tertiary">Enrollment Date</p>
                <p className="text-text-primary">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Timestamps</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-text-tertiary">Created At</p>
            <p className="text-text-primary">{new Date(student.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-text-tertiary">Last Updated</p>
            <p className="text-text-primary">{new Date(student.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDetails
