'use client'

import { useState } from 'react'
import { ChevronRight, Wrench, Check } from 'lucide-react'

interface EssentialCareModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: () => void
  onRemove: () => void
  onContinue: () => void
  isAdded: boolean
}

const EssentialCareModal = ({ isOpen, onClose, onAdd, onRemove, onContinue, isAdded }: EssentialCareModalProps) => {
  const [showFAQs, setShowFAQs] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false)

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
    onClose() // Close the Essential Care modal and return to Add-Ons modal
  }

  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false)
    onClose() // Close the Essential Care modal and return to Add-Ons modal
  }

  const handleConfirmationBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowRemoveConfirmation(false)
      onClose() // Close the Essential Care modal and return to Add-Ons modal
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
          <div className="w-full h-full flex flex-col bg-white"
            style={{
              backgroundImage: `url("https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/olaCardBackground4.png")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top center',
              backgroundColor: '#f7fbfe'
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
              {/* Header Text */}
              <div className="text-center text-gray-600 text-sm mb-6 mt-8">
                Keep your vehicle running smoothly with a structured service schedule.
              </div>

              {/* Main Card */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                {/* Title */}
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src="https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/zeroOrder/Ola+Essential.svg"
                    alt="Riqueza Essential Care"
                    className="h-6"
                  />
                </div>
                
                <div className="w-full h-px bg-gray-300 mb-4"></div>
                
                {/* What it includes */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                    What it includes
                  </div>
                  
                  {/* Service Points */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Wrench className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700 leading-relaxed">
                        3 free mandatory comprehensive service at 5,000km or 6 months, 10,000km or 1 year & 20,000km or 2 years.
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        Get a 18-point comprehensive check, covering breaks, tyers, handle, axle, head unit, and more.
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      ₹2,397<span className="text-sm text-gray-500">+GST</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">3 Services</div>
                    <div className="text-sm text-gray-500">₹799+ GST/Service</div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mb-4">
                <div 
                  className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
                  onClick={() => setShowFAQs(!showFAQs)}
                >
                  <span className="text-sm text-gray-900">Frequently asked questions</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showFAQs ? 'rotate-90' : ''}`} />
                </div>
                
                {/* FAQ Content */}
                {showFAQs && (
                  <div className="mt-4 space-y-4">
                    <div className="text-lg font-bold text-gray-900 mb-4">FAQ</div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="font-semibold text-gray-900 mb-2">How do I book this service?</div>
                        <div className="text-sm text-gray-600">
                          You can book this service via the Riqueza Electric app or visit a Riqueza Store and speak to our service managers.
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-900 mb-2">What is covered under this service?</div>
                        <div className="text-sm text-gray-600">
                          We conduct a thorough 18-point vehicle check-up. Details of these checks can be found here.
                          {/* <a 
                            href="https://www.olaelectric.com/hyperservice" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            https://www.olaelectric.com/hyperservice
                          </a> */}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-900 mb-2">Are free part replacements included in this service?</div>
                        <div className="text-sm text-gray-600">
                          No, any part replaced as part of this inspection will be chargeable.
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-900 mb-2">What is the dedicated helpline number to avail theft assistance?</div>
                        <div className="text-sm text-gray-600">
                          Theft Assistance will be available between 8am-8pm under the helpline number{' '}
                          <span className="font-mono bg-gray-100 px-1 rounded">08033113311</span>.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Section */}
              <div className="mb-4">
                <div 
                  className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
                  onClick={() => setShowTerms(!showTerms)}
                >
                  <span className="text-sm text-gray-900">Terms and conditions</span>
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showTerms ? 'rotate-90' : ''}`} />
                </div>
                
                {/* Terms Content */}
                {showTerms && (
                  <div className="mt-4 space-y-4">
                    <div className="text-lg font-bold text-gray-900 mb-4">Terms and conditions</div>
                    
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <span className="text-sm font-semibold text-gray-900 flex-shrink-0">1.</span>
                        <div className="text-sm text-gray-600">
                          Any part replaced during the service will be chargeable. This check-up only covers labour charges.
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <span className="text-sm font-semibold text-gray-900 flex-shrink-0">2.</span>
                        <div className="text-sm text-gray-600">
                          This check-up covers labour only for the listed activities. Any additional labour will be chargeable.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-4">
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
                    Continue
                  </button>
                </div>
              ) : (
                <button
                  onClick={onAdd}
                  className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Add Ola Essential Care
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
            backgroundImage: `url("https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/olaCardBackground4.png")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            backgroundColor: '#f7fbfe'
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
            {/* Header Text */}
            <div className="text-center text-gray-600 text-sm mb-6 mt-8">
              Keep your vehicle running smoothly with a structured service schedule.
            </div>

            {/* Main Card */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              {/* Title */}
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/zeroOrder/Ola+Essential.svg"
                  alt="OLA Essential Care"
                  className="h-6"
                />
              </div>
              
              <div className="w-full h-px bg-gray-300 mb-4"></div>
              
              {/* What it includes */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                  What it includes
                </div>
                
                {/* Service Points */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Wrench className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-gray-700 leading-relaxed">
                      3 free mandatory comprehensive service at 5,000km or 6 months, 10,000km or 1 year & 20,000km or 2 years.
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="w-3 h-3 text-gray-400" />
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      Get a 18-point comprehensive check, covering breaks, tyers, handle, axle, head unit, and more.
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pricing */}
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-lg font-bold text-gray-900">
                    ₹2,397<span className="text-sm text-gray-500">+GST</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">3 Services</div>
                  <div className="text-sm text-gray-500">₹799+ GST/Service</div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-4">
              <div 
                className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
                onClick={() => setShowFAQs(!showFAQs)}
              >
                <span className="text-sm text-gray-900">Frequently asked questions</span>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showFAQs ? 'rotate-90' : ''}`} />
              </div>
              
              {/* FAQ Content */}
              {showFAQs && (
                <div className="mt-4 space-y-4">
                  <div className="text-lg font-bold text-gray-900 mb-4">FAQ</div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="font-semibold text-gray-900 mb-2">How do I book this service?</div>
                      <div className="text-sm text-gray-600">
                        You can book this service via the Ola Electric app or visit an Ola Store and speak to our service managers.
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-900 mb-2">What is covered under this service?</div>
                      <div className="text-sm text-gray-600">
                        We conduct a thorough 18-point vehicle check-up. Details of these checks can be found here.
                        {/* <a 
                          href="https://www.olaelectric.com/hyperservice" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          https://www.olaelectric.com/hyperservice
                        </a> */}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-900 mb-2">Are free part replacements included in this service?</div>
                      <div className="text-sm text-gray-600">
                        No, any part replaced as part of this inspection will be chargeable.
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-semibold text-gray-900 mb-2">What is the dedicated helpline number to avail theft assistance?</div>
                      <div className="text-sm text-gray-600">
                        Theft Assistance will be available between 8am-8pm under the helpline number{' '}
                        <span className="font-mono bg-gray-100 px-1 rounded">08033113311</span>.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms Section */}
            <div className="mb-4">
              <div 
                className="flex justify-between items-center py-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2"
                onClick={() => setShowTerms(!showTerms)}
              >
                <span className="text-sm text-gray-900">Terms and conditions</span>
                <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showTerms ? 'rotate-90' : ''}`} />
              </div>
              
              {/* Terms Content */}
              {showTerms && (
                <div className="mt-4 space-y-4">
                  <div className="text-lg font-bold text-gray-900 mb-4">Terms and conditions</div>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <span className="text-sm font-semibold text-gray-900 flex-shrink-0">1.</span>
                      <div className="text-sm text-gray-600">
                        Any part replaced during the service will be chargeable. This check-up only covers labour charges.
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <span className="text-sm font-semibold text-gray-900 flex-shrink-0">2.</span>
                      <div className="text-sm text-gray-600">
                        This check-up covers labour only for the listed activities. Any additional labour will be chargeable.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Bottom Section */}
          <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-4">
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
                  Continue
                </button>
              </div>
            ) : (
              <button
                onClick={onAdd}
                className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Add Ola Essential Care
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal - Outside of Essential Care modal container */}
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
                  Are you sure you want to remove Ola Essential Care ?
                </h3>
                <p className="text-sm text-gray-600">
                  You will miss out on 18-point comprehensive check, covering breaks, tyers, handle, axle, head unit, and more.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCancelRemove}
                className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Continue buying Ola Essential Care
              </button>
              <button
                onClick={handleConfirmRemove}
                className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EssentialCareModal
