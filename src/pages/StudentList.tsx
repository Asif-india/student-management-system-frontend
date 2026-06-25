// Student List page with search, filter, sort, and pagination
import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Filter, ArrowUpDown, Edit, Trash2, Eye, Loader2 } from 'lucide-react'
import { studentService, Student } from '../services/studentService'
import { notifySuccess, notifyError } from '../utils/notifications'
import { LoadingState, ErrorState } from '../components/ui'
import { useDebounce } from '../hooks'

const StudentList: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search to avoid unnecessary API calls
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['students', page, status, sortBy, sortOrder],
    queryFn: () =>
      studentService.getStudents({
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        status: status || undefined,
        sortBy,
        sortOrder,
      }),
  })

  // Refetch when debounced search changes (without causing re-render)
  useEffect(() => {
    refetch()
  }, [debouncedSearch, refetch])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const deleteMutation = useMutation({
    mutationFn: studentService.deleteStudent,
    onSuccess: (response) => {
      notifySuccess(response.message)
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
    onError: (error: any) => {
      notifyError(error.response?.data?.message || 'Failed to delete student')
    },
  })

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      deleteMutation.mutate(id)
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

  // Show LoadingState only on initial load (when there's no data yet)
  if (isLoading && !data) {
    return <LoadingState message="Loading students..." />
  }

  if (error) {
    return <ErrorState message="Failed to load students" onRetry={() => refetch()} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Students</h1>
          <p className="text-text-secondary mt-1">Manage all students in the system</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/students/add')}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors shadow-sm hover:shadow-md transition-all duration-300 ease-out"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary transition-colors group-focus-within:text-accent-primary" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 placeholder-text-tertiary transition-all duration-300 ease-out"
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-accent-primary animate-spin" />
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-secondary rounded-lg hover:bg-white dark:hover:bg-surface-primary hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-border-primary">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value)
                    setPage(1)
                  }}
                  className="px-3 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 transition-all duration-300 ease-out"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-background-secondary border-b border-gray-200 dark:border-border-primary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors"
                  onClick={() => handleSort('firstName')}>
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors"
                  onClick={() => handleSort('email')}>
                  <div className="flex items-center gap-1">
                    Email
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors"
                  onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors"
                  onClick={() => handleSort('enrollmentDate')}>
                  <div className="flex items-center gap-1">
                    Enrollment Date
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-border-primary">
              {data?.data && data.data.length > 0 ? (
                data.data.map((student: Student) => (
                  <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-background-secondary transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-text-primary">
                        {student.firstName} {student.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/students/${student._id}`)}
                          className="p-1 text-text-tertiary hover:text-accent-primary transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/students/${student._id}/edit`)}
                          className="p-1 text-text-tertiary hover:text-accent-primary transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          disabled={deleteMutation.isPending}
                          className="p-1 text-text-tertiary hover:text-error-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-text-secondary text-lg">No students found</p>
                      <p className="text-text-tertiary text-sm mt-1">Get started by adding your first student</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-border-primary flex items-center justify-end">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={data.pagination.page === 1}
                className="px-3 py-2 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-secondary rounded-lg hover:bg-white dark:hover:bg-surface-primary hover:border-gray-300 dark:hover:border-border-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out"
              >
                Previous
              </button>
              <span className="text-sm text-text-secondary">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={data.pagination.page === data.pagination.totalPages}
                className="px-3 py-2 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-secondary rounded-lg hover:bg-white dark:hover:bg-surface-primary hover:border-gray-300 dark:hover:border-border-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentList
