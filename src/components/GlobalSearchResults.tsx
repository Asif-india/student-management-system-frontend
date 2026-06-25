// Global Search Results Component
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import searchService, { SearchResult } from '../services/searchService'
import { User, GraduationCap, Layers, BookOpen, Search } from 'lucide-react'
import { LoadingState } from './ui'

interface GlobalSearchResultsProps {
  query: string
  onClose: () => void
}

const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = ({ query, onClose }) => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['global-search', query],
    queryFn: () => searchService.globalSearch({ q: query, limit: 20 }),
    enabled: query.length >= 2,
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
        return <User className="w-4 h-4" />
      case 'teacher':
        return <GraduationCap className="w-4 h-4" />
      case 'class':
        return <Layers className="w-4 h-4" />
      case 'subject':
        return <BookOpen className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'teacher':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'class':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'subject':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url)
    onClose()
  }

  if (query.length < 2) {
    return (
      <div className="p-4 text-center text-text-tertiary text-sm">
        Enter at least 2 characters to search
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingState message="Searching..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-center text-error-text text-sm">
        Failed to search. Please try again.
      </div>
    )
  }

  if (!data?.data || data.data.results.length === 0) {
    return (
      <div className="p-4 text-center text-text-tertiary text-sm">
        No results found for "{query}"
      </div>
    )
  }

  const { results, byType } = data.data

  const filteredResults = selectedType
    ? results.filter((r: SearchResult) => r.type === selectedType)
    : results

  return (
    <div className="max-h-96 overflow-y-auto">
      {/* Type Filters */}
      <div className="flex items-center gap-2 p-3 border-b border-border-primary">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            !selectedType
              ? 'bg-accent-primary text-white'
              : 'bg-background-tertiary text-text-secondary hover:bg-background-secondary'
          }`}
        >
          All ({results.length})
        </button>
        <button
          onClick={() => setSelectedType('student')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            selectedType === 'student'
              ? 'bg-accent-primary text-white'
              : 'bg-background-tertiary text-text-secondary hover:bg-background-secondary'
          }`}
        >
          Students ({byType.student})
        </button>
        <button
          onClick={() => setSelectedType('teacher')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            selectedType === 'teacher'
              ? 'bg-accent-primary text-white'
              : 'bg-background-tertiary text-text-secondary hover:bg-background-secondary'
          }`}
        >
          Teachers ({byType.teacher})
        </button>
        <button
          onClick={() => setSelectedType('class')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            selectedType === 'class'
              ? 'bg-accent-primary text-white'
              : 'bg-background-tertiary text-text-secondary hover:bg-background-secondary'
          }`}
        >
          Classes ({byType.class})
        </button>
        <button
          onClick={() => setSelectedType('subject')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            selectedType === 'subject'
              ? 'bg-accent-primary text-white'
              : 'bg-background-tertiary text-text-secondary hover:bg-background-secondary'
          }`}
        >
          Subjects ({byType.subject})
        </button>
      </div>

      {/* Results List */}
      <div className="divide-y divide-border-primary">
        {filteredResults.map((result: SearchResult) => (
          <button
            key={`${result.type}-${result.id}`}
            onClick={() => handleResultClick(result)}
            className="w-full p-3 flex items-start gap-3 hover:bg-background-secondary transition-colors text-left"
          >
            <div className={`p-2 rounded-lg ${getTypeColor(result.type)} flex-shrink-0`}>
              {getTypeIcon(result.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-text-primary truncate">
                {result.title}
              </div>
              <div className="text-xs text-text-secondary truncate mt-0.5">
                {result.subtitle}
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getTypeColor(result.type)}`}>
                {result.type}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filteredResults.length === 0 && selectedType && (
        <div className="p-4 text-center text-text-tertiary text-sm">
          No {selectedType} results found for "{query}"
        </div>
      )}
    </div>
  )
}

export default GlobalSearchResults
