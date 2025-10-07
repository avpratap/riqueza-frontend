'use client'

import { useState } from 'react'
import { ChevronRight, Leaf } from 'lucide-react'
import PdfModal from './PdfModal'

interface ExtendedWarrantyModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: () => void
  onRemove: () => void
  onContinue: () => void
  isAdded: boolean
}

const ExtendedWarrantyModal = ({ isOpen, onClose, onAdd, onRemove, onContinue, isAdded }: ExtendedWarrantyModalProps) => {
  const [selectedPlan, setSelectedPlan] = useState('100k')
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false)
  const [isWarrantyTermsModalOpen, setIsWarrantyTermsModalOpen] = useState(false)
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false)

  const warrantyPlans = [
    {
      id: '125k',
      kms: '1,25,000 kms',
      originalPrice: '19999',
      currentPrice: '14999',
      duration: '8 years or 1,25,000 kms'
    },
    {
      id: '100k',
      kms: '1,00,000 kms',
      originalPrice: '14499',
      currentPrice: '10499',
      duration: '8 years or 1,00,000 kms'
    },
    {
      id: '80k',
      kms: '80,000 kms',
      originalPrice: '9999',
      currentPrice: '6999',
      duration: '8 years or 80,000 kms'
    },
    {
      id: '60k',
      kms: '60,000 kms',
      originalPrice: '7079',
      currentPrice: 'Free',
      duration: '5 years or 60,000 kms'
    }
  ]

  const selectedPlanData = warrantyPlans.find(plan => plan.id === selectedPlan)
  const totalPrice = selectedPlanData ? 
    (selectedPlanData.currentPrice === 'Free' ? '0' : 
     (parseInt(selectedPlanData.currentPrice) * 1.18).toFixed(0)) : '10499'

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleRemoveClick = () => {
    setShowRemoveConfirmation(true)
  }

  const handleConfirmRemove = () => {
    setShowRemoveConfirmation(false)
    onRemove()
    onClose() // Close the Extended Warranty modal and return to Add-Ons modal
  }

  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false)
    onClose() // Close the Extended Warranty modal and return to Add-Ons modal
  }

  const handleConfirmationBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowRemoveConfirmation(false)
      onClose() // Close the Extended Warranty modal and return to Add-Ons modal
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-[60] overflow-hidden" 
        style={{ height: '100vh', margin: 0, padding: 0 }}
        onClick={handleBackdropClick}
      >
        {/* Mobile: Full screen overlay */}
        <div className="lg:hidden absolute inset-0 bg-white">
          <div className="w-full h-full flex flex-col bg-white" style={{ backgroundColor: '#ffffff' }}>
            {/* Back Button */}
            <div className="absolute top-4 left-4 z-10">
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <img 
                  src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/backButton.svg"
                  alt="back"
                  className="w-6 h-6"
                />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 mt-16 pb-6">
              {/* Header Section with Title and Price */}
              <div className="flex items-start justify-between mb-2 mt-8">
                <div className="flex-1 pr-4">
                  <div className="text-gray-900 text-lg font-bold leading-tight">
                    Extended warranty for your OLA S1 Pro Gen 2
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{totalPrice === '0' ? '0' : parseInt(totalPrice).toLocaleString('en-IN')}
                </div>
              </div>
              
              <div className="text-gray-600 text-sm mb-6">
                With this warranty, extend coverage to 125,000 kms or 8 years, whichever comes first
              </div>

              {/* Limited Period Offer Banner */}
              <div className="bg-green-100 rounded-lg p-3 mb-6 flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Limited period offer: extend your warranty today!
                </span>
              </div>

              {/* Choose Your Plan Section */}
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                  CHOOSE YOUR PLAN
                </div>
                
                {/* Plan Options */}
                <div className="space-y-3">
                  {warrantyPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedPlan === plan.id
                          ? 'bg-gray-100'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 text-lg mb-1">
                            {plan.kms}
                          </div>
                          <div className="flex items-center gap-2 mb-1">
                            {plan.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{parseInt(plan.originalPrice).toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="font-bold text-gray-900">
                              {plan.currentPrice === 'Free' ? 'Free' : `₹${parseInt(plan.currentPrice).toLocaleString('en-IN')} + GST`}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {plan.duration}
                          </div>
                        </div>
                        <div className="ml-4">
                          {selectedPlan === plan.id ? (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Information Links */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="text-sm text-gray-600">
                  To know more, refer to{' '}
                  <button 
                    className="text-blue-600 underline hover:text-blue-800"
                    onClick={() => setIsFaqModalOpen(true)}
                  >
                    FAQ
                  </button>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
              {/* Terms and Conditions Text */}
              <div className="text-sm text-gray-600 mb-4 text-center">
                By continuing, you agree to the{' '}
                <button 
                  className="text-blue-600 underline hover:text-blue-800"
                  onClick={() => setIsWarrantyTermsModalOpen(true)}
                >
                  T&C
                </button>
              </div>
              
              {isAdded ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleRemoveClick}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Remove
                  </button>
                  <button
                    onClick={onContinue}
                    className="flex-1 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
                  >
                    Confirm
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAdd}
                  className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Extend Warranty
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Desktop: Left overlay - transparent to allow interaction with underlying BuyNow modal */}
        <div className="hidden lg:block absolute left-0 w-full h-full bg-transparent" style={{ width: 'calc(100% - 400px)' }}>
          {/* This space is intentionally left empty to allow the underlying BuyNow modal's left section to remain interactive */}
        </div>
        
        {/* Desktop: Right modal panel */}
        <div 
          className="hidden lg:flex absolute right-0 w-96 h-full flex flex-col bg-white"
          style={{
            backgroundColor: '#ffffff'
          }}
        >
          {/* Back Button */}
          <div className="absolute top-4 left-4 z-10">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
              <img 
                src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/backButton.svg"
                alt="back"
                className="w-6 h-6"
              />
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 mt-16 pb-6">
            {/* Header Section with Title and Price */}
            <div className="flex items-start justify-between mb-2 mt-8">
              <div className="flex-1 pr-4">
                <div className="text-gray-900 text-lg font-bold leading-tight">
                  Extended warranty for your OLA S1 Pro Gen 2
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{totalPrice === '0' ? '0' : parseInt(totalPrice).toLocaleString('en-IN')}
              </div>
            </div>
            
            <div className="text-gray-600 text-sm mb-6">
              With this warranty, extend coverage to 125,000 kms or 8 years, whichever comes first
            </div>

            {/* Limited Period Offer Banner */}
            <div className="bg-green-100 rounded-lg p-3 mb-6 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                Limited period offer: extend your warranty today!
              </span>
            </div>

            {/* Choose Your Plan Section */}
            <div className="mb-6">
              <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                CHOOSE YOUR PLAN
              </div>
              
              {/* Plan Options */}
              <div className="space-y-3">
                {warrantyPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPlan === plan.id
                        ? 'bg-gray-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-lg mb-1">
                          {plan.kms}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          {plan.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{parseInt(plan.originalPrice).toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="font-bold text-gray-900">
                            {plan.currentPrice === 'Free' ? 'Free' : `₹${parseInt(plan.currentPrice).toLocaleString('en-IN')} + GST`}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {plan.duration}
                        </div>
                      </div>
                      <div className="ml-4">
                        {selectedPlan === plan.id ? (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Information Links */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="text-sm text-gray-600">
                To know more, refer to{' '}
                <button 
                  className="text-blue-600 underline hover:text-blue-800"
                  onClick={() => setIsFaqModalOpen(true)}
                >
                  FAQ
                </button>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Section */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
            {/* Terms and Conditions Text */}
            <div className="text-sm text-gray-600 mb-4 text-center">
              By continuing, you agree to the{' '}
              <button 
                className="text-blue-600 underline hover:text-blue-800"
                onClick={() => setIsWarrantyTermsModalOpen(true)}
              >
                T&C
              </button>
            </div>
            
            {isAdded ? (
              <div className="flex gap-3">
                <button
                  onClick={handleRemoveClick}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Remove
                </button>
                <button
                  onClick={onContinue}
                  className="flex-1 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <button
                onClick={onAdd}
                className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Extend Warranty
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal - Outside of Extended Warranty modal container */}
      {showRemoveConfirmation && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{ zIndex: 70 }}
          onClick={handleConfirmationBackdropClick}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={handleCancelRemove}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Warning Icon and Content */}
            <div className="flex gap-4 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Are you sure you want to proceed without Extended Warranty?
                </h3>
                <p className="text-sm text-gray-600">
                  Enjoy enhanced battery life and performance for longer
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleConfirmRemove}
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Remove
              </button>
              <button
                onClick={handleCancelRemove}
                className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warranty Terms Modal */}
      <PdfModal
        isOpen={isWarrantyTermsModalOpen}
        onClose={() => setIsWarrantyTermsModalOpen(false)}
        title="Terms and Conditions"
        pdfUrl="/documents/ola-electric-warranty-terms.pdf"
        pdfTitle="Riqueza Electric Warranty Terms and Conditions"
      />

      {/* FAQ Modal */}
      <PdfModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        title="FAQ"
        pdfUrl="/documents/ola-electric-warranty-faq.pdf"
        pdfTitle="Riqueza Electric Warranty FAQ"
      />
    </>
  )
}

export default ExtendedWarrantyModal
