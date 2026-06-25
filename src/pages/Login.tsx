// Login page with form validation
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, loading, error, clearError } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  useEffect(() => {
    return () => {
      clearError()
    }
  }, [clearError])

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password)
    } catch (error) {
      // Error is handled by the auth context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-secondary px-4">
      <div className="max-w-md w-full">
        <div className="bg-surface-primary rounded-2xl shadow-xl p-8 border border-border-primary">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary rounded-full mb-4 shadow-sm">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary">Welcome Back</h1>
            <p className="text-text-secondary mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error-bg border border-error-border rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-error-text flex-shrink-0 mt-0.5" />
              <p className="text-sm text-error-text">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-text-tertiary" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="block w-full pl-10 pr-3 py-3 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-error-text">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-tertiary" />
                </div>
                <input
                  {...register('password')}
                  type="password"
                  id="password"
                  className="block w-full pl-10 pr-3 py-3 border border-border-primary bg-background-tertiary text-text-primary rounded-lg focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-all duration-200 placeholder-text-tertiary"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-text">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full bg-accent-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-accent-hover focus:ring-4 focus:ring-accent-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              {loading || isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <button className="text-accent-primary hover:text-accent-hover font-medium transition-colors">
                Contact administrator
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-text-tertiary">
          © 2024 Student Management System. All rights reserved.
        </p>
      </div>
    </div>
  )
}

export default Login
