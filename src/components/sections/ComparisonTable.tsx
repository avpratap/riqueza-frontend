'use client'

import { useState } from 'react'
import { 
  Zap, 
  Battery, 
  MapPin, 
  Gauge,
  DollarSign,
  Clock,
  Settings,
  Palette,
  Car,
  Power
} from 'lucide-react'

const ComparisonTable = () => {
  const [selectedProduct, setSelectedProduct] = useState<'s1pro' | 's1proplus'>('s1proplus')
  const specifications = [
    {
      id: 1,
      label: 'ACCELERATION',
      detail: '0-40 kmph',
      icon: Car,
      gen2: '2.3 sec',
      gen3: '2.1 sec'
    },
    {
      id: 2,
      label: 'PEAK',
      detail: 'Motor Power',
      icon: Power,
      gen2: '11 kW',
      gen3: '13 kW'
    },
    {
      id: 3,
      label: 'CERTIFIED',
      detail: 'Range',
      icon: MapPin,
      gen2: '195 km',
      gen3: '320 km'
    },
    {
      id: 4,
      label: 'TOP',
      detail: 'Speed',
      icon: Gauge,
      gen2: '120 km/h',
      gen3: '141 km/h'
    },
    {
      id: 5,
      label: 'INTRODUCTORY',
      detail: 'Price',
      icon: DollarSign,
      gen2: '₹1,48,999',
      gen3: '₹1,59,999'
    },
    {
      id: 6,
      label: 'CHARGING',
      detail: 'Time (0-80%)',
      icon: Clock,
      gen2: '4 hrs 50 mins',
      gen3: '7 hrs'
    },
    {
      id: 7,
      label: 'RIDING',
      detail: 'Modes',
      icon: Settings,
      gen2: 'Hyper, Sports, Normal & Eco',
      gen3: 'Hyper, Sports, Normal & Eco'
    },
    {
      id: 8,
      label: 'AVAILABLE',
      detail: 'Colours',
      icon: Palette,
      gen2: 'colors',
      gen3: 'colors'
    },
    {
      id: 9,
      label: 'BATTERY',
      detail: 'Warranty',
      icon: Battery,
      gen2: '3 yrs/50,000 km',
      gen3: '3 yrs/50,000 km'
    }
  ]

  return (
    <section className="w-full bg-gray-50 py-8 sm:py-12 lg:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          {/* Title */}
          <div className="mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">Go From Best.</span>
              <br />
              <span className="font-normal text-gray-900">To Unbeatable.</span>
            </h2>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Table Header with Product Names */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-4 lg:p-6 bg-gray-50 border-b border-gray-200">
              {/* Empty space for specification column */}
              <div></div>
              
              {/* Product Headers */}
              <div 
                className="text-center cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedProduct('s1pro')}
              >
                <div className="text-underline-fit">
                  <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 transition-all duration-200 ${
                    selectedProduct === 's1pro' 
                      ? 'bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500 bg-clip-text text-transparent' 
                      : 'text-gray-900'
                  }`}>
                    Riqueza S1 Pro
                  </h3>
                  <div className={`h-1 rounded transition-colors duration-200 ${
                    selectedProduct === 's1pro' ? 'bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500' : 'bg-gray-300'
                  }`}></div>
                </div>
              </div>

              <div 
                className="text-center cursor-pointer transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedProduct('s1proplus')}
              >
                <div className="text-underline-fit">
                  <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 transition-all duration-200 ${
                    selectedProduct === 's1proplus' 
                      ? 'bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500 bg-clip-text text-transparent' 
                      : 'text-gray-900'
                  }`}>
                    Riqueza S1 Pro+
                  </h3>
                  <div className={`h-1 rounded transition-colors duration-200 ${
                    selectedProduct === 's1proplus' ? 'bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500' : 'bg-gray-300'
                  }`}></div>
                </div>
              </div>
            </div>

            {/* Scrollable Table Body */}
            <div className="max-h-[400px] sm:max-h-[500px] lg:max-h-[550px] overflow-y-auto custom-scrollbar">
              {specifications.map((spec, index) => {
                const IconComponent = spec.icon
                const isColorsRow = spec.label === 'AVAILABLE'
                
                return (
                  <div key={spec.id} className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-4 lg:p-6 border-b border-gray-100 last:border-b-0">
                     {/* Specification Info */}
                     <div className="flex items-center gap-3 sm:gap-4">
                       <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                         <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                       </div>
                       <div className="min-w-0 flex-1">
                         <div className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">
                           {spec.label}
                         </div>
                         {spec.detail && (
                           <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                             {spec.detail}
                           </div>
                         )}
                       </div>
                     </div>

                    {/* Gen 2 Value */}
                    <div className="flex items-center justify-center">
                      {isColorsRow ? (
                        <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                          {['bg-gray-400', 'bg-red-500', 'bg-blue-500', 'bg-blue-900'].map((color, idx) => (
                            <div key={idx} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 ${color}`}></div>
                          ))}
                        </div>
                      ) : (
                        <span className={`text-lg sm:text-xl lg:text-2xl font-bold transition-all duration-200 text-center ${
                          selectedProduct === 's1pro' 
                            ? 'bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500 bg-clip-text text-transparent' 
                            : 'text-gray-900'
                        }`}>
                          {spec.gen2}
                        </span>
                      )}
                    </div>

                    {/* S1 Pro+ Value */}
                    <div className="flex items-center justify-center">
                      {isColorsRow ? (
                        <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                          {['bg-gray-400', 'bg-red-500', 'bg-blue-500', 'bg-blue-900'].map((color, idx) => (
                            <div key={idx} className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 ${color}`}></div>
                          ))}
                        </div>
                      ) : (
                        <span className={`text-lg sm:text-xl lg:text-2xl font-bold transition-all duration-200 text-center ${
                          selectedProduct === 's1proplus' 
                            ? 'bg-gradient-to-r from-blue-600 via-green-500 to-yellow-500 bg-clip-text text-transparent' 
                            : 'text-gray-900'
                        }`}>
                          {spec.gen3}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComparisonTable
