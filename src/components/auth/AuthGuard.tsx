'use client'

import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
  showMessage?: boolean
}

const AuthGuard = ({ 
  children, 
  redirectTo = '/', 
  showMessage = true 
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)
  const router = useRouter()

  useEffect(() => {
    // Only redirect if not loading and not authenticated
    if (!isLoading && !isAuthenticated) {
      if (showMessage) {
        toast.error('Please login to access this page')
      }
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo, showMessage])

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default AuthGuard
