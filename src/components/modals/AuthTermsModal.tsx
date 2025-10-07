'use client'

import { X } from 'lucide-react'

interface AuthTermsModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'terms' | 'privacy'
}

const AuthTermsModal = ({ isOpen, onClose, type }: AuthTermsModalProps) => {
  if (!isOpen) return null

  const isTerms = type === 'terms'

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-[999999] overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col mx-2 sm:mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {isTerms ? 'Terms of Service' : 'Privacy Policy'}
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 sm:w-8 sm:h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
          >
            <X size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 min-h-0 custom-scrollbar pb-4 sm:pb-8">
            {isTerms ? (
              <>
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Terms of Service</h3>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-3 sm:mb-4 break-words">
                    Welcome to Riqueza Electric. These Terms of Service ("Terms") govern your use of our website, mobile application, and services (collectively, the "Service") operated by Riqueza Electric ("us", "we", or "our").
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">1. Acceptance of Terms</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    By accessing and using our Service, you accept and agree to be bound by the terms and provision of this agreement.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">2. Use License</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    Permission is granted to temporarily download one copy of the materials on Riqueza Electric's website for personal, non-commercial transitory viewing only.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">3. User Accounts</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">4. Prohibited Uses</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    You may not use our Service for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">5. Privacy Policy</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">6. Contact Information</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed break-words">
                    If you have any questions about these Terms of Service, please contact us at support@requezaelectric.com
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Privacy Policy</h3>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-3 sm:mb-4 break-words">
                    This Privacy Policy describes how Riqueza Electric ("we", "us", or "our") collects, uses, and shares your personal information when you use our website, mobile application, and services.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">1. Information We Collect</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, and payment information.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">2. How We Use Your Information</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products and services.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">3. Information Sharing</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy or as required by law.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">4. Data Security</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">5. Your Rights</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed mb-2 sm:mb-3 break-words">
                    You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us at any time.
                  </p>
                </div>

                <div className="mb-4 sm:mb-6">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">6. Contact Us</h4>
                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed break-words">
                    If you have any questions about this Privacy Policy, please contact us at privacy@requezaelectric.com
                  </p>
                </div>
              </>
            )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-end">
            <button
              onClick={onClose}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthTermsModal
