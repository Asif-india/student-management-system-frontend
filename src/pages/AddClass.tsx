// Add Class form with validation
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import classService from '../services/classService'
import { notifySuccess, notifyError } from '../utils/notifications'
import { ArrowLeft, Save } from 'lucide-react'

const classSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters').max(100, 'Class name cannot exceed 100 characters'),
  code: z.string().min(1, 'Class code is required').max(20, 'Class code cannot exceed 20 characters'),
  grade: z.string().min(1, 'Grade is required'),
  section: z.string().min(1, 'Section is required'),
  academicYear: z.string().min(1, 'Academic year is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1').max(100, 'Capacity cannot exceed 100'),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
})

type ClassFormData = z.infer<typeof classSchema>

const AddClass: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      status: 'active',
      capacity: 30,
    },
  })

  const mutation = useMutation({
    mutationFn: classService.createClass,
    onSuccess: (response) => {
      notifySuccess(response.message)
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      navigate('/dashboard/classes')
    },
    onError: (error: any) => {
      notifyError(error.response?.data?.message || 'Failed to create class')
    },
  })

  const onSubmit = (data: ClassFormData) => {
    mutation.mutate(data)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/classes')}
          className="p-2 hover:bg-background-tertiary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Add New Class</h1>
          <p className="text-text-secondary mt-1">Fill in the class information below</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name and Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Class Name <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                placeholder="Class 10"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-text">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Class Code <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                {...register('code')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                placeholder="CL10"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-error-text">{errors.code.message}</p>
              )}
            </div>
          </div>

          {/* Grade and Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Grade <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                {...register('grade')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                placeholder="10"
              />
              {errors.grade && (
                <p className="mt-1 text-sm text-error-text">{errors.grade.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Section <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                {...register('section')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                placeholder="A"
              />
              {errors.section && (
                <p className="mt-1 text-sm text-error-text">{errors.section.message}</p>
              )}
            </div>
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Academic Year <span className="text-error-text">*</span>
            </label>
            <input
              type="text"
              {...register('academicYear')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
              placeholder="2024-2025"
            />
            {errors.academicYear && (
              <p className="mt-1 text-sm text-error-text">{errors.academicYear.message}</p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Capacity <span className="text-error-text">*</span>
            </label>
            <input
              type="number"
              {...register('capacity', { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
              placeholder="30"
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-error-text">{errors.capacity.message}</p>
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
              <option value="archived">Archived</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-error-text">{errors.status.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={() => navigate('/dashboard/classes')}
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
              {isSubmitting || mutation.isPending ? 'Saving...' : 'Save Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddClass
