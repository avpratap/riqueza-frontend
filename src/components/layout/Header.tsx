'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { toggleMobileMenu, closeMobileMenu, setAuthModalOpen, setAuthModalMode } from '@/store/slices/uiSlice'
import { toggleCart, loadCart } from '@/store/slices/cartSlice'
import { logout } from '@/store/slices/authSlice'
import ClientOnly from '@/components/shared/ClientOnly'
import { ShoppingCart, Menu, X, Search, User, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency } from '@/utils'
import { cartApi } from '@/lib/cartApi'
import { convertBackendCartItems } from '@/lib/cartItemConverter'

interface HeaderProps {
  hideCenterAndRight?: boolean
}

const Header = ({ hideCenterAndRight = false }: HeaderProps) => {
  const dispatch = useDispatch()
  const { isMobileMenuOpen } = useSelector((state: RootState) => state.ui)
  const { totalItems, totalPrice, items } = useSelector((state: RootState) => state.cart)
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasLoadedCart, setHasLoadedCart] = useState(false)

  // Load cart from backend on mount
  useEffect(() => {
    const loadCartFromBackend = async () => {
      if (hasLoadedCart) return
      
      try {
        console.log('🔄 Loading cart from backend on page load...')
        const cartData = await cartApi.getCart()
        
        if (cartData.success && cartData.data && cartData.data.items && cartData.data.items.length > 0) {
          console.log('📦 Found cart in backend:', cartData.data)
          
          // Convert backend cart items to frontend format
          const validItems = await convertBackendCartItems(cartData.data.items)
          if (validItems.length > 0) {
            console.log('✅ Loaded cart from backend:', validItems.length, 'items')
            dispatch(loadCart(validItems))
          }
        }
        
        setHasLoadedCart(true)
      } catch (error) {
        console.error('❌ Failed to load cart from backend:', error)
        setHasLoadedCart(true)
      }
    }
    
    // Load cart after a delay to ensure backend is ready
    const timer = setTimeout(() => {
      loadCartFromBackend()
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [dispatch, hasLoadedCart])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    // Set initial scroll state
    handleScroll()
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll and add blur effect when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      // Add blur to main content areas
      const contentSelectors = [
        'main',
        '[data-hero]',
        '.hero-section',
        '.content-area',
        '#__next > div:not(header)'
      ]
      
      contentSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.filter = 'blur(8px)'
            element.style.transition = 'filter 0.3s ease'
          }
        })
      })
    } else {
      document.body.style.overflow = 'unset'
      // Remove blur from all content areas
      const contentSelectors = [
        'main',
        '[data-hero]',
        '.hero-section',
        '.content-area',
        '#__next > div:not(header)'
      ]
      
      contentSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.filter = 'none'
          }
        })
      })
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
      const contentSelectors = [
        'main',
        '[data-hero]',
        '.hero-section',
        '.content-area',
        '#__next > div:not(header)'
      ]
      
      contentSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector)
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.filter = 'none'
          }
        })
      })
    }
  }, [isMobileMenuOpen])

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileMenuOpen) {
        const target = event.target as HTMLElement
        const mobileMenu = document.querySelector('[data-mobile-menu]')
        const menuButton = document.querySelector('[data-menu-button]')
        
        // Close if clicking outside the mobile menu and menu button
        if (mobileMenu && !mobileMenu.contains(target) && 
            menuButton && !menuButton.contains(target)) {
          dispatch(closeMobileMenu())
        }
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen, dispatch])

  const scooterModels = [
    { name: 'Requeza S1 Pro+', href: '/product/requeza-s1-pro-plus' },
    { name: 'Requeza S1 Pro', href: '/product/requeza-s1-pro' },
  ]

  const navigation = [
    { name: 'About Us', href: '/about' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 w-full">
          
          {/* Left Side - Company Logo and Name */}
          <div className="flex justify-start items-center flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer hover:opacity-90 transition-all duration-300"
              title="Go to Home Page"
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-sm sm:text-lg lg:text-xl">R</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl opacity-20 blur group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-teal-400 group-hover:via-green-400 group-hover:to-yellow-400 transition-all duration-300 whitespace-nowrap">
                  Requeza Electric
                </span>
              </div>
            </Link>
          </div>

          {/* Center - Scooter Models and About Us - Hidden on mobile/tablet */}
          {!hideCenterAndRight && (
            <div className="hidden xl:flex items-center justify-center space-x-4 flex-1">
            
            {/* Scooter Models */}
            {scooterModels.map((model, index) => (
              <Link
                key={model.name}
                href={model.href}
                className="group relative whitespace-nowrap"
              >
                <span className={`text-lg xl:text-xl font-bold bg-gradient-to-r ${
                  index === 0 
                    ? 'from-blue-600 via-teal-500 to-yellow-500' 
                    : 'from-blue-600 via-green-500 to-yellow-500'
                } bg-clip-text text-transparent hover:scale-105 transition-transform duration-300`}>
                  {model.name}
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-teal-500 to-yellow-500 opacity-0 group-hover:opacity-10 rounded-lg blur transition-opacity duration-300"></div>
              </Link>
            ))}

            {/* About Us with same gradient theme */}
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative whitespace-nowrap"
              >
                <span className="text-lg xl:text-xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-yellow-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                  {item.name}
                </span>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-teal-500 to-yellow-500 opacity-0 group-hover:opacity-10 rounded-lg blur transition-opacity duration-300"></div>
              </Link>
            ))}
            </div>
          )}

          {/* Right Side - Cart and User Actions */}
          {!hideCenterAndRight && (
            <div className="flex justify-end items-center space-x-2 sm:space-x-3 lg:space-x-4">

            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 sm:p-3 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-full group"
              data-cart-button
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu - Only visible on desktop (xl+), hidden on small screens */}
            <div className="hidden xl:block">
              <ClientOnly
                fallback={
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <div className="bg-gray-200 animate-pulse rounded-full px-4 py-2 h-8 w-12 lg:w-16"></div>
                    <div className="bg-gray-200 animate-pulse rounded-full px-4 py-2 h-8 w-16 lg:w-20"></div>
                  </div>
                }
              >
                {isAuthenticated ? (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span className="text-xs sm:text-sm text-gray-700 font-medium whitespace-nowrap">
                      Hi, {user?.name?.split(' ')[0] || user?.name}
                    </span>
                    <button 
                      onClick={() => dispatch(logout())}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 text-xs sm:text-sm"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <button
                      onClick={() => {
                        dispatch(setAuthModalMode('login'))
                        dispatch(setAuthModalOpen(true))
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 text-xs sm:text-sm"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        dispatch(setAuthModalMode('signup'))
                        dispatch(setAuthModalOpen(true))
                      }}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 text-xs sm:text-sm"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </ClientOnly>
            </div>

            {/* Mobile Menu Button - Always shows hamburger icon */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              className="xl:hidden p-2 sm:p-3 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-full group"
              data-menu-button
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
            </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation - Smooth Animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop for click outside to close - Only blur middle content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="xl:hidden fixed top-16 bottom-0 left-0 right-0 bg-black/60 z-40"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  dispatch(closeMobileMenu())
                }}
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  filter: 'blur(0px)'
                }}
              />
              
              {/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="xl:hidden fixed top-16 right-0 w-80 sm:w-96 bg-white border border-gray-200 shadow-xl rounded-l-2xl overflow-hidden z-50"
                data-mobile-menu
                style={{
                  backdropFilter: 'none',
                  WebkitBackdropFilter: 'none',
                  filter: 'none'
                }}
              >
               {/* Header with Close Button and User Greeting */}
               <div className="flex justify-between items-center p-4 pb-2">
                 {/* User Greeting */}
                 <div className="flex items-center">
                   <span className="text-gray-700 font-medium text-sm sm:text-base">
                     Hi, {user?.name?.split(' ')[0] || 'User'}
                   </span>
                 </div>
                 
                 {/* Close Button */}
                 <button
                   onClick={() => dispatch(closeMobileMenu())}
                   className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200 hover:bg-red-50 rounded-full"
                 >
                   <X className="w-5 h-5" />
                 </button>
               </div>
                
                <div className="px-6 pb-6 space-y-6">
              
              {/* Mobile Scooter Models */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Scooter Models</h3>
                {scooterModels.map((model, index) => (
                  <motion.div
                    key={model.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Link
                      href={model.href}
                      className={`block px-4 py-3 rounded-lg text-center font-semibold hover:shadow-lg transition-all duration-200 bg-gradient-to-r ${
                        index === 0 
                          ? 'from-blue-600 via-teal-500 to-yellow-500' 
                          : 'from-blue-600 via-green-500 to-yellow-500'
                      } text-white hover:scale-105`}
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      {model.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Mobile Navigation Links */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Company</h3>
                {navigation.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-3 rounded-lg text-center font-semibold hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-blue-600 via-teal-500 to-yellow-500 text-white hover:scale-105"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Mobile Auth */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-4 border-t border-gray-200"
              >
                <ClientOnly
                  fallback={
                    <div className="space-y-3">
                      <div className="bg-gray-200 animate-pulse rounded-lg py-3 px-4 h-12"></div>
                      <div className="bg-gray-200 animate-pulse rounded-lg py-3 px-4 h-12"></div>
                    </div>
                  }
                >
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          dispatch(logout())
                          dispatch(closeMobileMenu())
                        }}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-200"
                      >
                        Logout
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <button
                          onClick={() => {
                            dispatch(setAuthModalMode('login'))
                            dispatch(setAuthModalOpen(true))
                            dispatch(closeMobileMenu())
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-200"
                        >
                          Login
                        </button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <button
                          onClick={() => {
                            dispatch(setAuthModalMode('signup'))
                            dispatch(setAuthModalOpen(true))
                            dispatch(closeMobileMenu())
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold text-center hover:shadow-lg transition-all duration-200"
                        >
                          Sign Up
                        </button>
                      </motion.div>
                    </div>
                  )}
                </ClientOnly>
              </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

    </header>
  )
}

export default Header
