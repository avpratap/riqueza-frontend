'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { orderService, Order, OrderItem } from '@/lib/orderService'
import { convertOrderItemsToCategorized, OrderItemWithCategorizedAccessories } from '@/lib/orderItemConverter'
import { CheckCircle, Package, Truck, CreditCard, MapPin, Phone, Mail, Calendar, ChevronDown, ChevronUp, Star } from 'lucide-react'
import Link from 'next/link'
import AuthGuard from '@/components/auth/AuthGuard'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const OrderConfirmationPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('orderId')
  const orderNumber = searchParams.get('orderNumber')
  
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItemWithCategorizedAccessories[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId && !orderNumber) {
        setError('Order ID or Order Number is required')
        setLoading(false)
        return
      }

      try {
        let orderData
        if (orderId) {
          orderData = await orderService.getOrderById(orderId)
        } else if (orderNumber) {
          orderData = await orderService.getOrderByNumber(orderNumber)
        }
        
        if (orderData) {
          setOrder(orderData.order)
          // Convert order items to have categorized accessories
          const categorizedItems = convertOrderItemsToCategorized(orderData.items)
          setOrderItems(categorizedItems)
        } else {
          setError('Order not found')
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, orderNumber])

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

  const getHueRotation = (colorCode: string) => {
    // Convert hex color to hue rotation for CSS filter
    if (!colorCode || !colorCode.startsWith('#')) return 0
    
    const hex = colorCode.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    
    // Convert RGB to HSL and return hue
    const max = Math.max(r, g, b) / 255
    const min = Math.min(r, g, b) / 255
    const diff = max - min
    
    let hue = 0
    if (diff !== 0) {
      if (max === r / 255) hue = ((g - b) / 255) / diff
      else if (max === g / 255) hue = 2 + ((b - r) / 255) / diff
      else hue = 4 + ((r - g) / 255) / diff
    }
    
    return Math.round(hue * 60)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'confirmed':
        return 'text-blue-600 bg-blue-100'
      case 'processing':
        return 'text-purple-600 bg-purple-100'
      case 'shipped':
        return 'text-orange-600 bg-orange-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col max-w-full overflow-x-hidden">
        <Header hideCenterAndRight={true} />
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 flex-1">
          {/* Order Confirmation Header */}
          <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Riqueza Electric</h1>
                </div>
              </div>
            </div>
          </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-8 mb-8 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-blue-50 opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-6 text-lg">
              Thank you for choosing Riqueza Electric! We'll send you a confirmation email shortly.
            </p>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 inline-block shadow-md">
              <p className="text-sm text-gray-500 mb-2">Order Number</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {order.order_number}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Order Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Order Status
              </h2>
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium shadow-md ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Order placed on {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Order Items
              </h2>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mx-auto sm:mx-0 overflow-hidden">
                      {item.product_images && item.product_images.length > 0 ? (
                        <img
                          src={item.product_images[0].image_url}
                          alt={item.product_images[0].alt_text || item.product_name}
                          className="w-full h-full object-cover rounded-xl"
                          style={{ 
                            filter: item.color_code ? `hue-rotate(${getHueRotation(item.color_code)})` : 'none' 
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center" style={{ display: item.product_images && item.product_images.length > 0 ? 'none' : 'flex' }}>
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 text-center sm:text-left">
                        {item.product_name || `Product ${item.product_id}`}
                      </h3>
                      {/* Product Specifications */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color_code || '#000' }}></div>
                            <span className="text-xs font-medium text-gray-700">Color</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{item.color_name || item.color_id}</p>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">Battery</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">{item.variant_name || item.variant_id}</p>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">Range</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.variant_name?.includes('2kWh') ? '150 km' : item.variant_name?.includes('5.2kWh') ? '195 km' : 'N/A'}
                          </p>
                        </div>
                        
                        <div className="bg-orange-50 rounded-lg p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">Top Speed</span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.variant_name?.includes('2kWh') ? '110 km/h' : item.variant_name?.includes('5.2kWh') ? '120 km/h' : 'N/A'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-4 mb-3">
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          {formatPrice(item.unit_price)} each
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
                    <div className="text-center sm:text-right flex-shrink-0 w-full sm:w-auto">
                      <p className="font-semibold text-gray-900 text-lg">{formatPrice(item.total_price)}</p>
                      <p className="text-sm text-gray-500">{formatPrice(item.unit_price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.customer_info.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{order.customer_info.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium text-gray-900">
                      {order.customer_info.firstName} {order.customer_info.lastName}
                    </p>
                    <p className="text-gray-600">{order.customer_info.address}</p>
                    <p className="text-gray-600">
                      {order.customer_info.city}, {order.customer_info.state} - {order.customer_info.pincode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Order Summary
              </h3>
              
              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>{order.delivery_fee === 0 ? 'Free' : formatPrice(order.delivery_fee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(order.final_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Order Date: {new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Delivery: {order.delivery_info.method}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment: {order.payment_info.method}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <Link
                  href="/"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Continue Shopping</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span>Print Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  )
}

export default OrderConfirmationPage