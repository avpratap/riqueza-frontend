'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { sendOTP, clearError } from '@/store/slices/authSlice'
import { Phone, ArrowRight } from 'lucide-react'

interface MobileLoginFormProps {
  mode: 'login' | 'signup'
  onOTPSent: (phoneNumber: string) => void
  onModeChange: (mode: 'login' | 'signup') => void
  onOpenTerms: () => void
  onOpenPrivacy: () => void
}

const MobileLoginForm = ({ mode, onOTPSent, onModeChange, onOpenTerms, onOpenPrivacy }: MobileLoginFormProps) => {
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state: RootState) => state.auth)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('+91')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phoneNumber.trim()) {
      return
    }

    const fullPhoneNumber = countryCode + phoneNumber.replace(/-/g, '')
    
    // Use Redux to send OTP
    dispatch(sendOTP(fullPhoneNumber) as any)
      .then((result: any) => {
        if (result.type === 'auth/sendOTP/fulfilled') {
          onOTPSent(fullPhoneNumber)
        }
      })
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    
    // Format as XXXX-XXXX-XX for Indian numbers
    if (digits.length <= 10) {
      if (digits.length <= 5) {
        return digits
      } else if (digits.length <= 10) {
        return `${digits.slice(0, 5)}-${digits.slice(5)}`
      }
    }
    
    return digits.slice(0, 10)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
    if (error) {
      dispatch(clearError())
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-yellow-500 bg-clip-text text-transparent">
          {mode === 'login' ? 'Welcome Back' : 'Join Us'}
        </h2>
        <p className="text-gray-600 mt-2">
          {mode === 'login' 
            ? 'Enter your mobile number to continue' 
            : 'Enter your mobile number to get started'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
            </select>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="98765-43210"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={12}
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !phoneNumber.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Send OTP</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Mode Toggle */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
            className="text-blue-600 hover:underline font-medium"
          >
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Switching modes will require a new OTP
        </p>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By continuing, you agree to our{' '}
          <button 
            className="text-blue-600 hover:underline font-medium"
            onClick={onOpenTerms}
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button 
            className="text-blue-600 hover:underline font-medium"
            onClick={onOpenPrivacy}
          >
            Privacy Policy
          </button>
        </p>
      </div>

    </div>
  )
}

export default MobileLoginForm
