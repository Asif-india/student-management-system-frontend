// Subject Details page
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import subjectService from '../services/subjectService'
import { ArrowLeft, Edit, Trash2, Users, BookOpen, CheckCircle, XCircle } from 'lucide-react'
import { LoadingState, ErrorState } from '../components/ui'

const SubjectDetails: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: subjectData, isLoading, error } = useQuery({
    queryKey: ['subject', id],
    queryFn: () => subjectService.getSubjectById(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: subjectService.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      navigate('/dashboard/subjects')
    },
  })

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      deleteMutation.mutate(id!)
    }
  }

  const getStatusIcon = (status: string) => {
    return status === 'active' ? <CheckCircle className="w-5 h-5 text-success-text" /> : <XCircle className="w-5 h-5 text-text-tertiary" />
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-success-bg text-success-text' : 'bg-background-tertiary text-text-secondary'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'core':
        return 'bg-accent-muted text-accent-primary'
      case 'elective':
        return 'bg-accent-muted text-accent-primary'
      case 'optional':
        return 'bg-background-tertiary text-text-secondary'
      default:
        return 'bg-background-tertiary text-text-secondary'
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading subject details..." />
  }

  if (error) {
    return <ErrorState message="Failed to load subject details" onRetry={() => window.location.reload()} />
  }

  const subject = subjectData?.data

  if (!subject) {
    return <ErrorState message="Subject not found" onRetry={() => navigate('/dashboard/subjects')} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/subjects')}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Subject Details</h1>
            <p className="text-text-secondary mt-1">View and manage subject information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/subjects/${subject._id}/edit`)}
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

      {/* Subject Info Card */}
      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-accent-muted rounded-full flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-accent-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-primary">{subject.name}</h2>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(subject.status)}`}>
                {subject.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-text-secondary">
              {getStatusIcon(subject.status)}
              <span className="capitalize">{subject.status}</span>
            </div>
            <div className="mt-1 text-sm text-text-tertiary">Code: {subject.code}</div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-tertiary">Grade</p>
              <p className="text-text-primary">{subject.grade}</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Type</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(subject.type)}`}>
                {subject.type}
              </span>
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Credits</p>
              <p className="text-text-primary">{subject.credits}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Description</h3>
          <p className="text-text-secondary">
            {subject.description || 'No description provided'}
          </p>
        </div>

        {/* Assigned Teachers */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Assigned Teachers</h3>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-text-tertiary mt-0.5" />
            <div>
              <p className="text-sm text-text-tertiary">Number of Teachers</p>
              <p className="text-text-primary">{subject.assignedTeachers?.length || 0}</p>
              {subject.assignedTeachers && subject.assignedTeachers.length > 0 && (
                <div className="mt-2 space-y-1">
                  {subject.assignedTeachers.map((teacher) => (
                    <p key={teacher._id} className="text-sm text-text-secondary">
                      {teacher.firstName} {teacher.lastName}
                      {teacher.employeeId && ` (${teacher.employeeId})`}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Timestamps</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-text-tertiary">Created At</p>
              <p className="text-text-primary">{new Date(subject.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Last Updated</p>
              <p className="text-text-primary">{new Date(subject.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubjectDetails
