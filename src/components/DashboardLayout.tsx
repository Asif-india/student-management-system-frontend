// Main dashboard layout with sidebar and navbar
import React, { useState, useRef, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  CalendarCheck,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Moon,
  Sun,
} from 'lucide-react'
import GlobalSearchResults from './GlobalSearchResults'

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Students', href: '/dashboard/students', icon: Users },
    { name: 'Teachers', href: '/dashboard/teachers', icon: GraduationCap },
    { name: 'Classes', href: '/dashboard/classes', icon: Layers },
    { name: 'Subjects', href: '/dashboard/subjects', icon: BookOpen },
    { name: 'Attendance', href: '/dashboard/attendance', icon: CalendarCheck },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowSearchResults(e.target.value.length >= 2)
  }

  const handleSearchFocus = () => {
    if (searchQuery.length >= 2) {
      setShowSearchResults(true)
    }
  }

  const closeSearchResults = () => {
    setShowSearchResults(false)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-background-secondary">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-surface-primary border-r border-gray-200 dark:border-border-primary shadow-sm dark:shadow-none transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-14 px-6 border-b border-gray-200 dark:border-border-primary">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent-primary rounded-lg flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">SMS</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-background-tertiary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href) && (item.href === '/dashboard' ? location.pathname === '/dashboard' : true)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-accent-muted text-accent-primary font-medium'
                      : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-background-tertiary hover:text-text-primary'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-accent-primary' : 'text-text-tertiary group-hover:text-text-primary transition-colors'}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-200 dark:border-border-primary">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-accent-primary rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {user?.firstName?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 dark:hover:bg-background-tertiary hover:text-text-primary rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-background-secondary">
        {/* Top navbar */}
        <header className="bg-white dark:bg-surface-primary flex-shrink-0 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-border-primary">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-text-secondary hover:text-text-primary p-1 rounded-md hover:bg-background-tertiary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search bar */}
            <div className="flex-1 max-w-lg mx-4" ref={searchRef}>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-tertiary transition-colors group-focus-within:text-accent-primary" />
                <input
                  type="text"
                  placeholder="Search students, teachers, classes, subjects..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-border-primary bg-gray-50 dark:bg-background-tertiary text-text-primary rounded-lg focus:border-accent-primary focus:bg-white dark:focus:bg-surface-primary focus:shadow-lg focus:shadow-accent-primary/5 placeholder-text-tertiary transition-all duration-300 ease-out"
                />
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-primary border border-gray-200 dark:border-border-primary rounded-xl shadow-xl dark:shadow-none z-50">
                    <GlobalSearchResults query={searchQuery} onClose={closeSearchResults} />
                  </div>
                )}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="theme-toggle text-text-secondary hover:text-text-primary p-2 rounded-md hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors"
                title="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              <button className="relative text-text-secondary hover:text-text-primary p-2 rounded-md hover:bg-gray-100 dark:hover:bg-background-tertiary transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-border-primary">
                <div className="w-8 h-8 bg-accent-primary rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-text-primary">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-text-tertiary">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
