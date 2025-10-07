'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  sections: Array<{
    title: string
    duration?: string
    description: string
    price?: string
  }>
  buttonText?: string
}

const InfoModal = ({ isOpen, onClose, title, sections, buttonText = 'Got It' }: InfoModalProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure smooth animation
      setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 500) // Wait for animation to complete
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
          <h2 className="text-xl font-bold text-gray-900 text-left pr-8">
            {title}
          </h2>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {sections.map((section, index) => (
            <div key={index} className={`${index > 0 ? 'mt-6' : ''}`}>
              {/* Section Header */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {section.title}
                </h3>
                <div className="flex items-center gap-2">
                  {section.duration && (
                    <span className="text-sm text-gray-600">
                      {section.duration}
                    </span>
                  )}
                  {section.price && (
                    <span className="text-sm font-semibold text-gray-900">
                      {section.price}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Section Description */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {section.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Button */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <button
            onClick={handleClose}
            className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-200 uppercase tracking-wide"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InfoModal
