'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { closeCart, removeFromCart, updateQuantity, loadCart } from '@/store/slices/cartSlice'
import { setAuthModalOpen, setAuthModalMode } from '@/store/slices/uiSlice'
import useAuth from '@/components/auth/AuthProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Package,
  Star,
  User
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { cartApi } from '@/lib/cartApi'
import { cartService } from '@/lib/cartService'
import { convertBackendCartItems, CartItemWithDatabaseId } from '@/lib/cartItemConverter'

const CartModal = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, totalItems, totalPrice, isOpen } = useSelector((state: RootState) => state.cart)
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  
  // State declarations
  const [isAnimating, setIsAnimating] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [modalHeight, setModalHeight] = useState(0)
  const [hasLoadedFromDatabase, setHasLoadedFromDatabase] = useState(false)
  
  // Close cart modal when on checkout page
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname === '/checkout') {
      dispatch(closeCart())
    }
  }, [dispatch])

  // Load cart from database when modal opens and Redux cart is empty (optimized - fast loading)
  useEffect(() => {
    if (isOpen && items.length === 0 && isAuthenticated && !hasLoadedFromDatabase) {
      console.log('🔄 Cart modal opened with empty Redux cart, loading from database...');
      
      const loadFromDatabase = async () => {
        try {
          // Load immediately for fastest response
          const cartData = await cartApi.getCart();
          
          if (cartData.success && cartData.data && cartData.data.items && cartData.data.items.length > 0) {
            console.log('📦 Found cart in database for modal:', cartData.data);
            
            // Convert backend cart items to frontend format
            const validItems = await convertBackendCartItems(cartData.data.items);
            if (validItems.length > 0) {
              console.log('✅ Converted and loaded cart from database for modal:', validItems);
              dispatch(loadCart(validItems));
              setHasLoadedFromDatabase(true);
            } else {
              setHasLoadedFromDatabase(true); // Mark as loaded even if no valid items
            }
          } else {
            setHasLoadedFromDatabase(true); // Mark as loaded even if cart is empty
          }
        } catch (error) {
          console.error('Failed to load cart from database for modal:', error);
          setHasLoadedFromDatabase(true); // Mark as loaded on error to prevent retry loops
        }
      };

      // Load immediately without any delay for fastest response
      loadFromDatabase();
    }
  }, [isOpen, items.length, isAuthenticated, dispatch, hasLoadedFromDatabase])

  // Reset database loading flag when items change
  useEffect(() => {
    if (items.length > 0) {
      setHasLoadedFromDatabase(true);
    } else if (items.length === 0) {
      setHasLoadedFromDatabase(false);
    }
  }, [items.length])

  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Calculate optimal positioning
  useEffect(() => {
    if (isOpen) {
      const calculateHeight = () => {
        const viewportHeight = window.innerHeight
        const availableHeight = viewportHeight - 80 // Account for header
        const calculatedHeight = Math.min(availableHeight, 600) // Max 600px height
        setModalHeight(Math.max(calculatedHeight, 300)) // Min 300px height
      }
      
      calculateHeight()
      window.addEventListener('resize', calculateHeight)
      return () => window.removeEventListener('resize', calculateHeight)
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store original values
      const originalBodyOverflow = document.body.style.overflow
      const originalBodyPaddingRight = document.body.style.paddingRight
      const originalHtmlOverflow = document.documentElement.style.overflow
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      
      // Hide scroll on both html and body
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.classList.add('no-scroll')
      
      return () => {
        document.documentElement.style.overflow = originalHtmlOverflow
        document.body.style.overflow = originalBodyOverflow
        document.body.style.paddingRight = originalBodyPaddingRight
        document.body.classList.remove('no-scroll')
      }
    }
  }, [isOpen])

  // Handle click outside to close cart modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as HTMLElement
        const cartModal = document.querySelector('[data-cart-modal]')
        const cartButton = document.querySelector('[data-cart-button]')
        
        // Close if clicking outside the cart modal and cart button
        if (cartModal && !cartModal.contains(target) && 
            cartButton && !cartButton.contains(target)) {
          dispatch(closeCart())
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, dispatch])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    // Find the item to get its database ID
    const item = items.find(item => item.id === itemId);
    
    if (!item) {
      console.error('❌ Item not found in cart:', itemId);
      return;
    }
    
    const databaseId = (item as any)?.databaseId;
    
    if (newQuantity <= 0) {
      // Use databaseId if available, otherwise use itemId (for guest users)
      const idToUse = databaseId || itemId;
      console.log('🗑️ Removing item:', { itemId, databaseId, idToUse });
      dispatch(removeFromCart(idToUse));
    } else {
      // Update quantity - use databaseId if available, otherwise itemId
      // For guest users, itemId might be the database UUID, or we might not have databaseId
      const idToUse = databaseId || itemId;
      console.log('🔄 Updating quantity:', { itemId, newQuantity, databaseId, idToUse });
      dispatch(updateQuantity({ itemId, quantity: newQuantity, databaseId: idToUse }))
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      console.log('🔍 Starting item removal process...');
      console.log('📋 All cart items:', items.map(item => ({
        frontendId: item.id,
        databaseId: (item as any)?.databaseId,
        productName: item.product?.name
      })));
      
      // Find the item to get its database ID
      const item = items.find(item => item.id === itemId);
      
      if (!item) {
        console.error('❌ Item not found in cart:', itemId);
        return;
      }
      
      const databaseId = (item as any)?.databaseId;
      // For guest users, use databaseId if available, otherwise use itemId
      const idToUse = databaseId || itemId;
      
      console.log('🔍 Item found:', {
        frontendId: itemId,
        databaseId,
        idToUse,
        hasDatabaseId: !!databaseId,
        itemStructure: Object.keys(item)
      });
      
      console.log('🗑️ Removing item:', {
        frontendId: itemId, 
        databaseId, 
        idToUse,
        productName: item?.product?.name,
        variant: item?.variant?.name 
      });
      
      // Dispatch to Redux (this will also trigger backend sync)
      // Use databaseId if available, otherwise use itemId
      dispatch(removeFromCart(idToUse));
      
      // Show success feedback
      console.log('✅ Item removal initiated successfully');
      
      // Force refresh cart from backend after a short delay to ensure sync
      setTimeout(async () => {
        try {
          console.log('🔄 Refreshing cart from backend after delete...');
          const cartData = await cartApi.getCart();
          if (cartData.success && cartData.data && cartData.data.items) {
            const validItems = await convertBackendCartItems(cartData.data.items);
            dispatch(loadCart(validItems));
            console.log('✅ Cart refreshed from backend:', validItems.length, 'items');
          }
        } catch (error) {
          console.error('❌ Failed to refresh cart from backend:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('❌ Error removing item from cart:', error);
    }
  }


  const toggleExpanded = (itemId: string, sectionType: string) => {
    setExpandedItems(prev => {
      const newState = { ...prev }
      
      // Close all other sections for this item
      const itemPrefix = itemId.split('-')[0]
      Object.keys(newState).forEach(key => {
        if (key.startsWith(itemPrefix) && key !== itemId) {
          newState[key] = false
        }
      })
      
      // Toggle the current section
      newState[itemId] = !newState[itemId]
      
      return newState
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (!isOpen && !isAnimating) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            dispatch(closeCart())
          }}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          
          {/* Cart Modal */}
          <motion.div 
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-16 right-0 w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] xl:w-[36rem] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-1rem)]"
            data-cart-modal
            style={{
              height: modalHeight > 0 ? `${modalHeight}px` : 'calc(100vh - 5rem)',
              maxHeight: 'calc(100vh - 5rem)',
              minHeight: '20rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
        <div className="bg-white rounded-l-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col" style={{ height: modalHeight > 0 ? `${modalHeight}px` : 'calc(100vh - 5rem)', maxHeight: modalHeight > 0 ? `${modalHeight}px` : 'calc(100vh - 5rem)' }}>
          {/* Header */}
          <div 
            className="bg-gradient-to-r from-blue-600 via-teal-500 to-green-500 p-3 sm:p-4 text-white cursor-pointer"
            onClick={() => dispatch(closeCart())}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold">Your Cart</h2>
                  <p className="text-xs sm:text-sm text-white/80">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(closeCart());
                }}
                className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div 
            className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {items.length === 0 ? (
              <div className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Add some amazing products to get started!</p>
                <Link
                  href="/"
                  onClick={() => dispatch(closeCart())}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                >
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors relative">
                    {/* Delete Button - Top Right */}
                    <button
                      onClick={() => {
                        console.log('🗑️ Delete button clicked for item:', {
                          frontendId: item.id,
                          databaseId: (item as any)?.databaseId,
                          productName: item.product?.name,
                          variant: item.variant?.name
                        });
                        handleRemoveItem(item.id);
                      }}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-7 sm:h-7 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors z-10"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                    </button>
                    
                    <div className="flex gap-2 sm:gap-4 pr-6 sm:pr-8">
                      {/* Product Image */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0].image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            style={{ 
                              filter: item.color?.css_filter || 'none' 
                            }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://res.cloudinary.com/dnulm62j6/image/upload/v1758562609/m1_o5y1jo.webp';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                            <ShoppingBag className="w-8 h-8 text-blue-400" />
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2">
                          {item.product.name}
                        </h3>
                        
                        {/* Product Specifications */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-blue-50 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color.color_code || '#000' }}></div>
                              <span className="text-xs font-medium text-gray-700">Color</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{item.color.name}</p>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-700">Battery</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{item.variant.battery_capacity}</p>
                          </div>
                          
                          <div className="bg-purple-50 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-700">Range</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.variant.range_km} km
                            </p>
                          </div>
                          
                          <div className="bg-orange-50 rounded-lg p-2">
                            <div className="flex items-center gap-1 mb-1">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-xs font-medium text-gray-700">Top Speed</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.variant.top_speed_kmh} km/h
                            </p>
                          </div>
                        </div>
                        
                        {/* Add-ons */}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="mb-3">
                            <button
                              onClick={() => toggleExpanded(`${item.id}-addons`, 'addons')}
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Package className="w-4 h-4" />
                              <span>View Add-ons ({item.addOns.length})</span>
                              {expandedItems[`${item.id}-addons`] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            {expandedItems[`${item.id}-addons`] && (
                              <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {item.addOns.map((addon, index) => (
                                  <div key={index} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Star className="w-4 h-4 text-blue-500" />
                                          <span className="font-medium text-gray-900 text-sm">
                                            {addon.name}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">
                                          {addon.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-semibold text-blue-600">
                                            {formatPrice(addon.price)}
                                          </span>
                                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                            Add-on
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Insurance */}
                        {item.insurance && item.insurance.length > 0 && (
                          <div className="mb-3">
                            <button
                              onClick={() => toggleExpanded(`${item.id}-insurance`, 'insurance')}
                              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-800 transition-colors"
                            >
                              <Package className="w-4 h-4" />
                              <span>View Insurance ({item.insurance.length})</span>
                              {expandedItems[`${item.id}-insurance`] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            {expandedItems[`${item.id}-insurance`] && (
                              <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {item.insurance.map((insurance, index) => (
                                  <div key={index} className="bg-green-50 rounded-lg p-3 border border-green-200">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Star className="w-4 h-4 text-green-500" />
                                          <span className="font-medium text-gray-900 text-sm">
                                            {insurance.name}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">
                                          {insurance.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-semibold text-green-600">
                                            {formatPrice(insurance.price)}
                                          </span>
                                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                            Insurance
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Regular Accessories */}
                        {item.accessories && item.accessories.length > 0 && (
                          <div className="mb-3">
                            <button
                              onClick={() => toggleExpanded(`${item.id}-accessories`, 'accessories')}
                              className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors"
                            >
                              <Package className="w-4 h-4" />
                              <span>View Accessories ({item.accessories.length})</span>
                              {expandedItems[`${item.id}-accessories`] ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            {expandedItems[`${item.id}-accessories`] && (
                              <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
                                {item.accessories.map((accessory, index) => (
                                  <div key={index} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Star className="w-4 h-4 text-purple-500" />
                                          <span className="font-medium text-gray-900 text-sm">
                                            {accessory.name}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">
                                          {accessory.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <span className="text-sm font-semibold text-purple-600">
                                            {formatPrice(accessory.price)}
                                          </span>
                                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                            Accessory
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Price and Quantity */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const databaseId = (item as any)?.databaseId;
                                const idToUse = databaseId || item.id;
                                
                                if (item.quantity <= 1) {
                                  // Remove item if quantity would be 0 or less
                                  // Use databaseId if available, otherwise use itemId
                                  console.log('🗑️ Removing item via minus button:', { 
                                    itemId: item.id, 
                                    databaseId, 
                                    idToUse,
                                    quantity: item.quantity 
                                  });
                                  handleRemoveItem(item.id);
                                } else {
                                  // Decrement quantity
                                  handleQuantityChange(item.id, item.quantity - 1);
                                }
                              }}
                              className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-base font-semibold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                handleQuantityChange(item.id, item.quantity + 1);
                              }}
                              className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Price - Right Aligned */}
                          <div className="text-right">
                            <span className="font-bold text-gray-900 text-lg">
                              {formatPrice(item.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50 flex-shrink-0">
              {/* Total */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={async () => {
                    try {
                      console.log('🔄 Syncing cart to backend before navigation...');
                      
                      // Sync entire cart state to backend before navigation
                      await cartService.syncEntireCartToBackend(items);
                      
                      console.log('✅ Cart synced successfully, proceeding...');
                      
                      // Small delay to ensure backend has processed the updates
                      await new Promise(resolve => setTimeout(resolve, 300));
                      
                      if (isAuthenticated) {
                        dispatch(closeCart());
                        window.location.href = '/checkout';
                      } else {
                        // Open mobile login form
                        dispatch(setAuthModalMode('login'));
                        dispatch(setAuthModalOpen(true));
                        dispatch(closeCart());
                      }
                    } catch (error) {
                      console.error('❌ Failed to sync cart before navigation:', error);
                      // Still proceed with navigation even if sync fails
                      // The checkout page will load cart from backend
                      if (isAuthenticated) {
                        dispatch(closeCart());
                        window.location.href = '/checkout';
                      } else {
                        dispatch(setAuthModalMode('login'));
                        dispatch(setAuthModalOpen(true));
                        dispatch(closeCart());
                      }
                    }
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                >
                  <CreditCard className="w-5 h-5" />
                  {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>
              </div>
            </div>
          )}
        </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default CartModal
