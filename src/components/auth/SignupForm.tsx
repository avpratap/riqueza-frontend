'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { login } from '@/store/slices/authSlice'
import { ArrowLeft, User, Mail } from 'lucide-react'

interface SignupFormProps {
  phoneNumber: string
  verificationId: string
  otp: string
  onBack: () => void
  onSuccess: () => void
}

const SignupForm = ({ phoneNumber, verificationId, otp, onBack, onSuccess }: SignupFormProps) => {
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setLocalError('Name is required')
      return
    }

    try {
      // Get the stored verification ID from the global state
      const storedVerificationId = (window as any).currentVerificationId

      // Check if we have a valid verification ID
      if (!storedVerificationId && !verificationId) {
        setLocalError('Verification ID not found. Please request a new OTP.')
        return
      }

      // Call backend signup API
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          name: name.trim(),
          email: email.trim() || undefined,
          otp: otp,
          verificationId: storedVerificationId || verificationId
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        setLocalError(data.error || 'Failed to create account')
        return
      }

      // Login the user with backend data
      dispatch(login({ user: data.user, token: data.token }))
      
      // Trigger cart transfer immediately after successful signup
      const guestSessionId = localStorage.getItem('guestSessionId')
      const cartDataStr = localStorage.getItem('cartState')
      
      console.log('🔍 Checking for guest cart after signup:', { 
        hasGuestSessionId: !!guestSessionId, 
        hasCartData: !!cartDataStr,
        guestSessionId: guestSessionId?.substring(0, 20)
      })
      
      if (guestSessionId || (cartDataStr && JSON.parse(cartDataStr).items?.length > 0)) {
        console.log('🔄 Triggering cart transfer after signup...')
        
        // Import and dispatch cart transfer
        import('@/store/slices/authSlice').then((authModule) => {
          dispatch(authModule.transferGuestCart() as any).then((transferResult: any) => {
            console.log('✅ Cart transfer result:', transferResult)
            
            // Close modal first
            onSuccess()
            
            // Then reload page after a delay
            setTimeout(() => {
              console.log('🔄 Reloading page to show merged cart...')
              window.location.reload()
            }, 1000)
          }).catch((error: any) => {
            console.error('❌ Cart transfer failed:', error)
            onSuccess()
          })
        }).catch((error: any) => {
          console.error('❌ Failed to load transfer module:', error)
          onSuccess()
        })
      } else {
        console.log('ℹ️ No guest cart to transfer after signup')
        onSuccess()
      }
    } catch (error: any) {
      setLocalError(error.message || 'Failed to create account')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mt-2">Just a few more details to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address (Optional)
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm">
            <strong>Phone:</strong> {phoneNumber}
          </p>
        </div>

        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error || localError}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center whitespace-nowrap"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign Up'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignupForm
