// Add Teacher form with validation
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherService } from '../services/teacherService'
import { notifySuccess, notifyError } from '../utils/notifications'
import { ArrowLeft, Save } from 'lucide-react'

const teacherSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name cannot exceed 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name cannot exceed 50 characters'),
  email: z.string().email('Please provide a valid email'),
  phone: z.string().regex(/^[\d\s-()+]+$/, 'Please provide a valid phone number').optional().or(z.literal('')),
  dateOfBirth: z.string().optional(),
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().optional(),
  qualification: z.string().optional(),
  specialization: z.string().optional(),
  hireDate: z.string().min(1, 'Hire date is required'),
  status: z.enum(['active', 'inactive', 'on-leave']).optional(),
})

type TeacherFormData = z.infer<typeof teacherSchema>

const AddTeacher: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0],
    },
  })

  const mutation = useMutation({
    mutationFn: teacherService.createTeacher,
    onSuccess: (response) => {
      notifySuccess(response.message)
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      navigate('/dashboard/teachers')
    },
    onError: (error: any) => {
      notifyError(error.response?.data?.message || 'Failed to create teacher')
    },
  })

  const onSubmit = (data: TeacherFormData) => {
    const formattedData = {
      ...data,
      phone: data.phone || undefined,
      dateOfBirth: data.dateOfBirth || undefined,
      assignedClasses: [],
      assignedSubjects: [],
    }
    mutation.mutate(formattedData)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/teachers')}
          className="p-2 hover:bg-background-tertiary rounded-lg transition-colors text-text-secondary hover:text-text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Add New Teacher</h1>
          <p className="text-text-secondary mt-1">Fill in the teacher information below</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-surface-primary rounded-xl shadow-sm border border-border-primary p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                First Name <span className="text-error-text">*</span>
              </label>
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
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Last Name <span className="text-error-text">*</span>
              </label>
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
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Email <span className="text-error-text">*</span>
            </label>
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

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Employee ID <span className="text-error-text">*</span>
            </label>
            <input
              type="text"
              {...register('employeeId')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
              placeholder="EMP001"
            />
            {errors.employeeId && (
              <p className="mt-1 text-sm text-error-text">{errors.employeeId.message}</p>
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

          {/* Hire Date */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Hire Date <span className="text-error-text">*</span>
            </label>
            <input
              type="date"
              {...register('hireDate')}
              className="w-full px-3 py-2 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200"
            />
            {errors.hireDate && (
              <p className="mt-1 text-sm text-error-text">{errors.hireDate.message}</p>
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
              onClick={() => navigate('/teachers')}
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
              {isSubmitting || mutation.isPending ? 'Saving...' : 'Save Teacher'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddTeacher
