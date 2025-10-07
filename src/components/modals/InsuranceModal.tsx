'use client'

import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ChevronUp, Info, ShoppingCart, CreditCard } from 'lucide-react'
import { RootState, AppDispatch } from '@/store/store'
import { addToCart } from '@/store/slices/cartSlice'
import { closeBuyNowModal } from '@/store/slices/uiSlice'
import Link from 'next/link'
import InfoModal from './InfoModal'
import SoftWarningModal from './SoftWarningModal'
import PdfModal from './PdfModal'
import DamagePlanCard from '../cards/DamagePlanCard'

interface InsuranceModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: () => void
  selectedVariant?: string
  selectedColor?: string
  selectedAccessories?: any[]
}

// Move data outside component to avoid initialization issues
const insuranceProviders = [
  { id: 'digit', name: 'DIGIT', logo: 'https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/purchase/digit.svg' },
  { id: 'icici', name: 'ICICI LOMBARD', logo: 'https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/purchase/iciciLombard.svg' },
  { id: 'bajaj', name: 'BAJAJ ALLIANZ', logo: 'https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/purchase/bajaj_allianz.svg' },
  { id: 'reliance', name: 'RELIANCE', logo: 'https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/purchase/RIG.svg' },
  { id: 'tata', name: 'TATA AIG', logo: 'https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/purchase/TATA_AIG.svg' }
]

// Damage plans data for each provider
const damagePlansData = {
  digit: [
    { id: '1year', duration: '1 Year', description: 'Basic protection for a year, with yearly renewal.', price: 10575, originalPrice: null, savings: null, recommended: false },
    { id: '2year', duration: '2 Year', description: 'Extended protection for two years, with better savings.', price: 18990, originalPrice: 21150, savings: '10% Savings', recommended: false },
    { id: '3year', duration: '3 Year', description: 'Long-term protection with maximum savings.', price: 26460, originalPrice: 31725, savings: '17% Savings', recommended: true }
  ],
  icici: [
    { id: '1year', duration: '1 Year', description: 'Basic protection for a year, with yearly renewal.', price: 11054, originalPrice: null, savings: null, recommended: false },
    { id: '5year', duration: '5 Year', description: '5 years of peace of mind, savings, and no renewals.', price: 16240, originalPrice: 21653, savings: '25% Savings', recommended: true },
    { id: '3year', duration: '3 Year', description: 'Mid-term protection with good savings.', price: 28950, originalPrice: 33162, savings: '13% Savings', recommended: false }
  ],
  bajaj: [
    { id: '1year', duration: '1 Year', description: 'Basic protection for a year, with yearly renewal.', price: 10823, originalPrice: null, savings: null, recommended: false },
    { id: '2year', duration: '2 Year', description: 'Extended protection for two years, with better savings.', price: 19450, originalPrice: 21646, savings: '10% Savings', recommended: false },
    { id: '3year', duration: '3 Year', description: 'Long-term protection with maximum savings.', price: 27120, originalPrice: 32469, savings: '16% Savings', recommended: true }
  ],
  reliance: [
    { id: '1year', duration: '1 Year', description: 'Basic protection for a year, with yearly renewal.', price: 10662, originalPrice: null, savings: null, recommended: false },
    { id: '2year', duration: '2 Year', description: 'Extended protection for two years, with better savings.', price: 19150, originalPrice: 21324, savings: '10% Savings', recommended: false },
    { id: '3year', duration: '3 Year', description: 'Long-term protection with maximum savings.', price: 26720, originalPrice: 31986, savings: '16% Savings', recommended: true },
    { id: '4year', duration: '4 Year', description: 'Extended protection for four years, with great savings.', price: 34000, originalPrice: 42648, savings: '20% Savings', recommended: false },
    { id: '5year', duration: '5 Year', description: 'Maximum protection for five years, with best savings.', price: 41000, originalPrice: 53310, savings: '23% Savings', recommended: false }
  ],
  tata: [
    { id: '1year', duration: '1 Year', description: 'Basic protection for a year, with yearly renewal.', price: 10964, originalPrice: null, savings: null, recommended: false },
    { id: '2year', duration: '2 Year', description: 'Extended protection for two years, with better savings.', price: 19720, originalPrice: 21928, savings: '10% Savings', recommended: false },
    { id: '3year', duration: '3 Year', description: 'Long-term protection with maximum savings.', price: 27500, originalPrice: 32892, savings: '16% Savings', recommended: true }
  ]
}

