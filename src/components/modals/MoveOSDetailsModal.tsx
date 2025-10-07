'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { addToCart } from '@/store/slices/cartSlice'

interface MoveOSDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  moveOSAdded: boolean
  setMoveOSAdded: (added: boolean) => void
}

const MoveOSDetailsModal = ({ isOpen, onClose, moveOSAdded, setMoveOSAdded }: MoveOSDetailsModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedProduct } = useSelector((state: RootState) => state.products)
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false)
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleRemoveClick = () => {
    setShowRemoveConfirmation(true)
  }

  const handleConfirmRemove = () => {
    // Handle the actual removal logic here
    console.log('MoveOS+ removed')
    setMoveOSAdded(false) // Remove MoveOS+
    setShowRemoveConfirmation(false)
    onClose() // Close the main modal after removal
  }

  const handleCancelRemove = () => {
    setShowRemoveConfirmation(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowRemoveConfirmation(false)
    }
  }

  const handleAddMoveOSToCart = () => {
    if (!selectedProduct || !selectedProduct.variants || !selectedProduct.colors) {
      console.error('❌ No product selected for MoveOS+')
      return
    }

    // Get the first variant and color (or use selected ones if available)
    const variant = selectedProduct.variants[0]
    const color = selectedProduct.colors[0]
    
    if (!variant || !color) {
      console.error('❌ Variant or color not found')
      return
    }

    // Create MoveOS+ accessory
    const moveOSAccessory = {
      id: 'moveos-plus',
      name: 'MoveOS+',
      description: 'Gives you improved range, acceleration, top speed and 20+ tech features.',
      price: 7626,
      image_url: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/dropIcon/moveos_image.png',
      is_active: true
    }

    // Add to cart with MoveOS+ as accessory
    dispatch(addToCart({
      product: selectedProduct,
      variant,
      color,
      accessories: [moveOSAccessory]
    }))

    console.log('✅ MoveOS+ added to cart:', moveOSAccessory)
  }

  const features = [
    {
      type: 'image',
      src: '/images/MoveOS/hyper.png',
      title: 'Hyper, Sports & Eco Mode',
      subtitle: 'Enjoy improved range, speed & more with 3 extra ride modes.'
    },
    {
      type: 'image',
      src: '/images/MoveOS/diy.png',
      title: 'DIY Mode',
      subtitle: 'Design your own mode for full ride control.'
    },
    {
      type: 'image',
      src: '/images/MoveOS/cruise.png',
      title: 'Cruise Control',
      subtitle: 'Enjoy rides on empty roads with Cruise Control.'
    },
    {
      type: 'image',
      src: '/images/MoveOS/Regeme.png',
      title: 'Advanced regen',
      subtitle: 'Increase range as you drive with Advanced Regeneration'
    },
    {
      type: 'video',
      src: '/images/MoveOS/Hill+Hold+Downhill.mp4',
      title: 'Hill hold',
      subtitle: 'Hill hold assist on slopes, uphill or downhill.'
    },
    {
      type: 'video',
      src: '/images/MoveOS/proximity.mp4',
      title: 'App based Lock & Unlock',
      subtitle: 'Unlock your S1 via the app or automatically with Proximity.'
    },
    {
      type: 'image',
      src: '/images/MoveOS/navigation.png',
      title: 'Navigation powered by Riqueza Maps',
      subtitle: 'Navigate easily with on-screen directions from Riqueza Maps.'
    },
    {
      type: 'image',
      src: '/images/MoveOS/beat+access.png',
      title: 'Early Beta Access',
      subtitle: 'Get early access to the latest MoveOS updates'
    },
    {
      type: 'image',
      src: '/images/MoveOS/moveOs.png',
      title: 'Move OS',
      subtitle: 'Access to premium features in future MoveOS updates'
    }
  ]

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-[60] overflow-hidden" style={{ height: '100vh', margin: 0, padding: 0 }}>
        {/* Mobile: Full screen overlay */}
        <div className="lg:hidden absolute inset-0 bg-white">
          <div className="w-full h-full flex flex-col bg-white"
            style={{
              backgroundImage: `url("https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/olaCardBackground4.png")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top center',
              backgroundColor: '#f7fbfe'
            }}
          >
            {/* Back Button */}
            <div className="absolute top-4 left-4 z-10">
              <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                <img 
                  src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/backButton.svg"
                  alt="back"
                  className="w-6 h-6"
                />
              </button>
            </div>

            {/* MoveOS+ Logo */}
            <div className="mt-16 flex justify-center">
              <Image
                src="/images/MoveOS/move-os-plus-logo3.svg"
                alt="MoveOS+"
                width={96}
                height={32}
              />
            </div>

            {/* Header */}
            <div className="text-center text-xl font-bold text-gray-900 mt-4 px-4">
              Give your vehicle a tech upgrade
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Horizontal Scrollable Features */}
              <div className="mt-8 px-4">
                <div 
                  className="flex gap-4 overflow-x-auto pb-4" 
                  style={{ 
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#d1d5db #f3f4f6',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {features.map((feature, index) => (
                    <div key={index} className="flex-shrink-0 w-56">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-3">
                          {feature.type === 'image' ? (
                            <img
                              src={feature.src}
                              alt={feature.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video 
                              playsInline 
                              loop 
                              autoPlay 
                              muted 
                              className="w-full h-full object-cover"
                            >
                              <source src={feature.src} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-1">
                          {feature.title}
                        </div>
                        <div className="text-xs text-gray-600">
                          {feature.subtitle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Specification Image */}
              <div className="px-4 mt-8 pb-4">
                <img
                  src="/images/MoveOS/S1_pro_updated_spec.png"
                  alt="Specifications"
                  className="w-full"
                />
              </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
              {moveOSAdded ? (
                /* Added State - Show Remove Option */
                <>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <img
                      src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/planAddedCheck.svg"
                      alt="check"
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Lifetime plan added</span>
                    <img
                      src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/dot.svg"
                      alt="dot"
                      className="w-1 h-1"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      <span className="text-xs">₹</span>7,626
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveClick}
                    className="w-full py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </>
              ) : (
                /* Not Added State - Show Add Option */
                <button
                  onClick={() => {
                    handleAddMoveOSToCart()
                    setMoveOSAdded(true)
                    onClose()
                  }}
                  className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Add MoveOS+ • ₹7,626
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Desktop: Left overlay - transparent to allow scooter interaction */}
        <div className="hidden lg:block absolute left-0 w-full h-full bg-transparent" style={{ width: 'calc(100% - 384px)' }}></div>
        
        {/* Desktop: Right modal panel */}
        <div 
          className="hidden lg:flex absolute right-0 w-96 h-full flex flex-col bg-white"
          style={{
            backgroundImage: `url("https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/olaCardBackground4.png")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            backgroundColor: '#f7fbfe'
          }}
        >
        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <img 
              src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/backButton.svg"
              alt="back"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* MoveOS+ Logo */}
        <div className="mt-16 flex justify-center">
          <Image
            src="/images/MoveOS/move-os-plus-logo3.svg"
            alt="MoveOS+"
            width={96}
            height={32}
          />
        </div>

        {/* Header */}
        <div className="text-center text-xl font-bold text-gray-900 mt-4 px-4">
          Give your vehicle a tech upgrade
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Horizontal Scrollable Features */}
          <div className="mt-8 px-4">
            <div 
              className="flex gap-4 overflow-x-auto pb-4" 
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: '#d1d5db #f3f4f6',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {features.map((feature, index) => (
                <div key={index} className="flex-shrink-0 w-56">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100 mb-3">
                      {feature.type === 'image' ? (
                        <img
                          src={feature.src}
                          alt={feature.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video 
                          playsInline 
                          loop 
                          autoPlay 
                          muted 
                          className="w-full h-full object-cover"
                        >
                          <source src={feature.src} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {feature.subtitle}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Specification Image */}
          <div className="px-4 mt-8 pb-4">
            <img
              src="/images/MoveOS/S1_pro_updated_spec.png"
              alt="Specifications"
              className="w-full"
            />
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
          {moveOSAdded ? (
            /* Added State - Show Remove Option */
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <img
                  src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/planAddedCheck.svg"
                  alt="check"
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-gray-900">Lifetime plan added</span>
                <img
                  src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/dot.svg"
                  alt="dot"
                  className="w-1 h-1"
                />
                <span className="text-sm font-semibold text-gray-900">
                  <span className="text-xs">₹</span>7,626
                </span>
              </div>
              <button
                onClick={handleRemoveClick}
                className="w-full py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Remove
              </button>
            </>
          ) : (
            /* Not Added State - Show Add Option */
            <button
              onClick={() => {
                handleAddMoveOSToCart()
                setMoveOSAdded(true)
                onClose()
              }}
              className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Add MoveOS+ • ₹7,626
            </button>
          )}
        </div>
      </div>
      </div>

      {/* Remove Confirmation Modal - Outside of MoveOS modal container */}
      {showRemoveConfirmation && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{ zIndex: 70 }}
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex-1">
                Are you sure you want to remove MoveOS+?
              </h3>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-600">!</span>
              </div>
            </div>

            {/* Modal Content */}
            <p className="text-gray-600 mb-6">
              You'll lose access to improved range, acceleration, top speed and 20+ tech features.
            </p>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleCancelRemove}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                No
              </button>
              <button
                onClick={handleConfirmRemove}
                className="flex-1 py-3 px-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MoveOSDetailsModal
