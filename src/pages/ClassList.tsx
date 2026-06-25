// Class List page
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import classService from '../services/classService'
import { notifySuccess, notifyError } from '../utils/notifications'
import { Search, Plus, Eye, Edit, Trash2, Users, BookOpen, Filter, ChevronDown, Layers, Loader2 } from 'lucide-react'
import { LoadingState, ErrorState } from '../components/ui'
import { useDebounce } from '../hooks'

const ClassList: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [academicYearFilter, setAcademicYearFilter] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search to avoid unnecessary API calls
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['classes', page, limit, statusFilter, gradeFilter, academicYearFilter, sortBy, sortOrder],
    queryFn: () =>
      classService.getAllClasses({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: statusFilter || undefined,
        grade: gradeFilter || undefined,
        academicYear: academicYearFilter || undefined,
        sortBy,
        sortOrder,
      })
  })

  // Refetch when debounced search changes (without causing re-render)
  useEffect(() => {
    refetch()
  }, [debouncedSearch, refetch])

  const deleteMutation = useMutation({
    mutationFn: classService.deleteClass,
    onSuccess: (response) => {
      notifySuccess(response.message)
      queryClient.invalidateQueries({ queryKey: ['classes'] })
    },
    onError: (error: any) => {
      notifyError(error.response?.data?.message || 'Failed to delete class')
    },
  })

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  // Show LoadingState only on initial load (when there's no data yet)
  if (isLoading && !data) {
    return <LoadingState message="Loading classes..." />
  }

  if (error) {
    return <ErrorState message="Failed to load classes" onRetry={() => window.location.reload()} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Classes</h1>
          <p className="text-text-secondary mt-1">Manage your school classes</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/classes/add')}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors shadow-sm hover:shadow-md transition-all duration-300 ease-out"
        >
          <Plus className="w-4 h-4" />
          Add Class
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary p-4 hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary transition-colors group-focus-within:text-accent-primary" />
            <input
              type="text"
              placeholder="Search by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 placeholder-text-tertiary transition-all duration-300 ease-out"
            />
            {isFetching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-primary animate-spin" />
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-secondary rounded-lg hover:bg-white dark:hover:bg-surface-primary hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-border-primary">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 transition-all duration-300 ease-out"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Grade</label>
                <input
                  type="text"
                  placeholder="e.g., 10, 11, 12"
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 placeholder-text-tertiary transition-all duration-300 ease-out"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Academic Year</label>
                <input
                  type="text"
                  placeholder="e.g., 2024-2025"
                  value={academicYearFilter}
                  onChange={(e) => setAcademicYearFilter(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 placeholder-text-tertiary transition-all duration-300 ease-out"
                />
              </div>
            </div>
          )}
      </div>

      {/* Classes Table */}
      <div className="bg-white dark:bg-surface-primary rounded-xl shadow-sm dark:shadow-none border border-gray-200 dark:border-border-primary overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-border-secondary transition-all duration-300 ease-out">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-background-secondary border-b border-gray-200 dark:border-border-primary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors" onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors" onClick={() => handleSort('code')}>
                  Code {sortBy === 'code' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors" onClick={() => handleSort('grade')}>
                  Grade {sortBy === 'grade' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors" onClick={() => handleSort('section')}>
                  Section {sortBy === 'section' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">Class Teacher</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">Subjects</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors" onClick={() => handleSort('status')}>
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-text-tertiary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-border-primary">
              {data?.data && data.data.length > 0 ? (
                data.data.map((classItem: any) => (
                  <tr key={classItem._id} className="hover:bg-gray-50 dark:hover:bg-background-secondary transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-text-primary">{classItem.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{classItem.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{classItem.grade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{classItem.section}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                      {classItem.classTeacher
                        ? `${classItem.classTeacher.firstName} ${classItem.classTeacher.lastName}`
                        : 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Users className="w-4 h-4" />
                        {classItem.students?.length || 0} / {classItem.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-text-secondary">
                        <BookOpen className="w-4 h-4" />
                        {classItem.subjects?.length || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${classItem.status === 'active' ? 'bg-success-bg text-success-text' :
                        classItem.status === 'inactive' ? 'bg-background-tertiary text-text-secondary' :
                          'bg-warning-bg text-warning-text'
                        }`}>
                        {classItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/classes/${classItem._id}`)}
                          className="p-1 text-accent-primary hover:bg-accent-muted rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/dashboard/classes/${classItem._id}/edit`)}
                          className="p-1 text-text-secondary hover:bg-background-tertiary rounded transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(classItem._id)}
                          disabled={deleteMutation.isPending}
                          className="p-1 text-error-text hover:bg-error-bg rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Layers className="w-12 h-12 text-text-muted mb-4" />
                      <p className="text-text-secondary text-lg">No classes found</p>
                      <p className="text-text-tertiary text-sm mt-1">Get started by adding your first class</p>
                      <button
                        onClick={() => navigate('/dashboard/classes/add')}
                        className="mt-4 px-4 py-2.5 bg-accent-primary text-white rounded-lg hover:bg-accent-hover transition-colors shadow-sm hover:shadow-md transition-all duration-300 ease-out"
                      >
                        Add Class
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {/* {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-primary">
            <div className="text-sm text-text-secondary">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.pagination.total)} of {data.pagination.total} classes
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-border-primary bg-background-tertiary text-text-secondary rounded hover:bg-background-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </button>
              <span className="text-sm text-text-secondary">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="px-3 py-1 border border-border-primary bg-background-tertiary text-text-secondary rounded hover:bg-background-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </button>
            </div>
          </div>
        )} */}

        {/* Pagination & Record Summary */}
        {data?.pagination && (
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-border-primary">
            {data.pagination.totalPages > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-secondary rounded-lg hover:bg-white dark:hover:bg-surface-primary hover:border-gray-300 dark:hover:border-border-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out"
                >
                  Previous
                </button>

                <span className="text-sm text-text-secondary">
                  Page {page} of {data.pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                  className="px-3 py-2 border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-secondary rounded-lg hover:bg-white dark:hover:bg-surface-primary hover:border-gray-300 dark:hover:border-border-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-out"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ClassList
