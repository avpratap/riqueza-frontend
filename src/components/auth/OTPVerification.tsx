'use client'

import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { verifyOTP, verifyOTPOnly, clearError, resetOTPState } from '@/store/slices/authSlice'
import { Shield, ArrowLeft, RotateCcw } from 'lucide-react'
import SignupForm from './SignupForm'

interface OTPVerificationProps {
  phoneNumber: string
  mode: 'login' | 'signup'
  onBack: () => void
  onSuccess: () => void
}

const OTPVerification = ({ phoneNumber, mode, onBack, onSuccess }: OTPVerificationProps) => {
  const dispatch = useDispatch()
  const { isLoading, error, verificationId } = useSelector((state: RootState) => state.auth)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [showSignupForm, setShowSignupForm] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (error) {
      dispatch(clearError())
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const otpString = otp.join('')
    if (otpString.length !== 6) return

    // Get the stored verification ID from the global state
    const storedVerificationId = (window as any).currentVerificationId

    // Check if we have a valid verification ID
    if (!storedVerificationId && !verificationId) {
      dispatch(clearError())
      // Show error that user needs to request new OTP
      return
    }

    // Use different verification based on mode
    if (mode === 'signup') {
      // For signup, just verify OTP and show signup form
      dispatch(verifyOTPOnly({
        verificationId: storedVerificationId || verificationId || '',
        otp: otpString,
        phoneNumber
      }) as any).then((result: any) => {
        if (result.type === 'auth/verifyOTPOnly/fulfilled') {
          setShowSignupForm(true)
        }
      })
    } else {
      // For login, verify OTP and create user session
      dispatch(verifyOTP({
        verificationId: storedVerificationId || verificationId || '',
        otp: otpString,
        phoneNumber,
        isSignup: false
      }) as any).then((result: any) => {
        if (result.type === 'auth/verifyOTP/fulfilled') {
          // Trigger cart transfer immediately after successful login
          const guestSessionId = localStorage.getItem('guestSessionId')
          const cartData = localStorage.getItem('cartState')
          
          console.log('🔍 Checking for guest cart:', { 
            hasGuestSessionId: !!guestSessionId, 
            hasCartData: !!cartData,
            guestSessionId: guestSessionId?.substring(0, 20)
          })
          
          if (guestSessionId || (cartData && JSON.parse(cartData).items?.length > 0)) {
            console.log('🔄 Triggering cart transfer after login...')
            
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
            console.log('ℹ️ No guest cart to transfer')
            onSuccess()
          }
        }
      })
    }
  }

  const handleResend = () => {
    // Reset timer and resend OTP
    setTimer(60)
    setCanResend(false)
    setOtp(['', '', '', '', '', ''])
    dispatch(resetOTPState())
    // Here you would call sendOTP again
  }

  const maskPhoneNumber = (phone: string) => {
    if (phone.length > 6) {
      return phone.slice(0, 3) + '****' + phone.slice(-3)
    }
    return phone
  }

  // Show signup form if OTP is verified and we're in signup mode
  if (showSignupForm && mode === 'signup') {
    return (
      <SignupForm
        phoneNumber={phoneNumber}
        verificationId={verificationId || ''}
        otp={otp.join('')}
        onBack={() => setShowSignupForm(false)}
        onSuccess={onSuccess}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-yellow-500 bg-clip-text text-transparent">
          Verify OTP
        </h2>
        <p className="text-gray-600 mt-2">
          We've sent a 6-digit code to
        </p>
        <p className="text-gray-900 font-semibold">
          {maskPhoneNumber(phoneNumber)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
                maxLength={1}
                required
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Number</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">
              {timer > 0 ? `${timer}s` : 'Resend OTP'}
            </span>
            {canResend && (
              <button
                type="button"
                onClick={handleResend}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resend</span>
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            'Verify OTP'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Didn't receive the code? Check your SMS or{' '}
          <button
            onClick={handleResend}
            className="text-blue-600 hover:underline"
            disabled={!canResend}
          >
            request a new one
          </button>
        </p>
      </div>
    </div>
  )
}

export default OTPVerification
