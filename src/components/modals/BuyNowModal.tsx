'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  ChevronLeft,
  ChevronRight, 
  ChevronDown,
  Check,
  Truck,
  FileText,
  Home,
  CreditCard,
  CheckCircle,
  Gem,
  Info,
  ArrowRight
} from 'lucide-react'
import { RootState, AppDispatch } from '@/store/store'
import { closeBuyNowModal } from '@/store/slices/uiSlice'
import { addToCart } from '@/store/slices/cartSlice'
import { Product, ProductVariant, ProductColor, Accessory, fetchAccessories } from '@/store/slices/productSlice'
import MoveOSDetailsModal from './MoveOSDetailsModal'
import DeliveryModal from './DeliveryModal'
import ComparisonModal from './ComparisonModal'
import AddOnsModal from './AddOnsModal'
import InsuranceModal from './InsuranceModal'
import PdfModal from './PdfModal'

interface BuyNowModalProps {
  isOpen: boolean
  onClose: () => void
  product?: Product
}

const BuyNowModal = ({ isOpen, onClose, product }: BuyNowModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { accessories } = useSelector((state: RootState) => state.products)
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedVariant, setSelectedVariant] = useState<string>('')
  const [moveOSAdded, setMoveOSAdded] = useState(true)
  // Initialize selected values when product changes
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].id)
      }
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0].id)
      }
    }
  }, [product])

  // Fetch accessories when modal opens
  useEffect(() => {
    if (isOpen && accessories.length === 0) {
      dispatch(fetchAccessories())
    }
  }, [isOpen, accessories.length, dispatch])

  // State for tracking which accessories are added
  const [addedAccessories, setAddedAccessories] = useState<Record<string, boolean>>({})

  // Function to toggle accessory
  const toggleAccessory = (accessoryId: string) => {
    setAddedAccessories(prev => ({
      ...prev,
      [accessoryId]: !prev[accessoryId]
    }))
  }

  // Calculate total price including accessories
  const calculateTotalPrice = () => {
    if (!product || !selectedVariant || !product.variants) return 0
    
    const variant = product.variants.find(v => v.id === selectedVariant)
    if (!variant) return 0
    
    const basePrice = variant.price
    let accessoryTotal = 0
    
    // Calculate accessory total
    Object.entries(addedAccessories).forEach(([accessoryId, isAdded]) => {
      if (isAdded) {
        const accessory = accessories.find(acc => acc.id === accessoryId)
        if (accessory) {
          // Ensure price is converted to number
          let accessoryPrice: number = accessory.price
          if (typeof accessoryPrice === 'string') {
            accessoryPrice = parseFloat((accessoryPrice as string).replace(/[₹,]/g, ''))
          }
          if (isNaN(accessoryPrice)) {
            accessoryPrice = 0
          }
          accessoryTotal += accessoryPrice
        }
      }
    })
    
    return basePrice + accessoryTotal
  }

  // Get added accessories info
  const getAddedAccessoriesInfo = () => {
    const addedAccessoryIds = Object.entries(addedAccessories)
      .filter(([_, isAdded]) => isAdded)
      .map(([id, _]) => id)
    
    const addedCount = addedAccessoryIds.length
    const accessoryTotal = addedAccessoryIds.reduce((total, accessoryId) => {
      const accessory = accessories.find(acc => acc.id === accessoryId)
      if (accessory) {
        // Ensure price is converted to number
        let accessoryPrice: number = accessory.price
        if (typeof accessoryPrice === 'string') {
          accessoryPrice = parseFloat((accessoryPrice as string).replace(/[₹,]/g, ''))
        }
        if (isNaN(accessoryPrice)) {
          accessoryPrice = 0
        }
        return total + accessoryPrice
      }
      return total
    }, 0)
    
    return { addedCount, accessoryTotal, addedAccessoryIds }
  }
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isMoveOSDetailsModalOpen, setIsMoveOSDetailsModalOpen] = useState(false)
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false)
  const [isAddOnsModalOpen, setIsAddOnsModalOpen] = useState(false)
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false)
  const [combinedAccessoriesFromAddOns, setCombinedAccessoriesFromAddOns] = useState<any[]>([])
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '303702',
    landmark: ''
  })

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen || isMoveOSDetailsModalOpen || isDeliveryModalOpen || isComparisonModalOpen || isAddOnsModalOpen || isInsuranceModalOpen || isPdfModalOpen || isTermsModalOpen) {
      // Store original values
      const originalBodyOverflow = document.body.style.overflow
      const originalBodyPaddingRight = document.body.style.paddingRight
      const originalHtmlOverflow = document.documentElement.style.overflow
      const originalBodyClassName = document.body.className
      
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
        document.body.className = originalBodyClassName
      }
    }
  }, [isOpen, isMoveOSDetailsModalOpen, isDeliveryModalOpen, isComparisonModalOpen, isAddOnsModalOpen, isInsuranceModalOpen])

  // Reset image index when color or variant changes
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [selectedColor, selectedVariant])

  // Get images from product
  const productImages = product?.images || []
  const sortedImages = productImages.length > 0 ? [...productImages].sort((a, b) => a.display_order - b.display_order) : []

  // Use product colors or fallback to default colors
  const colors = product?.colors || [
    { 
      id: 'silver', 
      name: 'Silver',
      color_code: '#9CA3AF',
      css_filter: 'grayscale(1)'
    },
    { 
      id: 'passion-red', 
      name: 'Passion Red',
      color_code: '#EF4444',
      css_filter: 'hue-rotate(0deg) saturate(1.5)'
    },
    { 
      id: 'steller-blue', 
      name: 'Stellar Blue',
      color_code: '#3B82F6',
      css_filter: 'hue-rotate(200deg) saturate(1.2)'
    },
    { 
      id: 'midnight-blue', 
      name: 'Midnight Blue',
      color_code: '#1E3A8A',
      css_filter: 'hue-rotate(220deg) saturate(1.5)'
    }
  ]

  // Use product variants
  const variants = product?.variants || []
  const selectedVariantData = variants.find(v => v.id === selectedVariant)

  const nextImage = () => {
    if (sortedImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length)
    }
  }

  const prevImage = () => {
    if (sortedImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
    }
  }

  const handleAddressSubmit = (address: any) => {
    setDeliveryAddress(address)
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant || !selectedColor || !product.variants || !product.colors) return
    
    const variant = product.variants.find(v => v.id === selectedVariant)
    const color = product.colors.find(c => c.id === selectedColor)
    const selectedAccessories = accessories.filter(acc => addedAccessories[acc.id])
    
    if (variant && color) {
      dispatch(addToCart({
        product,
        variant,
        color,
        accessories: selectedAccessories
      }))
      
      // Close modal and show success message
      dispatch(closeBuyNowModal())
    }
  }

  if (!isOpen) return null
  
  // Show loading state if product is not available
  if (!product) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-hidden" style={{ height: '100vh', margin: 0, padding: 0 }}>
        <div className="flex h-full items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-hidden" style={{ height: '100vh', margin: 0, padding: 0 }}>
      <div className="flex flex-col lg:flex-row h-full" style={{ height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
        {/* Left Section - Image Gallery */}
        <div
          className="flex-1 relative bg-gray-100 lg:flex-1 h-[50vh] lg:h-full"
          style={{
            margin: 0,
            padding: 0,
            overflow: 'hidden',
            zIndex: isMoveOSDetailsModalOpen || isComparisonModalOpen || isAddOnsModalOpen || isInsuranceModalOpen ? 60 : 'auto'
          }}
        >
          {/* Brand Logo */}
          <div className="absolute top-6 left-6 z-30">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
              Riqueza Electric
            </div>
          </div>

          {/* Main Image */}
          <div 
            className="absolute inset-0 bg-gray-200 z-10 h-[50vh] lg:h-full" 
            style={{ 
              width: '100%',
              margin: 0,
              padding: 0,
              lineHeight: 0
            }}
          >
            {sortedImages.length > 0 ? (
              <img
                src={sortedImages[currentImageIndex]?.image_url || '/images/placeholder.png'}
                alt={sortedImages[currentImageIndex]?.alt_text || `Product view ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
                style={{ 
                  width: '100%',
                  margin: 0,
                  padding: 0,
                  display: 'block',
                  verticalAlign: 'bottom',
                  filter: colors.find(c => c.id === selectedColor)?.css_filter || 'none'
                }}
                onError={(e) => {
                  // Image failed to load
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
            
            {/* Navigation Arrows */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 z-20"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-200 z-20"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

              {/* Image Thumbnails */}
              {sortedImages.length > 0 && (
                <div className="absolute top-4 right-4 flex flex-row gap-2 z-20">
                  {sortedImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        currentImageIndex === index ? 'border-white' : 'border-white/30'
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{ filter: colors.find(c => c.id === selectedColor)?.css_filter || 'none' }}
                      />
                    </button>
                  ))}
                </div>
              )}
        </div>

        {/* Right Section - Purchase Panel */}
        <div className="w-full lg:w-96 bg-white flex flex-col h-[50vh] lg:h-full">
          {/* Header */}
          <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <img 
                src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/backButton.svg"
                alt="back"
                className="w-6 h-6"
              />
            </button>
            <div 
              className="text-xs text-gray-500 flex items-center gap-1 cursor-pointer hover:text-gray-700 transition-colors"
              onClick={() => setIsDeliveryModalOpen(true)}
            >
              DELIVERING TO 
              <span className="font-semibold text-gray-900">{deliveryAddress.pincode}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Color Selection */}
             <div className="px-4 py-4 border-b border-gray-100">
               <div className="text-xs text-gray-500 mb-2">COLOR •</div>
               <div className="text-lg font-medium mb-3">{colors.find(c => c.id === selectedColor)?.name || 'Select Color'}</div>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-10 h-10 rounded-full border-3 ${
                      selectedColor === color.id ? 'border-green-400' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.color_code }}
                  />
                ))}
              </div>
            </div>

                {/* Variant Selection */}
                <div className="px-4 py-4 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    CHOOSE VARIANT
                  </div>
                  
                  {/* Variants */}
                  {variants.length > 0 && (
                    <div className="space-y-2">
                      {variants.map((variant) => (
                        <div key={variant.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-900">{product?.name}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-sm font-semibold text-gray-900">{variant.name}</span>
                              {variant.is_new && (
                                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">
                                  NEW
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <div className="text-xs text-gray-500">IDC Range</div>
                              <div className="text-sm font-bold text-gray-900">{variant.range_km} km</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">TOP SPEED</div>
                              <div className="text-sm font-bold text-gray-900">{variant.top_speed_kmh} km/h</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">0-40 km/h</div>
                              <div className="text-sm font-bold text-gray-900">{variant.acceleration_sec} sec</div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setSelectedVariant(variant.id)}
                            className={`w-full mt-2 px-3 py-2 text-xs font-medium rounded border transition-all ${
                              selectedVariant === variant.id
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            Choose
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery Banner */}
                  {/* <div className="mt-4 bg-purple-500 text-white p-3 rounded-lg flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                      <div className="font-semibold">Estimated delivery by 02nd Oct 2025!</div>
                      <div className="text-purple-100">It's an auspicious day to get your Riqueza EV delivered</div>
                    </div>
                  </div> */}
                </div>

            {/* MoveOS+ */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div className="w-full rounded bg-[#f7fbfe] p-5 pt-5 pb-4 mt-2 flex items-center justify-between relative">
                {/* Left Side - Logo and Info */}
                <div className="flex flex-col items-start">
                  {/* MoveOS+ Logo */}
                  <div>
                    <img 
                      src="/images/MoveOS/move-os-plus-logo3.svg" 
                      alt="MoveOS+"
                      className="w-24 h-auto"
                    />
                  </div>
                  
                  {moveOSAdded ? (
                    /* Added State - Lifetime Info */
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-sm text-gray-600">For Lifetime</span>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        <span className="text-xs">₹</span>8,474
                      </span>
                    </div>
                  ) : (
                    /* Not Added State - Feature Info */
                    <div className="flex flex-col items-start mt-2">
                      <div className="text-sm font-semibold text-gray-900">Unlock Vehicle's Full Potential</div>
                      <div className="text-xs text-gray-600 mt-1">More speed, range, and 20+ features</div>
                      <div className="text-sm text-gray-900 mt-1">
                        For just <span className="text-green-600 font-semibold">₹8,473</span>
                        <span 
                          className="text-green-600 ml-2 cursor-pointer hover:underline"
                          onClick={() => setIsMoveOSDetailsModalOpen(true)}
                        >
                          Know More
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right Side - Action Button */}
                {moveOSAdded ? (
                  /* Added State - Added Button */
                  <button
                    onClick={() => setIsMoveOSDetailsModalOpen(true)}
                    className="flex items-center gap-1 text-green-600 bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                  >
                    <Check className="w-4 h-4 font-bold" />
                    <span className="text-sm font-bold">Added</span>
                  </button>
                ) : (
                  /* Not Added State - Add Button */
                  <button
                    onClick={() => setIsMoveOSDetailsModalOpen(true)}
                    className="bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-green-600">Add</span>
                  </button>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            {/* <div className="px-4 py-4 border-b border-gray-100">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-2 rounded"
                onClick={() => setIsDeliveryModalOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 uppercase tracking-wide">DELIVERING TO</div>
                    <div className="text-sm text-gray-600">
                      {deliveryAddress.addressLine1 ? 
                        `${deliveryAddress.addressLine1}, ${deliveryAddress.city} - ${deliveryAddress.pincode}` : 
                        'Riqueza Electric Store, Murlipura'
                      }
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div> */}

            {/* Compare Models */}
            <div className="px-4 py-4 border-b border-gray-100">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-2 rounded"
                onClick={() => setIsComparisonModalOpen(true)}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 uppercase tracking-wide">COMPARE MODELS</div>
                    <div className="text-sm text-gray-600">View full spec sheet</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Test Ride */}
            {/* <div className="px-4 py-4 border-b border-gray-100">
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-orange-900 italic mb-1">
                      Get a test ride at your home
                    </div>
                    <div className="text-sm text-orange-800 mb-2">
                      Experience the revolutionary Ola S1 at your doorstep
                    </div>
                    <button className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                      Book now
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="w-16 h-16 bg-orange-200 rounded-lg flex items-center justify-center ml-4">
                    <Home className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>
            </div> */}

            {/* Finance Offer */}
            {/* <div className="px-4 py-4 border-b border-gray-100">
              <div className="bg-green-50 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-green-100">
                <div className="text-sm font-semibold text-green-800">
                  Explore finance as low as 6.99%* with 0% processing fee!
                </div>
                <ArrowRight className="w-4 h-4 text-green-600 ml-2" />
              </div>
            </div> */}

            {/* Already Booked */}
            {/* <div className="px-4 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-2 rounded">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-semibold text-gray-900 uppercase tracking-wide">ALREADY BOOKED?</div>
                    <div className="text-sm text-gray-600">Check order status</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div> */}

            {/* Accessories */}
            <div className="px-4 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Explore accessories</h2>
              <div className="space-y-3">
                {accessories.map((accessory, index) => (
                  <div key={accessory.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-start p-4 gap-4">
                      {/* Left Section: Image - Made Bigger */}
                      <div className="w-28 h-28 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={accessory.image_url}
                          alt={accessory.name}
                          onError={(e) => {
                            // Accessory image failed to load
                          }}
                        />
                      </div>
                      {/* Right Section: Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-28">
                        <div>
                          <div className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                            {accessory.name}
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            ₹{accessory.price.toLocaleString('en-IN')}
                          </div>
                        </div>
                        {/* Add Button - Aligned to bottom right */}
                        <div className="flex justify-end">
                          <button 
                            onClick={() => toggleAccessory(accessory.id)}
                            className={`px-4 py-2 font-semibold rounded-md text-sm transition-colors ${
                              addedAccessories[accessory.id]
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {addedAccessories[accessory.id] ? 'Added' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="px-4 py-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="terms" 
                    className={`flex items-center justify-center w-5 h-5 border-2 rounded cursor-pointer transition-colors ${
                      agreeTerms 
                        ? 'bg-green-500 border-green-500' 
                        : 'bg-white border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {agreeTerms && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                </div>
                <label htmlFor="terms" className="text-sm text-gray-900 leading-tight cursor-pointer">
                  I agree to the{' '}
                  <button 
                    className="text-blue-600 underline hover:text-blue-800 font-medium"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsTermsModalOpen(true)
                    }}
                  >
                    terms & condition
                  </button>
                  {' '}and{' '}
                  <button 
                    className="text-blue-600 underline hover:text-blue-800 font-medium"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsPdfModalOpen(true)
                    }}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Section - ROI + Pricing */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200">
            {/* ROI Banner */}
            {/* <div className="px-4 py-3 bg-green-500 text-white flex items-center justify-between cursor-pointer hover:bg-green-600 transition-colors">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4" />
                <span className="text-sm font-semibold">ROI starting 6.99%</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </div> */}
            
            {/* Pricing and Button Section */}
            <div className="px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Pricing Information */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{calculateTotalPrice().toLocaleString('en-IN')}
                    </span>
                    <Info className="w-4 h-4 text-gray-400" />
                  </div>
                  {/* <div className="text-sm text-gray-500 line-through mb-1">
                    ₹{selectedVariantData?.price?.toLocaleString('en-IN') || '0'}
                  </div> */}
                  {(() => {
                    const accessoriesInfo = getAddedAccessoriesInfo();
                    return accessoriesInfo.addedCount > 0 && (
                      <div className="text-sm text-green-600 mb-1">
                        + {accessoriesInfo.addedCount} accessories added (₹{accessoriesInfo.accessoryTotal.toLocaleString('en-IN')})
                      </div>
                    );
                  })()}
                  {/* <div className="text-sm text-gray-600">
                    EMI starting from <span className="underline">₹2,699</span>
                  </div> */}
                </div>
                
                {/* Right: Continue Button */}
                <div className="flex-shrink-0">
                  <button
                    disabled={!agreeTerms || !selectedVariant || !selectedColor}
                    onClick={() => agreeTerms && setIsAddOnsModalOpen(true)}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                      agreeTerms && selectedVariant && selectedColor
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MoveOS Details Modal */}
      <MoveOSDetailsModal
        isOpen={isMoveOSDetailsModalOpen}
        onClose={() => setIsMoveOSDetailsModalOpen(false)}
        moveOSAdded={moveOSAdded}
        setMoveOSAdded={setMoveOSAdded}
      />

      {/* Delivery Modal */}
      <DeliveryModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onAddressSubmit={handleAddressSubmit}
      />

      {/* Comparison Modal */}
      <ComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
      />

      {/* Add-Ons Modal */}
      <AddOnsModal
        isOpen={isAddOnsModalOpen}
        onClose={() => setIsAddOnsModalOpen(false)}
        onContinue={(combinedAccessories) => {
          console.log('🔧 AddOnsModal onContinue called with accessories:', combinedAccessories)
          setCombinedAccessoriesFromAddOns(combinedAccessories)
          setIsAddOnsModalOpen(false)
          setIsInsuranceModalOpen(true)
        }}
        moveOSAdded={moveOSAdded}
        setMoveOSAdded={setMoveOSAdded}
        selectedVariant={selectedVariant}
        selectedColor={selectedColor}
        selectedAccessories={accessories.filter(acc => addedAccessories[acc.id])}
      />

      {/* PDF Modal - Privacy Policy */}
      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        title="Privacy Policy"
        pdfUrl="/documents/ola-financial-services-privacy-policy.pdf"
        pdfTitle="Riqueza Financial Services Privacy Policy"
      />

      {/* PDF Modal - Terms and Conditions */}
      <PdfModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Terms and Conditions"
        pdfUrl="/documents/ola-financial-services-terms.pdf"
        pdfTitle="Insurance On-boarding Terms and Conditions"
      />

      {/* Insurance Modal */}
      <InsuranceModal
        isOpen={isInsuranceModalOpen}
        onClose={() => setIsInsuranceModalOpen(false)}
        onContinue={() => {
          setIsInsuranceModalOpen(false)
          // Close the entire BuyNowModal flow
          onClose()
        }}
        selectedVariant={selectedVariant}
        selectedColor={selectedColor}
        selectedAccessories={combinedAccessoriesFromAddOns.length > 0 ? combinedAccessoriesFromAddOns : accessories.filter(acc => addedAccessories[acc.id])}
      />
    </div>
  )
}

export default BuyNowModal
