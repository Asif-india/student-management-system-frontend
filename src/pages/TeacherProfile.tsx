// Teacher Profile page
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherService } from '../services/teacherService'
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, User, Briefcase, BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react'
import { LoadingState, ErrorState } from '../components/ui'

const TeacherProfile: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: teacherData, isLoading, error } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherService.getTeacherById(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: teacherService.deleteTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      navigate('/dashboard/teachers')
    },
  })

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteMutation.mutate(id!)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-success-text" />
      case 'inactive':
        return <XCircle className="w-5 h-5 text-text-tertiary" />
      case 'on-leave':
        return <Clock className="w-5 h-5 text-warning-text" />
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
      case 'on-leave':
        return 'bg-warning-bg text-warning-text'
      default:
        return 'bg-background-tertiary text-text-secondary'
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading teacher details..." />
  }

  if (error) {
    return <ErrorState message="Failed to load teacher details" onRetry={() => window.location.reload()} />
  }

  const teacher = teacherData?.data

  if (!teacher) {
    return <ErrorState message="Teacher not found" onRetry={() => navigate('/dashboard/teachers')} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/teachers')}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Teacher Profile</h1>
            <p className="text-text-secondary mt-1">View and manage teacher information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/teachers/${teacher._id}/edit`)}
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

      {/* Teacher Info Card */}
      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-accent-muted rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-accent-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-primary">
                {teacher.firstName} {teacher.lastName}
              </h2>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(teacher.status)}`}>
                {teacher.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-text-secondary">
              {getStatusIcon(teacher.status)}
              <span className="capitalize">{teacher.status}</span>
            </div>
            <div className="mt-1 text-sm text-text-tertiary">Employee ID: {teacher.employeeId}</div>
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
                <p className="text-text-primary">{teacher.email}</p>
              </div>
            </div>
            {teacher.phone && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-text-tertiary mt-0.5" />
                <div>
                  <p className="text-sm text-text-tertiary">Phone</p>
                  <p className="text-text-primary">{teacher.phone}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Personal Information</h3>
          <div className="space-y-4">
            {teacher.dateOfBirth && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-text-tertiary mt-0.5" />
                <div>
                  <p className="text-sm text-text-tertiary">Date of Birth</p>
                  <p className="text-text-primary">{new Date(teacher.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-text-tertiary mt-0.5" />
              <div>
                <p className="text-sm text-text-tertiary">Hire Date</p>
                <p className="text-text-primary">{new Date(teacher.hireDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Professional Information</h3>
          <div className="space-y-4">
            {teacher.department && (
              <div>
                <p className="text-sm text-text-tertiary">Department</p>
                <p className="text-text-primary">{teacher.department}</p>
              </div>
            )}
            {teacher.qualification && (
              <div>
                <p className="text-sm text-text-tertiary">Qualification</p>
                <p className="text-text-primary">{teacher.qualification}</p>
              </div>
            )}
            {teacher.specialization && (
              <div>
                <p className="text-sm text-text-tertiary">Specialization</p>
                <p className="text-text-primary">{teacher.specialization}</p>
              </div>
            )}
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Assignments</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-text-tertiary mt-0.5" />
              <div>
                <p className="text-sm text-text-tertiary">Assigned Classes</p>
                <p className="text-text-primary">
                  {teacher.assignedClasses && teacher.assignedClasses.length > 0
                    ? teacher.assignedClasses.join(', ')
                    : 'None assigned'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-text-tertiary mt-0.5" />
              <div>
                <p className="text-sm text-text-tertiary">Assigned Subjects</p>
                <p className="text-text-primary">
                  {teacher.assignedSubjects && teacher.assignedSubjects.length > 0
                    ? teacher.assignedSubjects.join(', ')
                    : 'None assigned'}
                </p>
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
            <p className="text-text-primary">{new Date(teacher.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-text-tertiary">Last Updated</p>
            <p className="text-text-primary">{new Date(teacher.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherProfile
