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
  const [isFocused, setIsFocused] = useState(false)
  const countryCode = '+91' // Fixed country code for India

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Remove dashes and check if we have exactly 10 digits
    const digitsOnly = phoneNumber.replace(/-/g, '')
    
    if (!digitsOnly.trim() || digitsOnly.length !== 10) {
      return
    }

    const fullPhoneNumber = countryCode + digitsOnly
    
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
    
    // Format as XXXXX-XXXXX for Indian numbers (10 digits)
    if (digits.length === 0) {
      return ''
    } else if (digits.length <= 5) {
      return digits
    } else if (digits.length <= 10) {
      return `${digits.slice(0, 5)}-${digits.slice(5, 10)}`
    }
    
    // Limit to 10 digits
    return `${digits.slice(0, 5)}-${digits.slice(5, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const formatted = formatPhoneNumber(inputValue)
    setPhoneNumber(formatted)
    if (error) {
      dispatch(clearError())
    }
  }

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and arrow keys
    if ([8, 9, 27, 13, 46, 37, 38, 39, 40].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true)) {
      return
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  return (
    <div className="w-full">
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
          <div 
            className={`flex items-center border rounded-lg transition-all duration-200 ${
              isFocused 
                ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' 
                : 'border-gray-300'
            }`}
          >
            <div className="px-3 py-3 bg-gray-50 text-gray-700 font-medium border-r border-gray-300 rounded-l-lg">
              🇮🇳 +91
            </div>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9-]*"
              value={phoneNumber}
              onChange={handlePhoneChange}
              onKeyDown={handlePhoneKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="98765-43210"
              className="flex-1 px-4 py-3 border-0 focus:outline-none bg-transparent"
              maxLength={11}
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
          disabled={isLoading || phoneNumber.replace(/-/g, '').length !== 10}
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
