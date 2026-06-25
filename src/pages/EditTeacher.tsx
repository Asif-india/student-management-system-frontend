// Edit Teacher form with validation
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherService, UpdateTeacherData } from '../services/teacherService'
import { notifySuccess, notifyError } from '../utils/notifications'
import { ArrowLeft, Save } from 'lucide-react'
import { LoadingState, ErrorState } from '../components/ui'

const teacherSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name cannot exceed 50 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name cannot exceed 50 characters').optional(),
  email: z.string().email('Please provide a valid email').optional(),
  phone: z.string().regex(/^[\d\s-()+]+$/, 'Please provide a valid phone number').optional().or(z.literal('')),
  dateOfBirth: z.string().optional(),
  department: z.string().optional(),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on-leave']).optional(),
})

type TeacherFormData = z.infer<typeof teacherSchema>

const EditTeacher: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()

  const { data: teacherData, isLoading, error } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherService.getTeacherById(id!),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
  })

  useEffect(() => {
    if (teacherData?.data) {
      reset({
        firstName: teacherData.data.firstName,
        lastName: teacherData.data.lastName,
        email: teacherData.data.email,
        phone: teacherData.data.phone || '',
        dateOfBirth: teacherData.data.dateOfBirth ? new Date(teacherData.data.dateOfBirth).toISOString().split('T')[0] : '',
        department: teacherData.data.department || '',
        qualification: teacherData.data.qualification || '',
        specialization: teacherData.data.specialization || '',
        status: teacherData.data.status,
      })
    }
  }, [teacherData, reset])

  const mutation = useMutation({
    mutationFn: (data: { id: string; teacherData: UpdateTeacherData }) =>
      teacherService.updateTeacher(data.id, data.teacherData),
    onSuccess: (response) => {
      notifySuccess(response.message)
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      queryClient.invalidateQueries({ queryKey: ['teacher', id] })
      navigate(`/dashboard/teachers`)
    },
    onError: (error: any) => {
      notifyError(error.response?.data?.message || 'Failed to update teacher')
    },
  })

  const onSubmit = (data: TeacherFormData) => {
    const formattedData: UpdateTeacherData = {
      ...data,
      phone: data.phone || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
    }
    mutation.mutate({ id: id!, teacherData: formattedData })
  }

  if (isLoading) {
    return <LoadingState message="Loading teacher data..." />
  }

  if (error) {
    return <ErrorState message="Failed to load teacher data" onRetry={() => window.location.reload()} />
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/dashboard/teachers/${id}`)}
          className="p-2 hover:bg-background-tertiary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Edit Teacher</h1>
          <p className="text-text-secondary mt-1">Update teacher information</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-error-text">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-error-text">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error-text">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Phone</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
              placeholder="+1 (555) 123-4567"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-error-text">{errors.phone.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Date of Birth</label>
            <input
              type="date"
              {...register('dateOfBirth')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-error-text">{errors.dateOfBirth.message}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Department</label>
            <input
              type="text"
              {...register('department')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
              placeholder="Science"
            />
            {errors.department && (
              <p className="mt-1 text-sm text-error-text">{errors.department.message}</p>
            )}
          </div>

          {/* Qualification */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Qualification</label>
            <input
              type="text"
              {...register('qualification')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
              placeholder="M.Sc., Ph.D."
            />
            {errors.qualification && (
              <p className="mt-1 text-sm text-error-text">{errors.qualification.message}</p>
            )}
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Specialization</label>
            <input
              type="text"
              {...register('specialization')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
              placeholder="Physics"
            />
            {errors.specialization && (
              <p className="mt-1 text-sm text-error-text">{errors.specialization.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-error-text">{errors.status.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/teachers/${id}`)}
              className="px-4 py-2 border border-border-primary bg-background-tertiary text-text-secondary rounded-lg hover:bg-background-secondary transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || mutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Save className="w-4 h-4" />
              {isSubmitting || mutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTeacher
