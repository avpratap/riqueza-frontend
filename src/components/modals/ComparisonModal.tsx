'use client'

import { useEffect } from 'react'

interface ComparisonModalProps {
  isOpen: boolean
  onClose: () => void
}

const ComparisonModal = ({ isOpen, onClose }: ComparisonModalProps) => {

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


  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Comparison data matching the ComparisonTable component
  const variants = [
    {
      id: 's1pro',
      name: 'Requeza S1 Pro',
      acceleration: '2.3 sec',
      peakPower: '11 kW',
      certifiedRange: '195 km',
      topSpeed: '120 km/h',
      introductoryPrice: '₹1,48,999',
      chargingTime: '4 hrs 50 mins',
      ridingModes: 'Hyper, Sports, Normal & Eco',
      availableColours: '6 colours',
      batteryWarranty: '3 yrs/50,000 km'
    },
    {
      id: 's1proplus',
      name: 'Requeza S1 Pro+',
      acceleration: '2.1 sec',
      peakPower: '13 kW',
      certifiedRange: '320 km',
      topSpeed: '141 km/h',
      introductoryPrice: '₹1,59,999',
      chargingTime: '7 hrs',
      ridingModes: 'Hyper, Sports, Normal & Eco',
      availableColours: '6 colours',
      batteryWarranty: '3 yrs/50,000 km'
    }
  ]

  const specifications = [
    { label: 'Acceleration (0-40 kmph)', key: 'acceleration' },
    { label: 'Peak Motor Power', key: 'peakPower' },
    { label: 'Certified Range', key: 'certifiedRange' },
    { label: 'Top Speed', key: 'topSpeed' },
    { label: 'Introductory Price', key: 'introductoryPrice' },
    { label: 'Charging Time (0-80%)', key: 'chargingTime' },
    { label: 'Riding Modes', key: 'ridingModes' },
    { label: 'Available Colours', key: 'availableColours' },
    { label: 'Battery Warranty', key: 'batteryWarranty' }
  ]

  if (!isOpen) return null

  return (
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
          <div className="text-center text-xl font-bold text-gray-900 mt-20 px-4 mb-6">
            Compare Models
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Variant Names and Overview */}
            <div className="px-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-lg font-semibold text-gray-900">Overview</div>
                <div className="grid grid-cols-2 gap-4">
                  {variants.map((variant) => (
                    <div key={variant.id} className="text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        <span className="bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                          {variant.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specifications Table */}
            <div className="px-4 py-4">
              <div className="space-y-4">
                {/* Specifications */}
                {specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 last:border-b-0">
                    <div className="text-sm font-medium text-gray-700">
                      {spec.label}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {variants.map((variant) => (
                        <div key={variant.id} className="text-sm font-semibold text-gray-900 text-center">
                          {variant[spec.key as keyof typeof variant]}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fixed Bottom Section */}
          <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Close
            </button>
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
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <img 
              src="https://assets.olaelectric.com/olaelectric-videos/configs-static/overlay-config-json/olaTechPack/backButton.svg"
              alt="back"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Header */}
        <div className="text-center text-xl font-bold text-gray-900 mt-20 px-4 mb-6">
          Compare Models
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Variant Names and Overview */}
          <div className="px-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-lg font-semibold text-gray-900">Overview</div>
              <div className="grid grid-cols-2 gap-4">
                {variants.map((variant) => (
                  <div key={variant.id} className="text-center">
                    <div className="text-sm font-semibold text-gray-900">
                      <span className="bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                        {variant.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="px-4 py-4">
            <div className="space-y-4">
              {/* Specifications */}
              {specifications.map((spec, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="text-sm font-medium text-gray-700">
                    {spec.label}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {variants.map((variant) => (
                      <div key={variant.id} className="text-sm font-semibold text-gray-900 text-center">
                        {variant[spec.key as keyof typeof variant]}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Section */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ComparisonModal
