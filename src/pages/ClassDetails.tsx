// Class Details page
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import classService from '../services/classService'
import { ArrowLeft, Edit, Trash2, Users, BookOpen, User, CheckCircle, XCircle, Archive } from 'lucide-react'
import { LoadingState, ErrorState } from '../components/ui'

const ClassDetails: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: classData, isLoading, error } = useQuery({
    queryKey: ['class', id],
    queryFn: () => classService.getClassById(id!),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: classService.deleteClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      navigate('/dashboard/classes')
    },
  })

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      deleteMutation.mutate(id!)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-success-text" />
      case 'inactive':
        return <XCircle className="w-5 h-5 text-text-tertiary" />
      case 'archived':
        return <Archive className="w-5 h-5 text-warning-text" />
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
      case 'archived':
        return 'bg-warning-bg text-warning-text'
      default:
        return 'bg-background-tertiary text-text-secondary'
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading class details..." />
  }

  if (error) {
    return <ErrorState message="Failed to load class details" onRetry={() => window.location.reload()} />
  }

  const classItem = classData?.data

  if (!classItem) {
    return <ErrorState message="Class not found" onRetry={() => navigate('/dashboard/classes')} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/classes')}
            className="p-2 hover:bg-background-tertiary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Class Details</h1>
            <p className="text-text-secondary mt-1">View and manage class information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/classes/${classItem._id}/edit`)}
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

      {/* Class Info Card */}
      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-accent-muted rounded-full flex items-center justify-center">
            <Users className="w-10 h-10 text-accent-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-text-primary">{classItem.name}</h2>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(classItem.status)}`}>
                {classItem.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-text-secondary">
              {getStatusIcon(classItem.status)}
              <span className="capitalize">{classItem.status}</span>
            </div>
            <div className="mt-1 text-sm text-text-tertiary">Code: {classItem.code}</div>
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
              <p className="text-text-primary">{classItem.grade}</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Section</p>
              <p className="text-text-primary">{classItem.section}</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Academic Year</p>
              <p className="text-text-primary">{classItem.academicYear}</p>
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Capacity</p>
              <p className="text-text-primary">{classItem.capacity} students</p>
            </div>
          </div>
        </div>

        {/* Class Teacher */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Class Teacher</h3>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-text-tertiary mt-0.5" />
            <div>
              <p className="text-sm text-text-tertiary">Assigned Teacher</p>
              <p className="text-text-primary">
                {classItem.classTeacher
                  ? `${classItem.classTeacher.firstName} ${classItem.classTeacher.lastName}`
                  : 'Not assigned'}
              </p>
              {classItem.classTeacher?.employeeId && (
                <p className="text-sm text-text-secondary mt-1">ID: {classItem.classTeacher.employeeId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Students */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Students</h3>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-text-tertiary mt-0.5" />
            <div>
              <p className="text-sm text-text-tertiary">Enrolled Students</p>
              <p className="text-text-primary">
                {classItem.students?.length || 0} / {classItem.capacity}
              </p>
              {classItem.students && classItem.students.length > 0 && (
                <div className="mt-2 space-y-1">
                  {classItem.students.slice(0, 5).map((student) => (
                    <p key={student._id} className="text-sm text-text-secondary">
                      {student.firstName} {student.lastName}
                    </p>
                  ))}
                  {classItem.students.length > 5 && (
                    <p className="text-sm text-text-tertiary">+{classItem.students.length - 5} more</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Subjects</h3>
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-text-tertiary mt-0.5" />
            <div>
              <p className="text-sm text-text-tertiary">Assigned Subjects</p>
              <p className="text-text-primary">{classItem.subjects?.length || 0} subjects</p>
              {classItem.subjects && classItem.subjects.length > 0 && (
                <div className="mt-2 space-y-1">
                  {classItem.subjects.map((subject) => (
                    <p key={subject._id} className="text-sm text-text-secondary">
                      {subject.name} ({subject.code})
                    </p>
                  ))}
                </div>
              )}
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
            <p className="text-text-primary">{new Date(classItem.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-text-tertiary">Last Updated</p>
            <p className="text-text-primary">{new Date(classItem.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassDetails
