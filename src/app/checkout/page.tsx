'use client'

import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { clearCart, loadCart, addToCart } from '@/store/slices/cartSlice'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { orderService } from '@/lib/orderService'
import { cartApi } from '@/lib/cartApi'
import { convertBackendCartItems } from '@/lib/cartItemConverter'
import AuthGuard from '@/components/auth/AuthGuard'
import InfoModal from '@/components/modals/InfoModal'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
  CreditCard,
  MapPin,
  Truck,
  Shield,
  CheckCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Package,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface DeliveryOption {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  icon: React.ReactNode
}

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  available: boolean
}

const CheckoutPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { items, totalPrice } = useSelector((state: RootState) => state.cart)
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [isLoadingCart, setIsLoadingCart] = useState(true)
  const [forceUpdate, setForceUpdate] = useState(0)
  const [hasLoadedFromDatabase, setHasLoadedFromDatabase] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  // Load cart from backend on page load
  useEffect(() => {
    const loadCartFromBackend = async () => {
      try {
        console.log('🔄 Loading cart from backend on checkout page...');
        const cartData = await cartApi.getCart();
        
        if (cartData.success && cartData.data && cartData.data.items && cartData.data.items.length > 0) {
          console.log('📦 Found cart in backend:', cartData.data);
          
          // Convert backend cart items to frontend format
          const validItems = await convertBackendCartItems(cartData.data.items);
          if (validItems.length > 0) {
            console.log('✅ Loaded cart from backend on checkout:', validItems.length, 'items');
            dispatch(loadCart(validItems));
          } else {
            console.log('⚠️ No valid cart items after conversion');
          }
        } else {
          console.log('⚠️ No cart items found in backend');
        }
      } catch (error) {
        console.error('❌ Failed to load cart from backend:', error);
      } finally {
        // Mark loading as complete
        setIsLoadingCart(false);
        setHasLoadedFromDatabase(true);
        console.log('✅ Cart loading complete');
      }
    };
    
    loadCartFromBackend();
  }, [dispatch]);

  // Transfer guest cart to authenticated user when user logs in
  useEffect(() => {
    const transferGuestCart = async () => {
      try {
        const guestSessionId = localStorage.getItem('guestSessionId');
        const authToken = localStorage.getItem('authToken');
        
        if (guestSessionId && authToken && items.length > 0) {
          console.log('🔄 Transferring guest cart to authenticated user...');
          
          const response = await fetch('/api/cart-transfer/transfer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`,
              'X-Guest-Session-Id': guestSessionId
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ Cart transferred successfully:', result);
            
            // Clear guest session
            localStorage.removeItem('guestSessionId');
            
            // Refresh cart from server
            const cartResponse = await fetch('/api/cart-transfer/user-cart', {
              headers: {
                'Authorization': `Bearer ${authToken}`
              }
            });
            
            if (cartResponse.ok) {
              const cartData = await cartResponse.json();
              console.log('📦 Updated cart from server:', cartData);
              // Cart will be updated via Redux state
            }
          }
        }
      } catch (error) {
        console.error('Failed to transfer guest cart:', error);
      }
    };

    transferGuestCart();
  }, []);

  // Load cart from localStorage or database as fallback if Redux state is empty
  useEffect(() => {
    if (items.length === 0 && !hasLoadedFromDatabase) {
      console.log('🔄 Redux cart is empty, checking localStorage and database...');
      
      // First try localStorage
      try {
        const savedCart = localStorage.getItem('cartState');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          if (parsedCart.items && parsedCart.items.length > 0) {
            console.log('📦 Found cart in localStorage, loading to Redux:', parsedCart);
            dispatch(loadCart(parsedCart.items));
            setHasLoadedFromDatabase(true);
            return; // Exit early if localStorage cart found
          }
        }
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }

      // If no localStorage cart, try database (for authenticated users)
      // Add delay to prevent conflicts with cart transfer process
      setTimeout(async () => {
        try {
          const authData = localStorage.getItem('requeza_auth_data');
          if (authData) {
            console.log('🔄 No localStorage cart, loading from database...');
            const cartData = await cartApi.getCart();
            
            if (cartData.success && cartData.data && cartData.data.items && cartData.data.items.length > 0) {
              console.log('📦 Found cart in database:', cartData.data);
              
              // Convert backend cart items to frontend format
              const validItems = await convertBackendCartItems(cartData.data.items);
              if (validItems.length > 0) {
                console.log('✅ Converted and loaded cart from database:', validItems);
                dispatch(loadCart(validItems));
                setHasLoadedFromDatabase(true);
              }
            }
          }
        } catch (error) {
          console.error('Failed to load cart from database:', error);
        }
      }, 2000); // Wait 2 seconds to ensure cart transfer is complete
    }
  }, [dispatch, items.length, hasLoadedFromDatabase]);

  // Reset database loading flag when items change
  useEffect(() => {
    if (items.length > 0) {
      setHasLoadedFromDatabase(true);
    } else if (items.length === 0) {
      setHasLoadedFromDatabase(false);
    }
  }, [items.length]);

  // Force re-render when cart state changes
  useEffect(() => {
    console.log('🔄 Cart state changed, forcing re-render');
    setIsLoadingCart(false);
    setForceUpdate(prev => prev + 1);
  }, [items.length, totalPrice]);

  // Test function to manually add an item to cart (for debugging)
  const testAddToCart = () => {
    console.log('🧪 Testing addToCart action...');
    dispatch(addToCart({
      product: {
        id: 'test_prod',
        name: 'Test Product',
        slug: 'test-product',
        description: 'Test Description',
        category: 'scooter',
        base_price: 100000,
        is_active: true,
        is_featured: false,
        rating: 4.5,
        review_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        features: [],
        specifications: [],
        variants: [],
        colors: [],
        images: [{ 
          id: 'test_img',
          image_url: '/images/placeholder.png', 
          alt_text: 'Test',
          display_order: 1,
          is_primary: true
        }]
      },
      variant: {
        id: 'test_var',
        name: 'Test Variant',
        price: 100000,
        battery_capacity: '2kWh',
        range_km: 150,
        top_speed_kmh: 110,
        acceleration_sec: 8.5,
        is_new: false,
        is_active: true
      },
      color: {
        id: 'test_col',
        name: 'Test Color',
        color_code: '#000000',
        css_filter: 'none'
      },
      accessories: []
    }));
  };
  
  // Form states
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  })
  
  const [selectedDelivery, setSelectedDelivery] = useState<string>('')
  const [selectedPayment, setSelectedPayment] = useState<string>('')
  const [orderNotes, setOrderNotes] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)
  
  // Modal states
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)

  // Delivery options
  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Free delivery to your doorstep',
      price: 0,
      estimatedDays: '5-7 business days',
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Fast delivery with tracking',
      price: 500,
      estimatedDays: '2-3 business days',
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      description: 'Pick up from nearest service center',
      price: 0,
      estimatedDays: 'Same day',
      icon: <MapPin className="w-5 h-5" />
    }
  ]

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay accepted',
      icon: <CreditCard className="w-5 h-5" />,
      available: true
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Google Pay, PhonePe, Paytm',
      icon: <Shield className="w-5 h-5" />,
      available: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: <CheckCircle className="w-5 h-5" />,
      available: true
    },
    {
      id: 'emi',
      name: 'EMI Options',
      description: 'No-cost EMI available',
      icon: <Calendar className="w-5 h-5" />,
      available: true
    }
  ]

  // Terms and Conditions content
  const termsContent = [
    {
      title: "Order Processing",
      description: "By placing an order, you agree to our terms and conditions. Orders are processed within 1-2 business days. We reserve the right to cancel orders due to stock unavailability or payment issues."
    },
    {
      title: "Payment Terms",
      description: "Payment must be made in full before delivery. We accept all major credit cards, UPI, and EMI options. Refunds will be processed within 5-7 business days if applicable."
    },
    {
      title: "Delivery & Shipping",
      description: "Delivery timelines are estimates and may vary based on location and availability. We are not responsible for delays due to weather, traffic, or other external factors."
    },
    {
      title: "Warranty & Support",
      description: "All products come with manufacturer warranty. Extended warranty options are available at additional cost. Support is provided through our customer service channels."
    },
    {
      title: "Returns & Exchanges",
      description: "Returns are accepted within 7 days of delivery for unused items in original packaging. Customized or personalized items cannot be returned. Exchange policy varies by product category."
    }
  ]

  // Privacy Policy content
  const privacyContent = [
    {
      title: "Information Collection",
      description: "We collect personal information including name, contact details, and payment information to process your orders and provide customer support. This information is used solely for order fulfillment and service improvement."
    },
    {
      title: "Data Usage",
      description: "Your personal data is used to process orders, send updates, and provide customer support. We may use your information to send promotional offers and product updates with your consent."
    },
    {
      title: "Data Protection",
      description: "We implement industry-standard security measures to protect your personal information. All payment transactions are encrypted and processed through secure payment gateways."
    },
    {
      title: "Third-Party Sharing",
      description: "We do not sell or share your personal information with third parties except for order fulfillment partners and payment processors. All partners are bound by strict confidentiality agreements."
    },
    {
      title: "Your Rights",
      description: "You have the right to access, update, or delete your personal information. You can opt out of marketing communications at any time. Contact our support team for data-related requests."
    }
  ]

  // Redirect if cart is empty (only after loading is complete)
  useEffect(() => {
    // Only check after both loading is complete AND we've attempted to load from database
    // Don't redirect if we're already redirecting (e.g., to order confirmation)
    if (!isLoadingCart && hasLoadedFromDatabase && items.length === 0 && !isRedirecting) {
      console.log('⚠️ Cart is truly empty after loading from backend, redirecting to home...');
      router.replace('/') // Use replace instead of push to prevent back navigation
      // No toast error to avoid showing "Your cart is empty" after successful orders
    } else if (!isLoadingCart && hasLoadedFromDatabase && items.length > 0) {
      console.log('✅ Cart has', items.length, 'items, showing checkout page');
    }
  }, [items.length, router, isLoadingCart, hasLoadedFromDatabase, isRedirecting])

  // Ensure page scrolls properly
  useEffect(() => {
    // Remove any overflow restrictions and ensure scrolling
    document.body.style.overflow = 'auto'
    document.body.style.overflowY = 'auto'
    document.body.style.height = 'auto'
    document.body.style.maxHeight = 'none'
    document.body.classList.remove('no-scroll')
    
    document.documentElement.style.overflow = 'auto'
    document.documentElement.style.overflowY = 'auto'
    document.documentElement.style.height = 'auto'
    document.documentElement.style.maxHeight = 'none'
    
    // Force scroll behavior
    document.body.style.position = 'static'
    document.documentElement.style.position = 'static'
    
    return () => {
      document.body.style.overflow = 'auto'
      document.body.style.overflowY = 'auto'
      document.body.style.height = 'auto'
      document.body.style.maxHeight = 'none'
      document.body.classList.remove('no-scroll')
      
      document.documentElement.style.overflow = 'auto'
      document.documentElement.style.overflowY = 'auto'
      document.documentElement.style.height = 'auto'
      document.documentElement.style.maxHeight = 'none'
      
      document.body.style.position = 'static'
      document.documentElement.style.position = 'static'
    }
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)
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

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return customerInfo.firstName && customerInfo.lastName && 
               customerInfo.email && customerInfo.phone && 
               customerInfo.address && customerInfo.city && 
               customerInfo.state && customerInfo.pincode
      case 2:
        return selectedDelivery !== ''
      case 3:
        return selectedPayment !== ''
      default:
        return false
    }
  }

  const handleNextStep = () => {
    console.log('Current step:', currentStep)
    console.log('Customer info:', customerInfo)
    console.log('Selected delivery:', selectedDelivery)
    console.log('Selected payment:', selectedPayment)
    console.log('Is step valid:', isStepValid(currentStep))
    
    if (isStepValid(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
      toast.success('Step completed successfully!')
    } else {
      // More specific error messages
      if (currentStep === 1) {
        const missingFields = []
        if (!customerInfo.firstName) missingFields.push('First Name')
        if (!customerInfo.lastName) missingFields.push('Last Name')
        if (!customerInfo.email) missingFields.push('Email')
        if (!customerInfo.phone) missingFields.push('Phone')
        if (!customerInfo.address) missingFields.push('Address')
        if (!customerInfo.city) missingFields.push('City')
        if (!customerInfo.state) missingFields.push('State')
        if (!customerInfo.pincode) missingFields.push('Pincode')
        toast.error(`Please fill in: ${missingFields.join(', ')}`)
      } else if (currentStep === 2) {
        toast.error('Please select a delivery option')
      } else if (currentStep === 3) {
        toast.error('Please select a payment method')
      } else {
        toast.error('Please fill in all required fields')
      }
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handlePlaceOrder = async () => {
    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    setIsProcessing(true)
    
    try {
      // Prepare order data
      const selectedDeliveryOption = deliveryOptions.find(opt => opt.id === selectedDelivery)
      const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedPayment)
      
      const orderData = orderService.formatOrderData(
        items,
        customerInfo,
        {
          method: selectedDeliveryOption?.name || '',
          estimatedDays: selectedDeliveryOption?.estimatedDays || '',
          fee: selectedDeliveryOption?.price || 0
        },
        {
          method: selectedPaymentMethod?.name || '',
          details: selectedPaymentMethod?.description || ''
        },
        orderNotes
      )

      // Validate order data
      const validation = orderService.validateOrderData(orderData)
      if (!validation.isValid) {
        toast.error(`Please fix the following errors: ${validation.errors.join(', ')}`)
        return
      }

      // Create order
      const order = await orderService.createOrder(orderData)
      
      // Clear cart and redirect
      dispatch(clearCart())
      setIsRedirecting(true) // Set redirecting flag to prevent empty cart error
      toast.success('Order placed successfully!')
      router.push(`/order-confirmation?orderId=${order.id}&orderNumber=${order.order_number}`)
    } catch (error) {
      console.error('Order creation failed:', error)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const getDeliveryPrice = () => {
    const option = deliveryOptions.find(opt => opt.id === selectedDelivery)
    return option?.price || 0
  }

  const getTotalPrice = () => {
    return totalPrice + getDeliveryPrice()
  }

  // Show loading state while checking cart
  if (isLoadingCart) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if cart is empty - let the redirect logic handle it
  if (items.length === 0) {
    console.log('🚫 Cart is empty, redirecting...');
    return null; // The redirect logic will handle this
  }

  console.log('✅ Rendering checkout page with items:', items.length);
  
  return (
    <AuthGuard>
      <div key={`checkout-${items.length}-${totalPrice}-${forceUpdate}`} className="min-h-screen flex flex-col max-w-full overflow-x-hidden">
        <Header />
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 checkout-page flex-1" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Checkout Progress Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">R</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">Riqueza Electric</h1>
                </div>
                <div className="text-sm text-gray-500">
                  Step {currentStep} of 4
                </div>
              </div>
            </div>
          </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6" style={{ flex: 1 }}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 flex flex-col order-2 xl:order-1">
            {/* Progress Steps */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 mb-8 mt-8">
              <div className="w-full">
                <div className="grid grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
                  {[1, 2, 3, 4].map((step, index) => (
                    <div key={step} className="flex items-center justify-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 ${
                      currentStep >= step 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white scale-110' 
                          : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
                <div className="grid grid-cols-4 gap-4 w-full max-w-4xl mx-auto mt-4 text-sm text-gray-600 font-medium">
                  <span className="text-center text-xs sm:text-sm">Customer Details</span>
                  <span className="text-center text-xs sm:text-sm">Delivery</span>
                  <span className="text-center text-xs sm:text-sm">Payment</span>
                  <span className="text-center text-xs sm:text-sm">Review</span>
                </div>
              </div>
            </div>

            {/* Step Content */}
            {currentStep === 1 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        customerInfo.firstName ? 'border-green-400 bg-green-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        customerInfo.lastName ? 'border-green-400 bg-green-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        customerInfo.email ? 'border-green-400 bg-green-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        customerInfo.phone ? 'border-green-400 bg-green-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Address *
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                        customerInfo.address ? 'border-green-400 bg-green-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your complete address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      City *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        customerInfo.city ? 'border-green-400 bg-green-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      State *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        customerInfo.state ? 'border-green-400 bg-green-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={customerInfo.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        customerInfo.pincode ? 'border-green-400 bg-green-50 shadow-sm' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter pincode"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerInfo.landmark}
                      onChange={(e) => handleInputChange('landmark', e.target.value)}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Delivery Options
                </h2>
                <div className="space-y-4">
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedDelivery === option.id
                          ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedDelivery(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                            selectedDelivery === option.id
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}>
                            {option.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">{option.name}</h3>
                            <p className="text-sm text-gray-600 font-medium">{option.description}</p>
                            <p className="text-sm text-gray-500">{option.estimatedDays}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {option.price === 0 ? 'Free' : formatPrice(option.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedPayment === method.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => method.available && setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          selectedPayment === method.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                
                {/* Customer Details Review */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Delivery Address</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">
                      {customerInfo.firstName} {customerInfo.lastName}
                    </p>
                    <p className="text-gray-600">{customerInfo.address}</p>
                    <p className="text-gray-600">
                      {customerInfo.city}, {customerInfo.state} - {customerInfo.pincode}
                    </p>
                    <p className="text-gray-600">{customerInfo.phone}</p>
                    <p className="text-gray-600">{customerInfo.email}</p>
                  </div>
                </div>

                {/* Delivery Method Review */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Delivery Method</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {(() => {
                      const option = deliveryOptions.find(opt => opt.id === selectedDelivery)
                      return option ? (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{option.name}</p>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {option.price === 0 ? 'Free' : formatPrice(option.price)}
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                </div>

                {/* Payment Method Review */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {(() => {
                      const method = paymentMethods.find(m => m.id === selectedPayment)
                      return method ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                            {method.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-600">{method.description}</p>
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                </div>

                {/* Order Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">
                      I agree to the{' '}
                      <button 
                        type="button"
                        onClick={() => setIsTermsModalOpen(true)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Terms and Conditions
                      </button>{' '}
                      and{' '}
                      <button 
                        type="button"
                        onClick={() => setIsPrivacyModalOpen(true)}
                        className="text-blue-600 hover:underline cursor-pointer"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className={`px-6 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                  currentStep === 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  disabled={!isStepValid(currentStep)}
                  className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isStepValid(currentStep)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Next Step
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={!agreeTerms || isProcessing}
                  className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    agreeTerms && !isProcessing
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Place Order
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="xl:col-span-1 flex flex-col order-1 xl:order-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 lg:p-8 sticky mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Order Summary
              </h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div key={item.id} className={`border-b border-gray-100 pb-4 last:border-b-0 ${index > 0 ? 'mt-4' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                        <img
                          src={item.product.images?.[0]?.image_url || '/images/placeholder.png'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          style={{ 
                            filter: item.color?.css_filter || 'none' 
                          }}
                          onError={(e) => {
                            e.currentTarget.src = '/images/placeholder.png';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-base leading-tight mb-3">
                          {item.product.name}
                        </h4>
                        
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
                              <span className="text-xs font-medium text-gray-700">Speed</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              {item.variant.top_speed_kmh} km/h
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Qty: {item.quantity}</span>
                          <span className="font-bold text-gray-900 text-lg">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                        
                        {/* Add-ons */}
                        {item.addOns && item.addOns.length > 0 && (
                          <div className="mt-3">
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
                          <div className="mt-3">
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
                          <div className="mt-3">
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>
                    {selectedDelivery ? (
                      (() => {
                        const option = deliveryOptions.find(opt => opt.id === selectedDelivery)
                        return option ? (option.price === 0 ? 'Free' : formatPrice(option.price)) : 'Select delivery'
                      })()
                    ) : (
                      'Select delivery'
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(getTotalPrice())}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
        </div>
        <Footer />
      </div>

    {/* Terms and Conditions Modal */}
    <InfoModal
      isOpen={isTermsModalOpen}
      onClose={() => setIsTermsModalOpen(false)}
      title="Terms and Conditions"
      sections={termsContent}
      buttonText="I Understand"
    />

    {/* Privacy Policy Modal */}
    <InfoModal
      isOpen={isPrivacyModalOpen}
      onClose={() => setIsPrivacyModalOpen(false)}
      title="Privacy Policy"
      sections={privacyContent}
      buttonText="I Understand"
    />
    </AuthGuard>
  )
}

export default CheckoutPage
