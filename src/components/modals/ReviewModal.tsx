'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, Send, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ReviewData {
  productId: string
  productName: string
  rating: number
  title: string
  review: string
  userName: string
  userEmail: string
}

const ReviewModal = ({ isOpen, onClose }: ReviewModalProps) => {
  const [reviewData, setReviewData] = useState<ReviewData>({
    productId: '',
    productName: '',
    rating: 0,
    title: '',
    review: '',
    userName: '',
    userEmail: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const productDropdownRef = useRef<HTMLDivElement>(null)

  const products = [
    { id: 's1-pro', name: 'S1 Pro' },
    { id: 's1-pro-plus', name: 'S1 Pro+' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRatingClick = (rating: number) => {
    setReviewData(prev => ({
      ...prev,
      rating
    }))
  }

  const handleProductSelect = (productId: string, productName: string) => {
    setReviewData(prev => ({
      ...prev,
      productId,
      productName
    }))
    setIsProductDropdownOpen(false)
  }

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productDropdownRef.current && !productDropdownRef.current.contains(event.target as Node)) {
        setIsProductDropdownOpen(false)
      }
    }

    if (isProductDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProductDropdownOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://riqueza-backend.vercel.app' : 'http://localhost:5000'}/api/reviews/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit review')
      }

      console.log('✅ Review submitted successfully:', data)
      setIsSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setReviewData({
          productId: '',
          productName: '',
          rating: 0,
          title: '',
          review: '',
          userName: '',
          userEmail: ''
        })
        onClose()
      }, 3000)

    } catch (error) {
      console.error('❌ Review submission error:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setReviewData({
        productId: '',
        productName: '',
        rating: 0,
        title: '',
        review: '',
        userName: '',
        userEmail: ''
      })
      setError('')
      setIsSubmitted(false)
      onClose()
    }
  }

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Share Your Experience
              </h2>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Review Submitted Successfully!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for sharing your experience. Your review helps other customers make informed decisions.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Product Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Product *
                    </label>
                    <div className="relative" ref={productDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setIsProductDropdownOpen(!isProductDropdownOpen)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base bg-white hover:border-blue-300 hover:shadow-sm flex items-center justify-between"
                      >
                        <span className="flex-1 text-left">
                          {reviewData.productName || 'Choose a product'}
                        </span>
                        <ChevronDown 
                          className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                            isProductDropdownOpen ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      {/* Dropdown List */}
                      {isProductDropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg overflow-hidden">
                          {products.map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onClick={() => handleProductSelect(product.id, product.name)}
                              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-left text-sm sm:text-base hover:bg-blue-50 transition-colors duration-200 ${
                                reviewData.productId === product.id ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                              }`}
                            >
                              {product.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingClick(star)}
                          className="p-1 transition-colors duration-200"
                        >
                          <Star
                            className={`w-6 h-6 sm:w-8 sm:h-8 ${
                              star <= reviewData.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {reviewData.rating > 0 && (
                      <p className="text-sm text-gray-600 mt-1">
                        {reviewData.rating === 1 && 'Poor'}
                        {reviewData.rating === 2 && 'Fair'}
                        {reviewData.rating === 3 && 'Good'}
                        {reviewData.rating === 4 && 'Very Good'}
                        {reviewData.rating === 5 && 'Excellent'}
                      </p>
                    )}
                  </div>

                  {/* Review Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Review Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={reviewData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      placeholder="Summarize your experience in a few words"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      id="review"
                      name="review"
                      value={reviewData.review}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-sm sm:text-base"
                      placeholder="Tell us about your experience with this product..."
                    />
                  </div>

                  {/* User Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="userName"
                        name="userName"
                        value={reviewData.userName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="userEmail"
                        name="userEmail"
                        value={reviewData.userEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || reviewData.rating === 0}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                        <span className="text-sm sm:text-base">Submitting Review...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="text-sm sm:text-base">Submit Review</span>
                      </div>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ReviewModal
