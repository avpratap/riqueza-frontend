import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface SoftWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: () => void
  onSkip: () => void
  title: string
  description: string
  price: string
  addonName: string
}

const SoftWarningModal: React.FC<SoftWarningModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  onSkip,
  title,
  description,
  price,
  addonName
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 500)
  }

  const handleAdd = () => {
    onAdd()
    handleClose()
  }

  const handleSkip = () => {
    onSkip()
    handleClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div 
        className={`bg-white w-full max-w-md rounded-2xl shadow-2xl transform transition-all duration-500 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="relative px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-900 flex-1 pr-8 leading-tight">
              {title}
            </h2>
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <p className="text-sm text-gray-600 mb-6">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleAdd}
              className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-200 uppercase tracking-wide"
            >
              Add for {price} & Continue
            </button>
            <button
              onClick={handleSkip}
              className="w-full py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              I'll skip it
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SoftWarningModal
