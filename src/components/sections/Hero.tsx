'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { setSelectedProduct } from '@/store/slices/productSlice'
import { openBuyNowModal } from '@/store/slices/uiSlice'

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { products } = useSelector((state: RootState) => state.products)

  // Track if component is mounted to prevent hydration mismatches
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get products from Redux state (only after mount to prevent hydration issues)
  const requezaS1ProPlus = mounted ? products.find(p => p.slug === 'riqueza-s1-pro-plus') : null
  const requezaS1Pro = mounted ? products.find(p => p.slug === 'riqueza-s1-pro') : null

  // Create heroSlides array consistently - always include product info but conditionally use it
  const heroSlides = [
    {
      id: 1,
      badge: "INTRODUCING",
      title: "Riqueza S1 Pro+",
      subtitle: "Meet India's most powerful scooter",
      cta: "Explore S1 Pro+",
      ctaSecondary: "Book Now",
      image: "https://res.cloudinary.com/dnulm62j6/image/upload/v1758558786/s1_pro_plus_banner_web_v2_ttur01.webp",
      color: "red",
      product: null, // Always null on server, updated after mount
      slug: "riqueza-s1-pro-plus"
    },
    {
      id: 2,
      badge: "INTRODUCING",
      title: "Riqueza S1 Pro",
      subtitle: "Scooter for every Indian, now gets even better!",
      cta: "Explore S1 Pro",
      ctaSecondary: "Book Now",
      image: "https://res.cloudinary.com/dnulm62j6/image/upload/v1758558786/s1_x_gen3_plus_banner_web_image_iuok1i.webp",
      color: "blue",
      product: null, // Always null on server, updated after mount
      slug: "riqueza-s1-pro"
    },
    // {
    //   id: 3,
    //   badge: "INTRODUCING",
    //   title: "MoveOS 5",
    //   subtitle: "The most advanced EV upgrade India has ever seen",
    //   cta: "Know More",
    //   ctaSecondary: "Book Now",
    //   image: "/images/hp_moveos5_banner_web_image.webp",
    //   color: "purple",
    //   product: null,
    //   slug: null
    // },
    // {
    //   id: 4,
    //   badge: "INTRODUCING",
    //   title: "Hyperservice",
    //   subtitle: "Get your S1 serviced faster, easier, better",
    //   cta: "Learn More",
    //   ctaSecondary: "Book Now",
    //   image: "/images/home_banner_hyperservices_web_v3.webp",
    //   color: "green",
    //   product: null,
    //   slug: null
    // },
    // {
    //   id: 5,
    //   badge: "INTRODUCING",
    //   title: "Gig | S1 Z | PowerPod",
    //   subtitle: "Riding towards an all electric India",
    //   cta: "Explore Gig",
    //   ctaSecondary: "Explore S1 Z",
    //   image: "/images/hp_gen3_banner_web_image_03.webp",
    //   color: "orange",
    //   product: null,
    //   slug: null
    // }
  ]

  // Auto-scroll functionality - use consistent length
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  // Manual navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  // Handle Explore button click
  const handleExplore = (slide: any) => {
    if (slide.product && slide.slug) {
      // Navigation will be handled by Link component
    }
  }

  // Handle Book Now button click
  const handleBookNow = (slide: any) => {
    if (slide.product) {
      dispatch(setSelectedProduct(slide.product))
      dispatch(openBuyNowModal())
    }
  }

  // Update hero slides with products after mount to ensure consistent rendering
  const [heroSlidesWithProducts, setHeroSlidesWithProducts] = useState(heroSlides)
  
  useEffect(() => {
    if (mounted) {
      setHeroSlidesWithProducts([
        {
          ...heroSlides[0],
          product: requezaS1ProPlus
        },
        {
          ...heroSlides[1],
          product: requezaS1Pro
        }
      ])
    }
  }, [mounted, requezaS1ProPlus, requezaS1Pro])

  const currentHero = heroSlidesWithProducts[currentSlide]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 pt-16 max-w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${currentHero.image})`,
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Navigation Arrows - Responsive */}
      <button
        type="button"
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 group"
        suppressHydrationWarning
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform duration-200" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 group"
        suppressHydrationWarning
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform duration-200" />
      </button>

      {/* Content - No Animations */}
      <div className="container-max relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center justify-center">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-800/80 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full uppercase tracking-wider">
              {currentHero.badge}
            </span>
          </div>

          {/* Main Title - Responsive Typography */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
            {currentHero.title}
          </h1>

          {/* Subtitle - Responsive Typography */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/90 font-medium max-w-4xl mx-auto">
            {currentHero.subtitle}
          </p>

          {/* CTA Buttons - Same Size, Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            {currentHero.slug ? (
              <Link
                href={`/product/${currentHero.slug}`}
                onClick={() => handleExplore(currentHero)}
                className="w-full sm:w-auto min-w-[200px] sm:min-w-[220px] text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center space-x-2 group bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium rounded-lg"
              >
                <span>{currentHero.cta}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            ) : (
              <Link
                href="/products"
                className="w-full sm:w-auto min-w-[200px] sm:min-w-[220px] text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center space-x-2 group bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium rounded-lg"
              >
                <span>{currentHero.cta}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            )}
            
            {/* Always render Link on server, button only after mount if product exists */}
            {mounted && currentHero.product ? (
              <button
                type="button"
                onClick={() => handleBookNow(currentHero)}
                className="w-full sm:w-auto min-w-[200px] sm:min-w-[220px] text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center space-x-2 group bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium rounded-lg"
              >
                <span>{currentHero.ctaSecondary}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            ) : (
              <Link
                href="/test-ride"
                className="w-full sm:w-auto min-w-[200px] sm:min-w-[220px] text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 inline-flex items-center justify-center space-x-2 group bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium rounded-lg"
              >
                <span>{currentHero.ctaSecondary}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Pagination Dots - Responsive */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2 sm:space-x-3">
          {heroSlidesWithProducts.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              suppressHydrationWarning
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentSlide}
        />
      </div> */}
    </section>
  )
}

export default Hero
