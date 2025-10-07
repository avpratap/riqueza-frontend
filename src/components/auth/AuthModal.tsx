'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { resetOTPState, transferGuestCart } from '@/store/slices/authSlice'
import { setAuthModalMode } from '@/store/slices/uiSlice'
import { X } from 'lucide-react'
import MobileLoginForm from './MobileLoginForm'
import OTPVerification from './OTPVerification'
import AuthTermsModal from '@/components/modals/AuthTermsModal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'login' | 'signup'
}

const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [currentStep, setCurrentStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const { authModalMode } = useSelector((state: RootState) => state.ui)
  
  // Use the mode from Redux state
  const mode = authModalMode

  // Close modal when user is authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onClose()
    }
  }, [isAuthenticated, isOpen, onClose])

  if (!isOpen) {
    return null
  }

  const handleOTPSent = (phone: string) => {
    setPhoneNumber(phone)
    setCurrentStep('otp')
  }

  const handleOTPSuccess = () => {
    onClose()
    setCurrentStep('phone')
    setPhoneNumber('')
    // Reset to default mode
    dispatch(setAuthModalMode(defaultMode))
    
    // Check if cart transfer is needed after successful login
    setTimeout(() => {
      const cartData = localStorage.getItem('cartState')
      
      if (cartData) {
        try {
          const parsed = JSON.parse(cartData)
          if (parsed.items && parsed.items.length > 0) {
            console.log('🔄 Cart items detected after login, transferring...')
            console.log(`📊 Found ${parsed.items.length} items in localStorage`)
            dispatch(transferGuestCart())
          } else {
            console.log('ℹ️ No cart items to transfer')
          }
        } catch (error) {
          console.error('❌ Error checking cart for transfer:', error)
        }
      } else {
        console.log('ℹ️ No cart data found in localStorage')
      }
    }, 2000) // Wait 2 seconds for auth state to be established
  }

  const handleBack = () => {
    setCurrentStep('phone')
  }

  const handleModeChange = (newMode: 'login' | 'signup') => {
    dispatch(setAuthModalMode(newMode))
    setCurrentStep('phone')
    setPhoneNumber('')
    // Reset OTP state when switching modes - user needs to request new OTP
    dispatch(resetOTPState())
    // Clear the global verification ID
    if (typeof window !== 'undefined') {
      (window as any).currentVerificationId = null
    }
  }

  return (
    <div 
      className="fixed inset-0 z-[99999] overflow-y-auto"
      style={{ zIndex: 99999 }}
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop with smooth animation */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 z-[99998]"
          style={{ zIndex: 99998 }}
          onClick={onClose}
        />
        
        {/* Modal with smooth slide-down animation from top to center */}
        <div 
          className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 ease-out w-full max-w-md mx-auto animate-slide-down z-[99999]"
          style={{ zIndex: 99999 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {currentStep === 'phone' ? (
              <MobileLoginForm 
                mode={mode}
                onOTPSent={handleOTPSent}
                onModeChange={handleModeChange}
                onOpenTerms={() => setIsTermsModalOpen(true)}
                onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
              />
            ) : (
              <OTPVerification 
                phoneNumber={phoneNumber}
                mode={mode}
                onBack={handleBack}
                onSuccess={handleOTPSuccess}
              />
            )}
          </div>
        </div>
      </div>

      {/* Terms and Privacy Policy Modals - Outside the login modal */}
      <AuthTermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        type="terms"
      />

      <AuthTermsModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        type="privacy"
      />
    </div>
  )
}

export default AuthModal
