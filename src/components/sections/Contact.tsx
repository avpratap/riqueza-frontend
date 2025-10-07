'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle, Star, ChevronDown } from 'lucide-react'
import ReviewModal from '../modals/ReviewModal'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubjectOpen, setIsSubjectOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const subjectRef = useRef<HTMLDivElement>(null)
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(event.target as Node)) {
        setIsSubjectOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubjectSelect = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      subject: topic
    }))
    setIsSubjectOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Submit to backend API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit contact form')
      }

      console.log('✅ Contact form submitted successfully:', data)
      setIsSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      }, 3000)

    } catch (error) {
      console.error('❌ Contact form submission error:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit contact form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+91 1800 102 0000", "+91 1800 102 0001"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@olaelectric.com", "sales@olaelectric.com"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: MapPin,
      title: "Head Office",
      details: ["Riqueza Electric, Koramangala", "Bangalore, Karnataka 560034"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 9:00 AM - 4:00 PM"],
      color: "from-orange-500 to-orange-600"
    }
  ]

  const supportTopics = [
    "Product Information",
    "Test Ride Booking",
    "Service & Maintenance",
    "Warranty Claims",
    "Financing Options",
    "Charging Infrastructure",
    "App Support",
    "General Inquiries"
  ]

  return (
    <section className="w-full bg-gray-50 py-8 sm:py-12 lg:py-16" ref={ref}>
      {/* Full width container with same margins as other sections */}
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        {/* Section Header - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12 px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Get in <span className="bg-gradient-to-r from-blue-500 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">Touch</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Have questions about our electric vehicles? Need support or want to book a test ride? 
            We're here to help you every step of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-1 flex flex-col"
          >
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 flex-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Send us a Message
              </h3>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Message Sent Successfully!
                  </h4>
                  <p className="text-gray-600">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Subject *
                      </label>
                      <div className="relative" ref={subjectRef}>
                        <button
                          type="button"
                          onClick={() => setIsSubjectOpen(!isSubjectOpen)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base bg-white text-left flex items-center justify-between hover:border-blue-300 hover:shadow-sm"
                        >
                          <span className={formData.subject ? 'text-gray-900' : 'text-gray-500'}>
                            {formData.subject || 'Select a topic'}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isSubjectOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isSubjectOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                            <div className="py-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                              {supportTopics.map((topic, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => handleSubjectSelect(topic)}
                                  className={`w-full text-left px-4 py-3 text-sm sm:text-base transition-colors duration-200 hover:bg-blue-50 ${
                                    formData.subject === topic ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:text-blue-600'
                                  }`}
                                >
                                  {topic}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 text-sm sm:text-base"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                        <span className="text-sm sm:text-base">Sending Message...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        <span className="text-sm sm:text-base">Send Message</span>
                      </div>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-2 lg:order-2 flex flex-col"
          >
            <div className="space-y-6 flex-1">
              {/* Contact Info Cards */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-4 sm:p-6 lg:p-8 text-white shadow-lg">
                <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                      Visit Us
                    </h4>
                    <p className="text-blue-100 text-sm sm:text-base">
                      Riqueza Electric, Koramangala<br />
                      Bangalore, Karnataka 560034
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                      Business Hours
                    </h4>
                    <p className="text-blue-100 text-sm sm:text-base">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-blue-100 text-sm sm:text-base">Sat: 9:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100">
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                  Quick Contact
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Call Us</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">+91 1800 102 0000</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Email Us</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">support@requeza.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">24/7 Support</p>
                      <p className="font-semibold text-blue-600 text-sm sm:text-base">Live Chat Available</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="flex items-center space-x-3 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Review Products</p>
                      <p className="font-semibold text-yellow-600 text-sm sm:text-base">Share Your Experience</p>
                    </div>
                  </button>
                </div>
              </div>


            </div>
          </motion.div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </section>
  )
}

export default Contact

