// Add Subject form with validation
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import subjectService from '../services/subjectService'
import { notifySuccess, notifyError } from '../utils/notifications'
import { ArrowLeft, Save } from 'lucide-react'

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name must be at least 2 characters').max(100, 'Subject name cannot exceed 100 characters'),
  code: z.string().min(1, 'Subject code is required').max(20, 'Subject code cannot exceed 20 characters'),
  description: z.string().optional(),
  credits: z.number().min(1, 'Credits must be at least 1').max(10, 'Credits cannot exceed 10'),
  type: z.enum(['core', 'elective', 'optional']).optional(),
  grade: z.string().min(1, 'Grade is required'),
  status: z.enum(['active', 'inactive']).optional(),
})

type SubjectFormData = z.infer<typeof subjectSchema>

const AddSubject: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      type: 'core',
      status: 'active',
      credits: 1,
    },
  })

  const mutation = useMutation({
    mutationFn: subjectService.createSubject,
    onSuccess: (response) => {
      notifySuccess(response.message)
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      navigate('/dashboard/subjects')
    },
    onError: (error: any) => {
      notifyError(error.response?.data?.message || 'Failed to create subject')
    },
  })

  const onSubmit = (data: SubjectFormData) => {
    mutation.mutate(data)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/subjects')}
          className="p-2 hover:bg-background-tertiary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Add New Subject</h1>
          <p className="text-text-secondary mt-1">Fill in the subject information below</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name and Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Subject Name <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                placeholder="Mathematics"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-error-text">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Subject Code <span className="text-error-text">*</span>
              </label>
              <input
                type="text"
                {...register('code')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                placeholder="MATH"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-error-text">{errors.code.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
              placeholder="Brief description of the subject"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-error-text">{errors.description.message}</p>
            )}
          </div>

          {/* Grade and Credits */}
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
                Credits <span className="text-error-text">*</span>
              </label>
              <input
                type="number"
                {...register('credits', { valueAsNumber: true })}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                placeholder="1"
              />
              {errors.credits && (
                <p className="mt-1 text-sm text-error-text">{errors.credits.message}</p>
              )}
            </div>
          </div>

          {/* Type and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
              >
                <option value="core">Core</option>
                <option value="elective">Elective</option>
                <option value="optional">Optional</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-error-text">{errors.type.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-error-text">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={() => navigate('/dashboard/subjects')}
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
              {isSubmitting || mutation.isPending ? 'Saving...' : 'Save Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddSubject
