'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { addToCart } from '@/store/slices/cartSlice'
import MoveOSDetailsModal from './MoveOSDetailsModal'
import EssentialCareModal from './EssentialCareModal'
import OlaCareModal from './OlaCareModal'
import ExtendedWarrantyModal from './ExtendedWarrantyModal'
import InsuranceModal from './InsuranceModal'

interface AddOnsModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: (combinedAccessories: any[]) => void
  moveOSAdded: boolean
  setMoveOSAdded: (added: boolean) => void
  selectedVariant?: string
  selectedColor?: string
  selectedAccessories?: any[]
}

const AddOnsModal = ({ isOpen, onClose, onContinue, moveOSAdded, setMoveOSAdded, selectedVariant, selectedColor, selectedAccessories }: AddOnsModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedProduct } = useSelector((state: RootState) => state.products)
  
  const [addedAddOns, setAddedAddOns] = useState<Record<string, boolean>>({
    extendedWarranty: true, // Extended Warranty is pre-added as shown in screenshot
    essentialCare: false,
    olaCarePlus: false
  })
  const [isMoveOSDetailsModalOpen, setIsMoveOSDetailsModalOpen] = useState(false)
  const [isEssentialCareModalOpen, setIsEssentialCareModalOpen] = useState(false)
  const [isOlaCareModalOpen, setIsOlaCareModalOpen] = useState(false)
  const [isExtendedWarrantyModalOpen, setIsExtendedWarrantyModalOpen] = useState(false)
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false)
  const [combinedAccessories, setCombinedAccessories] = useState<any[]>(selectedAccessories || [])
  
  // Debug logging for state changes
  useEffect(() => {
    console.log('🔧 AddOnsModal - addedAddOns state:', addedAddOns)
    console.log('🔧 AddOnsModal - moveOSAdded:', moveOSAdded)
    console.log('🔧 AddOnsModal - combinedAccessories:', combinedAccessories)
  }, [addedAddOns, moveOSAdded, combinedAccessories])

  // Initialize combined accessories with selectedAccessories on first load only
  useEffect(() => {
    if (selectedAccessories && combinedAccessories.length === 0) {
      console.log('🔧 Initializing combinedAccessories with selectedAccessories:', selectedAccessories)
      setCombinedAccessories(selectedAccessories)
    }
  }, []) // Empty dependency array to run only once

  const addOnsData = [
    {
      id: 'moveOS',
      title: 'MoveOS+',
      description: 'Gives you improved range, acceleration, top speed and 20+ tech features.',
      price: '7626',
      hasGST: true,
      imageUrl: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/dropIcon/moveos_image.png',
      titleImageUrl: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/zeroOrder/addOnMovetitlte.svg'
    },
    {
      id: 'essentialCare',
      title: 'OLA Essential Care',
      description: 'Keep your vehicle running smoothly with a structured service schedule.',
      price: '2397',
      hasGST: true,
      imageUrl: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/zeroOrder/addOnnCareIMG.png',
      titleImageUrl: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/zeroOrder/Ola+Essential.svg'
    },
    {
      id: 'olaCarePlus',
      title: 'OLA CARE+',
      description: 'Get unlimited, free home service, 24x7 roadside and medical assistance for a year.',
      price: '1749',
      oldPrice: '3499',
      hasGST: true,
      imageUrl: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/zeroOrder/addOnnEssentialIMG.png',
      titleImageUrl: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/zeroOrder/addOnnOlaCare%2B.svg'
    },
    {
      id: 'extendedWarranty',
      title: 'Extended Warranty',
      description: 'Get up to 8 years or 80,000km on the Ola S1.',
      price: '7079',
      hasGST: false,
      imageUrl: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/zeroOrder/addOnnEWIMG.png',
      titleImageUrl: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/zeroOrder/addOnExtendedWarranty.svg'
    }
  ]

  const toggleAddOn = (id: string) => {
    console.log('🔧 Toggling add-on:', id)
    
    if (id === 'moveOS') {
      // Open MoveOS details modal instead of toggling directly
      setIsMoveOSDetailsModalOpen(true)
    } else if (id === 'essentialCare') {
      // Open Essential Care details modal instead of toggling directly
      setIsEssentialCareModalOpen(true)
    } else if (id === 'olaCarePlus') {
      // Open OLA CARE+ details modal instead of toggling directly
      setIsOlaCareModalOpen(true)
    } else if (id === 'extendedWarranty') {
      // Open Extended Warranty details modal instead of toggling directly
      setIsExtendedWarrantyModalOpen(true)
    } else {
      setAddedAddOns(prev => {
        const newState = {
          ...prev,
          [id]: !prev[id]
        }
        console.log('🔧 Updated addedAddOns:', newState)
        return newState
      })
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleAddOnsToCart = () => {
    console.log('🔧 handleAddOnsToCart called')
    console.log('🔧 selectedProduct:', selectedProduct)
    console.log('🔧 moveOSAdded:', moveOSAdded)
    console.log('🔧 addedAddOns:', addedAddOns)
    console.log('🔧 selectedAccessories:', selectedAccessories)
    
    if (!selectedProduct || !selectedProduct.variants || !selectedProduct.colors) {
      console.error('❌ No product selected for add-ons')
      return
    }

    // Get the actual selected variant and color
    const variant = selectedProduct.variants.find(v => v.id === selectedVariant) || selectedProduct.variants[0]
    const color = selectedProduct.colors.find(c => c.id === selectedColor) || selectedProduct.colors[0]
    
    if (!variant || !color) {
      console.error('❌ Variant or color not found')
      return
    }

    // Create accessories from selected add-ons
    const addOnAccessories = []
    
    // Add MoveOS+ if selected
    if (moveOSAdded) {
      console.log('🔧 Adding MoveOS+ to accessories')
      addOnAccessories.push({
        id: 'moveos-plus',
        name: 'MoveOS+',
        description: 'Gives you improved range, acceleration, top speed and 20+ tech features.',
        price: 7626,
        image_url: 'https://assets.olaelectric.com/olaelectric-videos/configs-static/assets/dropIcon/moveos_image.png',
        type: 'addon'
      })
    }

    // Add other selected add-ons
    Object.entries(addedAddOns).forEach(([addOnId, isSelected]) => {
      console.log(`🔧 Processing add-on ${addOnId}: ${isSelected}`)
      if (isSelected) {
        const addOnData = addOnsData.find(addon => addon.id === addOnId)
        if (addOnData) {
          console.log(`🔧 Adding ${addOnData.title} to accessories`)
          addOnAccessories.push({
            id: addOnId,
            name: addOnData.title,
            description: addOnData.description,
            price: parseInt(addOnData.price),
            image_url: addOnData.imageUrl,
            type: 'addon'
          })
        }
      }
    })

    // Combine with existing accessories
    const allAccessories = [...(selectedAccessories || []), ...addOnAccessories]

    // Store the combined accessories in state to pass to InsuranceModal
    setCombinedAccessories(allAccessories)
    
    console.log('✅ Add-ons prepared:', addOnAccessories)
    console.log('✅ Combined accessories:', allAccessories)
    console.log('🔧 Setting combinedAccessories to:', allAccessories)
    
    // Continue to insurance modal with combined accessories
    onContinue(allAccessories)
  }

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-[60] overflow-hidden" 
        style={{ height: '100vh', margin: 0, padding: 0 }}
        onClick={handleBackdropClick}
      >
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
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <img 
                  src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/backButton.svg"
                  alt="back"
                  className="w-6 h-6"
                />
              </button>
            </div>

            {/* Header */}
            <div className="text-center text-xl font-bold text-gray-900 mt-24 px-4 mb-8">
              Choose Add-Ons
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6">
              {/* Add-Ons Grid */}
              <div className="grid grid-cols-1 gap-4">
                {addOnsData.map((addon) => (
                  <div key={addon.id} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                    {/* Add-On Image */}
                    <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-2">
                      <img
                        src={addon.imageUrl}
                        alt={addon.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Add-On Details */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Title */}
                      <div className="mb-2">
                        <img
                          src={addon.titleImageUrl}
                          alt={addon.title}
                          className="h-5 object-contain"
                        />
                      </div>
                      
                      {/* Description */}
                      <div className="text-sm text-gray-600 mb-4 flex-1 leading-relaxed">
                        {addon.description}
                      </div>
                      
                      {/* Price */}
                      <div className="mb-4">
                        {addon.oldPrice ? (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 line-through">
                              ₹ {parseInt(addon.oldPrice).toLocaleString('en-IN')}
                            </div>
                            <div className="text-base font-bold text-gray-900">
                              ₹ {parseInt(addon.price).toLocaleString('en-IN')}
                              {addon.hasGST && <span className="text-sm text-gray-500"> + GST</span>}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500">Starting at</div>
                            <div className="text-base font-bold text-gray-900">
                              ₹ {parseInt(addon.price).toLocaleString('en-IN')}
                              {addon.hasGST && <span className="text-sm text-gray-500"> + GST</span>}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Add/Added Button */}
                      <button
                        onClick={() => toggleAddOn(addon.id)}
                        className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                          (addon.id === 'moveOS' ? moveOSAdded : addedAddOns[addon.id])
                            ? 'bg-green-100 text-green-700 border border-green-300 flex items-center justify-center gap-1'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {(addon.id === 'moveOS' ? moveOSAdded : addedAddOns[addon.id]) ? (
                          <>
                            <img 
                              src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/tickGreen.svg"
                              alt="tick"
                              className="w-4 h-4"
                            />
                            Added
                          </>
                        ) : (
                          'Add'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={handleAddOnsToCart}
                className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
        
        {/* Desktop: Right panel overlay */}
        <div className="hidden lg:block absolute left-0 w-full h-full bg-transparent" style={{ width: 'calc(100% - 400px)' }}>
          {/* This space is intentionally left empty to allow the underlying BuyNow modal's left section to remain interactive */}
        </div>
        
        {/* Desktop Right modal panel */}
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
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <img 
                src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/backButton.svg"
                alt="back"
                className="w-6 h-6"
              />
            </button>
          </div>

          {/* Header */}
          <div className="text-center text-xl font-bold text-gray-900 mt-24 px-4 mb-8">
            Choose Add-Ons
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-6">
            {/* Add-Ons Grid */}
            <div className="grid grid-cols-1 gap-4">
              {addOnsData.map((addon) => (
                <div key={addon.id} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                  {/* Add-On Image */}
                  <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-2">
                    <img
                      src={addon.imageUrl}
                      alt={addon.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Add-On Details */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Title */}
                    <div className="mb-2">
                      <img
                        src={addon.titleImageUrl}
                        alt={addon.title}
                        className="h-5 object-contain"
                      />
                    </div>
                    
                    {/* Description */}
                    <div className="text-sm text-gray-600 mb-4 flex-1 leading-relaxed">
                      {addon.description}
                    </div>
                    
                    {/* Price */}
                    <div className="mb-4">
                      {addon.oldPrice ? (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 line-through">
                            ₹ {parseInt(addon.oldPrice).toLocaleString('en-IN')}
                          </div>
                          <div className="text-base font-bold text-gray-900">
                            ₹ {parseInt(addon.price).toLocaleString('en-IN')}
                            {addon.hasGST && <span className="text-sm text-gray-500"> + GST</span>}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500">Starting at</div>
                          <div className="text-base font-bold text-gray-900">
                            ₹ {parseInt(addon.price).toLocaleString('en-IN')}
                            {addon.hasGST && <span className="text-sm text-gray-500"> + GST</span>}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Add/Added Button */}
                    <button
                      onClick={() => toggleAddOn(addon.id)}
                      className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        (addon.id === 'moveOS' ? moveOSAdded : addedAddOns[addon.id])
                          ? 'bg-green-100 text-green-700 border border-green-300 flex items-center justify-center gap-1'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {(addon.id === 'moveOS' ? moveOSAdded : addedAddOns[addon.id]) ? (
                        <>
                          <img 
                            src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/tickGreen.svg"
                            alt="tick"
                            className="w-4 h-4"
                          />
                          Added
                        </>
                      ) : (
                        'Add'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixed Bottom Section */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
            <button
              onClick={handleAddOnsToCart}
              className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Continue
            </button>
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

      {/* Essential Care Modal */}
      <EssentialCareModal
        isOpen={isEssentialCareModalOpen}
        onClose={() => setIsEssentialCareModalOpen(false)}
        onAdd={() => {
          console.log('🔧 Essential Care - Adding to cart')
          setIsEssentialCareModalOpen(false)
          setAddedAddOns(prev => {
            const newState = {
              ...prev,
              essentialCare: true
            }
            console.log('🔧 Essential Care - Updated state:', newState)
            return newState
          })
        }}
        onRemove={() => {
          console.log('🔧 Essential Care - Removing from cart')
          setAddedAddOns(prev => {
            const newState = {
              ...prev,
              essentialCare: false
            }
            console.log('🔧 Essential Care - Updated state:', newState)
            return newState
          })
        }}
        onContinue={() => {
          setIsEssentialCareModalOpen(false)
          // Continue to next step
        }}
        isAdded={addedAddOns.essentialCare || false}
      />

      {/* OLA CARE+ Modal */}
      <OlaCareModal
        isOpen={isOlaCareModalOpen}
        onClose={() => setIsOlaCareModalOpen(false)}
        onAdd={() => {
          console.log('🔧 OLA CARE+ - Adding to cart')
          setIsOlaCareModalOpen(false)
          setAddedAddOns(prev => {
            const newState = {
              ...prev,
              olaCarePlus: true
            }
            console.log('🔧 OLA CARE+ - Updated state:', newState)
            return newState
          })
        }}
        onRemove={() => {
          console.log('🔧 OLA CARE+ - Removing from cart')
          setAddedAddOns(prev => {
            const newState = {
              ...prev,
              olaCarePlus: false
            }
            console.log('🔧 OLA CARE+ - Updated state:', newState)
            return newState
          })
        }}
        onContinue={() => {
          setIsOlaCareModalOpen(false)
          // Continue to next step
        }}
        isAdded={addedAddOns.olaCarePlus || false}
      />

      {/* Extended Warranty Modal */}
      <ExtendedWarrantyModal
        isOpen={isExtendedWarrantyModalOpen}
        onClose={() => setIsExtendedWarrantyModalOpen(false)}
        onAdd={() => {
          setIsExtendedWarrantyModalOpen(false)
          setAddedAddOns(prev => ({
            ...prev,
            extendedWarranty: true
          }))
        }}
        onRemove={() => {
          setAddedAddOns(prev => ({
            ...prev,
            extendedWarranty: false
          }))
        }}
        onContinue={() => {
          setIsExtendedWarrantyModalOpen(false)
          // Continue to next step
        }}
        isAdded={addedAddOns.extendedWarranty || false}
      />

      {/* Insurance Modal */}
      <InsuranceModal
        isOpen={isInsuranceModalOpen}
        onClose={() => setIsInsuranceModalOpen(false)}
        onContinue={() => {
          setIsInsuranceModalOpen(false)
          onContinue([]) // Continue to next step in the flow
        }}
        selectedVariant={selectedVariant}
        selectedColor={selectedColor}
        selectedAccessories={combinedAccessories}
      />
    </>
  )
}

export default AddOnsModal
