'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star, Quote, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

const Testimonials = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Software Engineer",
      city: "Bangalore",
      rating: 5,
      content: "I've been riding the Riqueza S1 Pro for 6 months now and it's been an incredible experience. The range is amazing, and the smart features make every ride enjoyable. Highly recommended!",
      avatar: "/avatars/rahul.jpg",
      vehicle: "Riqueza S1 Pro"
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Marketing Manager",
      city: "Mumbai",
      rating: 5,
      content: "Switching to electric was the best decision I made. The Riqueza S1 Air is perfect for city commuting - smooth, quiet, and saves me a lot on fuel costs. The service support is excellent too.",
      avatar: "/avatars/priya.jpg",
      vehicle: "Riqueza S1 Air"
    },
    {
      id: 3,
      name: "Amit Kumar",
      role: "Business Owner",
      city: "Delhi",
      rating: 4,
      content: "Great performance and build quality. The charging infrastructure is expanding rapidly, making it convenient for daily use. Only giving 4 stars because the app could be more intuitive.",
      avatar: "/avatars/amit.jpg",
      vehicle: "Riqueza S1 Pro"
    },
    {
      id: 4,
      name: "Neha Singh",
      role: "Student",
      city: "Pune",
      rating: 5,
      content: "As a student, the Riqueza S1 X is perfect for my budget and needs. It's stylish, efficient, and the maintenance costs are minimal. Love the eco-friendly aspect!",
      avatar: "/avatars/neha.jpg",
      vehicle: "Riqueza S1 X"
    },
    {
      id: 5,
      name: "Vikram Mehta",
      role: "Delivery Partner",
      city: "Chennai",
      rating: 5,
      content: "I use my Riqueza scooter for deliveries all day long. The battery life is impressive, and the performance is consistent even after months of heavy usage. Great investment!",
      avatar: "/avatars/vikram.jpg",
      vehicle: "Riqueza S1 Air"
    },
    {
      id: 6,
      name: "Anjali Reddy",
      role: "Teacher",
      city: "Hyderabad",
      rating: 5,
      content: "Perfect for my daily commute to school. The smooth ride and quick charging make it so convenient. Plus, I'm contributing to a cleaner environment!",
      avatar: "/avatars/anjali.jpg",
      vehicle: "Riqueza S1 Pro"
    },
    {
      id: 7,
      name: "Rohan Gupta",
      role: "Freelancer",
      city: "Jaipur",
      rating: 4,
      content: "Love the design and performance. The smart features are really helpful. Battery life could be better for long trips, but overall a great purchase!",
      avatar: "/avatars/rohan.jpg",
      vehicle: "Riqueza S1 Air"
    },
    {
      id: 8,
      name: "Sneha Iyer",
      role: "Doctor",
      city: "Kochi",
      rating: 5,
      content: "Reliable and efficient for my hectic schedule. The low maintenance and zero emissions are big plus points. Highly recommend for healthcare professionals!",
      avatar: "/avatars/sneha.jpg",
      vehicle: "Riqueza S1 Pro"
    }
  ]

  // Calculate items per page based on screen size
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1280) return 4 // Desktop and large laptop (4 reviews)
      if (window.innerWidth >= 1024) return 3 // Small and medium laptop (3 reviews)
      if (window.innerWidth >= 768) return 2 // Tablet (2 reviews)
      return 1 // Mobile (1 review)
    }
    return 3 // Default to 3 for SSR
  }

  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage())
  const totalPages = Math.ceil(testimonials.length / itemsPerPage)

  // Update items per page on window resize
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      const newItemsPerPage = getItemsPerPage()
      setItemsPerPage(newItemsPerPage)
      // Reset to first page if current page is out of bounds
      const maxPages = Math.ceil(testimonials.length / newItemsPerPage)
      if (currentPage >= maxPages) {
        setCurrentPage(0)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentPage, testimonials.length])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || totalPages <= 1) return

    const autoPlayInterval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 10000) // 10 seconds

    return () => clearInterval(autoPlayInterval)
  }, [isAutoPlaying, totalPages])
  const startIndex = currentPage * itemsPerPage
  const visibleTestimonials = testimonials.slice(startIndex, startIndex + itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
    setIsAutoPlaying(false) // Pause auto-play when user interacts
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    setIsAutoPlaying(false) // Pause auto-play when user interacts
  }

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex)
    setIsAutoPlaying(false) // Pause auto-play when user interacts
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  return (
    <section className="w-full bg-gray-50 pt-8 sm:pt-12 lg:pt-16" ref={ref}>
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
            What Our <span className="bg-gradient-to-r from-blue-500 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">Customers Say</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Hear from thousands of satisfied customers 
            who have made the switch to electric mobility.
          </p>
        </motion.div>

        {/* Testimonials Grid with Navigation - Responsive layout */}
        <div className="relative">
          {/* Navigation Arrows - Positioned outside the grid container */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prevPage}
                className="flex absolute left-2 sm:left-4 md:left-6 lg:left-8 xl:left-12 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 z-10"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>

              <button
                onClick={nextPage}
                className="flex absolute right-2 sm:right-4 md:right-6 lg:right-8 xl:right-12 top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 z-10"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Grid Container with proper padding to accommodate arrows */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-12 sm:px-16 md:px-20 lg:px-24 xl:px-28"
          >
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Quote Icon */}
                <div className="text-blue-200 mb-3 sm:mb-4">
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                {/* Rating */}
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 flex-grow">
                  {testimonial.content}
                </blockquote>

                {/* Customer Info */}
                <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs text-gray-600 truncate">
                      {testimonial.role} • {testimonial.city}
                    </p>
                    <p className="text-xs text-blue-600 font-medium truncate">
                      {testimonial.vehicle}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>

        {/* Page Indicators and Auto-play Control */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center mt-6 sm:mt-8 space-y-3"
          >
            {/* Page Indicators */}
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageClick(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === currentPage ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Auto-play Toggle Button */}
            <button
              onClick={toggleAutoPlay}
              className="flex items-center space-x-2 px-3 py-1 bg-white rounded-full shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-sm text-gray-600 hover:text-blue-600"
              aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">4.8/5</div>
            <div className="text-xs sm:text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">50K+</div>
            <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">98%</div>
            <div className="text-xs sm:text-sm text-gray-600">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 mb-1 sm:mb-2">24/7</div>
            <div className="text-xs sm:text-sm text-gray-600">Customer Support</div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default Testimonials