// Auto-select add-ons for specific providers
const getAutoSelectedAddOns = (providerId: string) => {
  const autoSelectProviders = ['icici', 'reliance', 'tata']
  if (autoSelectProviders.includes(providerId)) {
    return {
      personalAccident: true,
      zeroDepreciation: true,
      roadsideAssistance: true
    }
  }
  return {
    personalAccident: false,
    zeroDepreciation: false,
    roadsideAssistance: false
  }
}

const InsuranceModal = ({ isOpen, onClose, onContinue, selectedVariant, selectedColor, selectedAccessories = [] }: InsuranceModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedProduct } = useSelector((state: RootState) => state.products)
  
  const [selectedProvider, setSelectedProvider] = useState('reliance')
  const [showAddOns, setShowAddOns] = useState(true)
  const [selectedAddOns, setSelectedAddOns] = useState(() => {
    const autoSelected = getAutoSelectedAddOns('reliance') // Default to reliance
    return {
      personalAccident: autoSelected.personalAccident,
      zeroDepreciation: autoSelected.zeroDepreciation,
      roadsideAssistance: autoSelected.roadsideAssistance,
      chargerScreen: true,
      rodentProtection: true
    }
  })
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
  const [isAddOnsInfoModalOpen, setIsAddOnsInfoModalOpen] = useState(false)
  const [isSoftWarningModalOpen, setIsSoftWarningModalOpen] = useState(false)
  const [warningAddon, setWarningAddon] = useState<string | null>(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  // Initialize with recommended plan selection logic
  const getInitialSelectedPlan = (providerId: string) => {
    const plans = damagePlansData[providerId as keyof typeof damagePlansData]
    if (plans && plans.length > 0) {
      const recommendedPlans = plans.filter(plan => plan.recommended)
      if (recommendedPlans.length > 0) {
        const selectedRecommendedPlan = recommendedPlans.reduce((prev, current) => {
          const prevYears = parseInt(prev.duration.split(' ')[0])
          const currentYears = parseInt(current.duration.split(' ')[0])
          return currentYears > prevYears ? current : prev
        })
        return selectedRecommendedPlan.id
      } else {
        return plans[0].id
      }
    }
    return '1year'
  }
  
  const [selectedPlan, setSelectedPlan] = useState(() => getInitialSelectedPlan('reliance'))

  const addOnsData = [
    {
      id: 'personalAccident',
      title: 'Personal Accident Cover',
      description: 'Mandatory if you don\'t have one',
      price: '2,352',
      warningTitle: 'Personal Accident Cover is mandatory as per insurance law',
      warningDescription: 'Rs.15 lacs coverage against death or permanent disability. It is legally mandated to own Personal Accident Cover while driving on roads in India. Skip only if you already have one.'
    },
    {
      id: 'zeroDepreciation',
      title: 'Zero Depreciation',
      description: 'Claim full cost of repaired parts',
      price: '5,494',
      warningTitle: 'We recommend a Zero Depreciation Cover to avoid claim rejection',
      warningDescription: 'Zero Depreciation cover avoids depreciation of consumable parts like plastic, fibre, etc and ensures your claim amount remains unaffected. Without this, upto 50% of claims, requiring plastic replacement, could be denied pertaining to age of parts.'
    },
    {
      id: 'roadsideAssistance',
      title: 'Road Side Assistance',
      description: 'On road towing and repair services',
      price: '236',
      warningTitle: 'We recommend a Road Side Assistance cover for seamless claims.',
      warningDescription: 'With a Road Side Assistance cover you can avail the service of on road repairs and free towing services in case of an emergency.'
    }
  ]


  const additionalCoverData = [
    {
      id: 'chargerScreen',
      title: 'Protect your Charger & Screen',
      description: 'Secure your Ola S1\'s display and charger from accidental damage and theft.',
      price: '799/yr'
    },
    {
      id: 'rodentProtection',
      title: 'Protection from Rodents',
      description: 'Ride worry-free with rodent and animal attack coverage. Uncheck to opt-out.',
      price: '699/yr'
    }
  ]

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => ({
      ...prev,
      [addOnId]: !prev[addOnId as keyof typeof prev]
    }))
  }

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId)
    // Auto-select recommended plan, or the one with more years if multiple recommended
    const plans = damagePlansData[providerId as keyof typeof damagePlansData]
    if (plans && plans.length > 0) {
      const recommendedPlans = plans.filter(plan => plan.recommended)
      if (recommendedPlans.length > 0) {
        // If multiple recommended, select the one with more years
        const selectedRecommendedPlan = recommendedPlans.reduce((prev, current) => {
          const prevYears = parseInt(prev.duration.split(' ')[0])
          const currentYears = parseInt(current.duration.split(' ')[0])
          return currentYears > prevYears ? current : prev
        })
        setSelectedPlan(selectedRecommendedPlan.id)
      } else {
        // If no recommended, select first plan
        setSelectedPlan(plans[0].id)
      }
    }
    
    // Update add-ons based on new provider
    const autoSelected = getAutoSelectedAddOns(providerId)
    setSelectedAddOns(prev => ({
      ...prev,
      personalAccident: autoSelected.personalAccident,
      zeroDepreciation: autoSelected.zeroDepreciation,
      roadsideAssistance: autoSelected.roadsideAssistance
    }))
  }

  // Handle add-on toggle with soft warning
  const handleAddOnToggle = (addonId: string) => {
    const autoSelected = getAutoSelectedAddOns(selectedProvider)
    const isAutoSelected = autoSelected[addonId as keyof typeof autoSelected]
    const isCurrentlySelected = selectedAddOns[addonId as keyof typeof selectedAddOns]
    
    // If trying to unselect an auto-selected add-on, show warning
    if (isAutoSelected && isCurrentlySelected) {
      const addonData = addOnsData.find(addon => addon.id === addonId)
      if (addonData) {
        setWarningAddon(addonId)
        setIsSoftWarningModalOpen(true)
        return
      }
    }
    
    // Otherwise, toggle normally
    setSelectedAddOns(prev => ({
      ...prev,
      [addonId]: !prev[addonId as keyof typeof prev]
    }))
  }

  // Handle soft warning modal actions
  const handleAddFromWarning = () => {
    if (warningAddon) {
      setSelectedAddOns(prev => ({
        ...prev,
        [warningAddon]: true
      }))
    }
    setWarningAddon(null)
  }

  const handleSkipFromWarning = () => {
    if (warningAddon) {
      setSelectedAddOns(prev => ({
        ...prev,
        [warningAddon]: false
      }))
    }
    setWarningAddon(null)
  }

  const calculateTotal = () => {
    // Get current damage plan price
    const currentDamagePlans = damagePlansData[selectedProvider as keyof typeof damagePlansData] || damagePlansData.reliance
    const selectedDamagePlan = currentDamagePlans.find(plan => plan.id === selectedPlan) || currentDamagePlans[0]
    const basePrice = selectedDamagePlan.price
    
    let addOnTotal = 0
    
    Object.entries(selectedAddOns).forEach(([key, value]) => {
      if (value) {
        const addOn = [...addOnsData, ...additionalCoverData].find(item => item.id === key)
        if (addOn) {
          const price = parseInt(addOn.price.replace(/[₹,]/g, ''))
          addOnTotal += price
        }
      }
    })
    
    return basePrice + addOnTotal
  }

  const handleAddToCart = () => {
    // If no selected product, create a standalone insurance product
    if (!selectedProduct || !selectedProduct.variants || !selectedProduct.colors) {
      // Create a standalone insurance product
      const insuranceProduct = {
        id: 'insurance-standalone',
        name: 'Insurance Coverage',
        slug: 'insurance-coverage',
        description: 'Comprehensive insurance coverage for your vehicle',
        category: 'accessory' as const,
        base_price: calculateTotal(),
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
          id: 'insurance-img',
          image_url: '/images/placeholder.png', 
          alt_text: 'Insurance',
          display_order: 1,
          is_primary: true
        }]
      }
      
      const insuranceAccessory = {
        id: `insurance-${selectedProvider}-${selectedPlan}`,
        name: `${insuranceProviders.find(p => p.id === selectedProvider)?.name} Insurance - ${selectedPlan}`,
        description: `Insurance coverage with ${selectedProvider} for ${selectedPlan}`,
        price: calculateTotal(),
        image_url: '/images/placeholder.png',
        type: 'insurance' as const,
        is_active: true
      }
      
      const insuranceVariant = {
        id: 'insurance-variant',
        name: 'Insurance Plan',
        price: calculateTotal(),
        battery_capacity: 'N/A',
        range_km: 0,
        top_speed_kmh: 0,
        acceleration_sec: 0,
        is_new: false,
        is_active: true
      }
      
      const insuranceColor = {
        id: 'default',
        name: 'Default',
        color_code: '#000000',
        css_filter: 'none'
      }
      
      dispatch(addToCart({
        product: insuranceProduct,
        variant: insuranceVariant,
        color: insuranceColor,
        accessories: [insuranceAccessory]
      }))
      
      dispatch(closeBuyNowModal())
      onClose()
      console.log('Insurance added to cart successfully!')
      return
    }
    
    // Get the actual selected variant and color
    const variant = selectedProduct.variants.find(v => v.id === selectedVariant) || selectedProduct.variants[0]
    const color = selectedProduct.colors.find(c => c.id === selectedColor) || selectedProduct.colors[0]
    
    if (variant && color) {
      // Create insurance accessory data
      const insuranceAccessory = {
        id: `insurance-${selectedProvider}-${selectedPlan}`,
        name: `${insuranceProviders.find(p => p.id === selectedProvider)?.name} Insurance - ${selectedPlan}`,
        description: `Insurance coverage with ${selectedProvider} for ${selectedPlan}`,
        price: calculateTotal(),
        image_url: '/images/placeholder.png',
        type: 'insurance'
      }
      
      // Combine selected accessories with insurance
      const allAccessories = [...(selectedAccessories || []), insuranceAccessory]
      
      dispatch(addToCart({
        product: selectedProduct,
        variant,
        color,
        accessories: allAccessories
      }))
      
      // Close all modals and show success message
      dispatch(closeBuyNowModal())
      onClose()
      console.log('Product with insurance added to cart successfully!')
    }
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
        <div className="w-full h-full flex flex-col bg-white" style={{ backgroundColor: '#ffffff' }}>
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

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 mt-16 pb-6">
            {/* Header */}
            <div className="mb-6">
              {/* Title and Price in same line */}
              <div className="flex items-start justify-between mb-3">
                <div className="text-lg font-bold text-gray-900 leading-tight flex-1 pr-4">
                  Insurance included in on-road price
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </div>
              </div>

              {/* Plan Includes */}
              <div className="flex items-center mb-2">
                <span className="text-sm text-gray-600">5 year Own Damage + 5 year Third Party</span>
                <button
                  onClick={() => setIsInfoModalOpen(true)}
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <img
                    src="https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/common/info-ev-insurance.svg"
                    className="w-4 h-4"
                    alt="info"
                  />
                </button>
              </div>

              {/* Insurance Required */}
              <div className="text-xs text-gray-500">
                Insurance is required by law to ride the Requeza S1 Pro
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 mb-4"></div>

            {/* Choose Own Damage Plan */}
            <div className="mb-6">
              <div className="text-lg font-semibold text-gray-900 mb-4">
                Choose own damage plan
              </div>

              {/* Insurance Provider Logos */}
              <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                {insuranceProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className={`flex-shrink-0 w-12 h-12 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                      selectedProvider === provider.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleProviderChange(provider.id)}
                  >
                    <img
                      src={provider.logo}
                      alt={provider.name}
                      className="w-full h-full rounded-full object-contain p-1"
                    />
                  </div>
                ))}
              </div>

              {/* Selected Provider Info */}
              <div className="mb-4">
                <div className="font-semibold text-gray-900">
                  {insuranceProviders.find(p => p.id === selectedProvider)?.name}
                </div>
                <div className="text-sm text-gray-600">
                  ₹1,32,999 Insured Value
                </div>
              </div>

              {/* Plan Selection - Horizontal Scrollable */}
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {damagePlansData[selectedProvider as keyof typeof damagePlansData]?.map((plan) => (
                  <DamagePlanCard
                    key={plan.id}
                    duration={plan.duration}
                    description={plan.description}
                    price={plan.price}
                    originalPrice={plan.originalPrice || undefined}
                    savings={plan.savings || undefined}
                    recommended={plan.recommended}
                    isSelected={selectedPlan === plan.id}
                    onSelect={() => setSelectedPlan(plan.id)}
                  />
                ))}
              </div>
            </div>

            {/* Add-ons Section */}
            <div className="mb-6">
              <div 
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => setShowAddOns(!showAddOns)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">Add-ons</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsAddOnsInfoModalOpen(true)
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <img
                      src="https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/common/info-ev-insurance.svg"
                      className="w-4 h-4"
                      alt="info"
                    />
                  </button>
                </div>
                <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform ${showAddOns ? '' : 'rotate-180'}`} />
              </div>

              {showAddOns && (
                <div className="space-y-3">
                  {addOnsData.map((addon) => (
                    <div
                      key={addon.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleAddOnToggle(addon.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 flex items-center justify-center">
                            {selectedAddOns[addon.id as keyof typeof selectedAddOns] ? (
                              <img
                                src="https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/common/checked.svg"
                                alt="checked"
                                className="w-6 h-6"
                              />
                            ) : (
                              <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{addon.title}</div>
                            <div className="text-sm text-gray-600">{addon.description}</div>
                          </div>
                        </div>
                        <div className="font-semibold text-gray-900">
                          ₹{addon.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 mb-4"></div>

            {/* Additional Cover Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-gray-900">Additional Cover</div>
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  RECOMMENDED
                </div>
              </div>

              <div className="space-y-4">
                {additionalCoverData.map((cover) => (
                  <div
                    key={cover.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleAddOn(cover.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-6 h-6 flex items-center justify-center mt-1">
                          {selectedAddOns[cover.id as keyof typeof selectedAddOns] ? (
                            <img
                              src="https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/common/checked.svg"
                              alt="checked"
                              className="w-6 h-6"
                            />
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">{cover.title}</div>
                          <div className="text-sm text-gray-600">
                            {cover.description}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900 ml-3">
                        ₹{cover.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="mb-6 space-y-3">
              <div className="text-xs text-gray-500">
                Add-ons and additional cover are pre-selected for convenience, opt out anytime.
              </div>
              <div className="text-sm text-gray-600">
                By continuing, I agree to the{' '}
                <span 
                  className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                  onClick={() => setIsPdfModalOpen(true)}
                >
                  privacy policy
                </span>
                {' '}and T&Cs of{' '}
                <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">Reliance</span>
                {' '}and{' '}
                <span 
                  className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                  onClick={() => setIsTermsModalOpen(true)}
                >
                  Requeza Financial Services
                </span>
                , and allow the insurer to fetch and process CKYC details for performing KYC
              </div>
            </div>

            {/* Footer */}
            <div className="text-xs text-gray-400 space-y-1">
              <div>Powered by Ola Financial Services Pvt. Ltd</div>
              <div>IRDAI Registration No. CA0682, CIN: U22219KA2007PTC127705</div>
              <div>Office : Ola Campus, Prestige RMZ Startech, Koramangala, Bangalore-560095</div>
            </div>
          </div>

          {/* Fixed Bottom Section */}
          <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-4 space-y-3">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!selectedProduct}
              className={`w-full py-3 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                selectedProduct
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            
            {/* Proceed to Checkout Button */}
            <button
              onClick={async () => {
                if (!selectedProduct || !selectedProduct.variants || !selectedProduct.colors) {
                  console.error('❌ No product selected')
                  return
                }
                
                console.log('🔄 Starting checkout process with insurance...')
                
                try {
                  // Get the actual selected variant and color
                  const variant = selectedProduct.variants.find(v => v.id === selectedVariant) || selectedProduct.variants[0]
                  const color = selectedProduct.colors.find(c => c.id === selectedColor) || selectedProduct.colors[0]
                  
                  if (!variant || !color) {
                    console.error('❌ Variant or color not found')
                    return
                  }
                  
                  // Create insurance accessory data
                  const insuranceAccessory = {
                    id: `insurance-${selectedProvider}-${selectedPlan}`,
                    name: `${insuranceProviders.find(p => p.id === selectedProvider)?.name} Insurance - ${selectedPlan}`,
                    description: `Insurance coverage with ${selectedProvider} for ${selectedPlan}`,
                    price: calculateTotal(),
                    image_url: '/images/placeholder.png'
                  }
                  
                  // Combine selected accessories with insurance
                  const allAccessories = [...selectedAccessories, insuranceAccessory]
                  
                  // Add to Redux cart (sync)
                  dispatch(addToCart({
                    product: selectedProduct,
                    variant,
                    color,
                    accessories: allAccessories
                  }))
                  
                  console.log('✅ Added to Redux cart, now syncing with backend...')
                  
                  // Directly call backend API and wait for response
                  const { cartApi } = await import('@/lib/cartApi')
                  const accessoryPrice = allAccessories.reduce((sum, acc) => sum + acc.price, 0)
                  const totalPrice = variant.price + accessoryPrice
                  
                  await cartApi.addToCart({
                    product_id: selectedProduct.id,
                    variant_id: variant.id,
                    color_id: color.id,
                    quantity: 1,
                    accessories: allAccessories,
                    total_price: totalPrice
                  })
                  
                  console.log('✅ Backend sync complete, navigating to checkout...')
                  
                  // Close modals
                  dispatch(closeBuyNowModal())
                  onClose()
                  
                  // Navigate to checkout
                  window.location.href = '/checkout'
                  
                } catch (error) {
                  console.error('❌ Error during checkout process:', error)
                  // Still navigate to checkout, item is in Redux at least
                  window.location.href = '/checkout'
                }
              }}
              disabled={!selectedProduct}
              className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedProduct
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop: Left overlay - transparent to allow interaction with underlying BuyNow modal */}
      <div className="hidden lg:block absolute left-0 w-full h-full bg-transparent" style={{ width: 'calc(100% - 400px)' }}>
        {/* This space is intentionally left empty to allow the underlying BuyNow modal's left section to remain interactive */}
      </div>
      
      {/* Desktop: Right modal panel */}
      <div 
        className="hidden lg:flex absolute right-0 w-96 h-full flex flex-col bg-white"
        style={{ backgroundColor: '#ffffff' }}
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

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 mt-16 pb-6">
          {/* Header */}
          <div className="mb-6">
            {/* Title and Price in same line */}
            <div className="flex items-start justify-between mb-3">
              <div className="text-lg font-bold text-gray-900 leading-tight flex-1 pr-4">
                Insurance included in on-road price
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ₹{calculateTotal().toLocaleString('en-IN')}
              </div>
            </div>

            {/* Plan Includes */}
            <div className="flex items-center mb-2">
              <span className="text-sm text-gray-600">5 year Own Damage + 5 year Third Party</span>
              <button
                onClick={() => setIsInfoModalOpen(true)}
                className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <img
                  src="https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/common/info-ev-insurance.svg"
                  className="w-4 h-4"
                  alt="info"
                />
              </button>
            </div>

            {/* Insurance Required */}
            <div className="text-xs text-gray-500">
              Insurance is required by law to ride the Requeza S1 Pro
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200 mb-4"></div>

          {/* Choose Own Damage Plan */}
          <div className="mb-6">
            <div className="text-lg font-semibold text-gray-900 mb-4">
              Choose own damage plan
            </div>

            {/* Insurance Provider Logos */}
            <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
              {insuranceProviders.map((provider) => (
                <div
                  key={provider.id}
                  className={`flex-shrink-0 w-12 h-12 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                    selectedProvider === provider.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleProviderChange(provider.id)}
                >
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    className="w-full h-full rounded-full object-contain p-1"
                  />
                </div>
              ))}
            </div>

            {/* Selected Provider Info */}
            <div className="mb-4">
              <div className="font-semibold text-gray-900">
                {insuranceProviders.find(p => p.id === selectedProvider)?.name}
              </div>
              <div className="text-sm text-gray-600">
                ₹1,32,999 Insured Value
              </div>
            </div>

            {/* Plan Selection - Horizontal Scrollable */}
            <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {damagePlansData[selectedProvider as keyof typeof damagePlansData]?.map((plan) => (
                <DamagePlanCard
                  key={plan.id}
                  duration={plan.duration}
                  description={plan.description}
                  price={plan.price}
                  originalPrice={plan.originalPrice || undefined}
                  savings={plan.savings || undefined}
                  recommended={plan.recommended}
                  isSelected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(plan.id)}
                />
              ))}
            </div>
          </div>

          {/* Add-ons Section */}
          <div className="mb-6">
            <div 
              className="flex items-center justify-between cursor-pointer mb-4"
              onClick={() => setShowAddOns(!showAddOns)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">Add-ons</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsAddOnsInfoModalOpen(true)
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <img
                    src="https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/common/info-ev-insurance.svg"
                    className="w-4 h-4"
                    alt="info"
                  />
                </button>
              </div>
              <ChevronUp className={`w-5 h-5 text-gray-500 transition-transform ${showAddOns ? '' : 'rotate-180'}`} />
            </div>

            {showAddOns && (
              <div className="space-y-3">
                {addOnsData.map((addon) => (
                  <div
                    key={addon.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleAddOnToggle(addon.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {selectedAddOns[addon.id as keyof typeof selectedAddOns] ? (
                            <img
                              src="https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/common/checked.svg"
                              alt="checked"
                              className="w-6 h-6"
                            />
                          ) : (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{addon.title}</div>
                          <div className="text-sm text-gray-600">{addon.description}</div>
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900">
                        ₹{addon.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-200 mb-4"></div>

          {/* Additional Cover Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold text-gray-900">Additional Cover</div>
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                RECOMMENDED
              </div>
            </div>

            <div className="space-y-4">
              {additionalCoverData.map((cover) => (
                <div
                  key={cover.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => toggleAddOn(cover.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-6 h-6 flex items-center justify-center mt-1">
                        {selectedAddOns[cover.id as keyof typeof selectedAddOns] ? (
                          <img
                            src="https://dyu8p57rmh62v.cloudfront.net/FullKycUI/insurance/ev/common/checked.svg"
                            alt="checked"
                            className="w-6 h-6"
                          />
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">{cover.title}</div>
                        <div className="text-sm text-gray-600">
                          {cover.description}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 ml-3">
                      ₹{cover.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6 space-y-3">
            <div className="text-xs text-gray-500">
              Add-ons and additional cover are pre-selected for convenience, opt out anytime.
            </div>
            <div className="text-sm text-gray-600">
              By continuing, I agree to the{' '}
              <span 
                className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                onClick={() => setIsPdfModalOpen(true)}
              >
                privacy policy
              </span>
              {' '}and T&Cs of{' '}
              <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">Reliance</span>
              {' '}and{' '}
              <span 
                className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                onClick={() => setIsTermsModalOpen(true)}
              >
                Ola Financial Services
              </span>
              , and allow the insurer to fetch and process CKYC details for performing KYC
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-400 space-y-1">
            <div>Powered by Ola Financial Services Pvt. Ltd</div>
            <div>IRDAI Registration No. CA0682, CIN: U22219KA2007PTC127705</div>
            <div>Office : Ola Campus, Prestige RMZ Startech, Koramangala, Bangalore-560095</div>
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-4 space-y-3">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedProduct}
            className={`w-full py-3 font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
              selectedProduct
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
          
      {/* Proceed to Checkout Button */}
      <button
        onClick={async () => {
          if (!selectedProduct || !selectedProduct.variants || !selectedProduct.colors) {
            console.error('❌ No product selected')
            return
          }
          
          console.log('🔄 Starting checkout process with insurance...')
          
          try {
            // Get the actual selected variant and color
            const variant = selectedProduct.variants.find(v => v.id === selectedVariant) || selectedProduct.variants[0]
            const color = selectedProduct.colors.find(c => c.id === selectedColor) || selectedProduct.colors[0]
            
            if (!variant || !color) {
              console.error('❌ Variant or color not found')
              return
            }
            
            // Create insurance accessory data
            const insuranceAccessory = {
              id: `insurance-${selectedProvider}-${selectedPlan}`,
              name: `${insuranceProviders.find(p => p.id === selectedProvider)?.name} Insurance - ${selectedPlan}`,
              description: `Insurance coverage with ${selectedProvider} for ${selectedPlan}`,
              price: calculateTotal(),
              image_url: '/images/placeholder.png'
            }
            
            // Combine selected accessories with insurance
            const allAccessories = [...selectedAccessories, insuranceAccessory]
            
            // Add to Redux cart (sync)
            dispatch(addToCart({
              product: selectedProduct,
              variant,
              color,
              accessories: allAccessories
            }))
            
            console.log('✅ Added to Redux cart, now syncing with backend...')
            
            // Directly call backend API and wait for response
            const { cartApi } = await import('@/lib/cartApi')
            const accessoryPrice = allAccessories.reduce((sum, acc) => sum + acc.price, 0)
            const totalPrice = variant.price + accessoryPrice
            
            await cartApi.addToCart({
              product_id: selectedProduct.id,
              variant_id: variant.id,
              color_id: color.id,
              quantity: 1,
              accessories: allAccessories,
              total_price: totalPrice
            })
            
            console.log('✅ Backend sync complete, navigating to checkout...')
            
            // Close modals
            dispatch(closeBuyNowModal())
            onClose()
            
            // Navigate to checkout
            window.location.href = '/checkout'
            
          } catch (error) {
            console.error('❌ Error during checkout process:', error)
            // Still navigate to checkout, item is in Redux at least
            window.location.href = '/checkout'
          }
        }}
        disabled={!selectedProduct}
        className={`w-full py-3 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
          selectedProduct
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <CreditCard className="w-4 h-4" />
        Proceed to Checkout
      </button>
        </div>
      </div>

    </div>
    
    {/* Info Modal - Outside of Insurance modal container to avoid z-index issues */}
    <InfoModal
      isOpen={isInfoModalOpen}
      onClose={() => setIsInfoModalOpen(false)}
      title="Insurance coverage included"
      sections={[
        {
          title: "Own Damage Cover",
          duration: "5 years",
          description: "Covers damage caused to your Ola Scooter in case of fire, theft, etc. This cover compensates for expenses of repairing or replacing any parts of your damaged Ola Scooter."
        },
        {
          title: "Third-party Cover", 
          duration: "5 years",
          description: "Covers damage caused by your Ola Scooter to other vehicles, personal property, or in case of physical injury."
        }
      ]}
      buttonText="Got It"
    />

    {/* Add-Ons Info Modal */}
    <InfoModal
      isOpen={isAddOnsInfoModalOpen}
      onClose={() => setIsAddOnsInfoModalOpen(false)}
      title="Insurance Addons"
      sections={[
        {
          title: "Personal Accident Cover",
          description: "Rs.15 lacs coverage against death or permanent disability. It is legally mandated to own Personal Accident Cover while driving on roads in India. Skip only if you already have one.",
          price: "₹531"
        },
        {
          title: "Zero Depreciation",
          description: "Avoids depreciation of consumable parts like plastic, fibre, etc and ensures your claim amount remains unaffected. Without this, upto 50% of claims, requiring plastic replacement, could be denied pertaining to age of parts.",
          price: "₹1,349"
        },
        {
          title: "Road Side Assistance",
          description: "On road repairs and free towing services in emergencies. Get assistance for battery issues, flat tires, and other roadside problems.",
          price: "₹117"
        }
      ]}
      buttonText="Got It"
    />

    {/* Soft Warning Modal */}
    {warningAddon && (
      <SoftWarningModal
        isOpen={isSoftWarningModalOpen}
        onClose={() => {
          setIsSoftWarningModalOpen(false)
          setWarningAddon(null)
        }}
        onAdd={handleAddFromWarning}
        onSkip={handleSkipFromWarning}
        title={addOnsData.find(addon => addon.id === warningAddon)?.warningTitle || ''}
        description={addOnsData.find(addon => addon.id === warningAddon)?.warningDescription || ''}
        price={addOnsData.find(addon => addon.id === warningAddon)?.price || ''}
        addonName={addOnsData.find(addon => addon.id === warningAddon)?.title || ''}
      />
    )}

    {/* PDF Modal */}
    <PdfModal
      isOpen={isPdfModalOpen}
      onClose={() => setIsPdfModalOpen(false)}
      title="Privacy Policy"
      pdfUrl="/documents/ola-financial-services-privacy-policy.pdf"
      pdfTitle="OLA Financial Services Privacy Policy"
    />

    {/* Terms Modal */}
    <PdfModal
      isOpen={isTermsModalOpen}
      onClose={() => setIsTermsModalOpen(false)}
      title="Terms and Conditions"
      pdfUrl="/documents/ola-financial-services-terms.pdf"
      pdfTitle="Insurance On-boarding Terms and Conditions"
    />
  </>
  )
}

export default InsuranceModal
