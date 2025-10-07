'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'

import {
  STATES,
  calculateEVSavings,
  formatRupee,
  formatCompactRupee,
  getStateByName,
  type CalculatorResult
} from '@/lib/evModel'

interface EVCalculatorProps {
  className?: string
}

const EVCalculator: React.FC<EVCalculatorProps> = ({ className = '' }) => {
  // State management
  const [selectedVariant, setSelectedVariant] = useState('S1 Pro')
  const [selectedState, setSelectedState] = useState('Karnataka')
  const [dailyDistance, setDailyDistance] = useState(30)
  
  // Dropdown visibility states
  const [isVariantOpen, setIsVariantOpen] = useState(false)
  const [isStateOpen, setIsStateOpen] = useState(false)
  
  // Refs for dropdowns
  const variantRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<HTMLDivElement>(null)

  // Calculate results
  const result: CalculatorResult = useMemo(() => {
    const state = getStateByName(selectedState)
    return calculateEVSavings(dailyDistance, state, selectedVariant)
  }, [dailyDistance, selectedState, selectedVariant])

  // Dynamic Y-axis calculation based on max cost
  const maxCost = Math.max(result.ice.total, result.ev.total)
  const getYAxisLabels = () => {
    const maxValue = Math.ceil(maxCost / 1000) * 1000
    const step = maxValue <= 4000 ? 500 : maxValue <= 8000 ? 1000 : 2000
    const labels = []
    
    for (let i = 0; i <= maxValue; i += step) {
      labels.push(i)
    }
    
    return labels.reverse()
  }

  const yAxisLabels = getYAxisLabels()
  const chartHeight = 240 // Responsive chart height

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (variantRef.current && !variantRef.current.contains(event.target as Node)) {
        setIsVariantOpen(false)
      }
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setIsStateOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <section className={`w-full bg-[#F0F9FF] pt-8 sm:pt-12 lg:pt-16 ${className}`}>
      <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left Panel - Controls and KPIs */}
          <div className="space-y-8">
             {/* Custom Rounded Dropdowns */}
             <div className="flex flex-wrap gap-3 sm:gap-4">
               {/* Variant Dropdown */}
               <div className="relative" ref={variantRef}>
                 <button
                   onClick={() => setIsVariantOpen(!isVariantOpen)}
                   className="bg-white text-gray-800 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm font-semibold min-w-[140px] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between w-full"
                 >
                   <span className="text-left">{selectedVariant}</span>
                   <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ml-2 ${isVariantOpen ? 'rotate-180' : ''}`} />
                 </button>
                 
                 {isVariantOpen && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden">
                     <div className="py-2">
                       {['S1 Pro', 'S1 Pro+'].map((variant) => (
                         <button
                           key={variant}
                           onClick={() => {
                             setSelectedVariant(variant)
                             setIsVariantOpen(false)
                           }}
                           className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-blue-50 transition-colors duration-200 ${
                             selectedVariant === variant ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                           }`}
                         >
                           {variant}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               {/* State Dropdown */}
               <div className="relative" ref={stateRef}>
                 <button
                   onClick={() => setIsStateOpen(!isStateOpen)}
                   className="bg-white text-gray-800 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm font-semibold min-w-[180px] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between w-full"
                 >
                   <span className="text-left">{selectedState}</span>
                   <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ml-2 ${isStateOpen ? 'rotate-180' : ''}`} />
                 </button>
                 
                 {isStateOpen && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 overflow-hidden max-h-60 overflow-y-auto">
                     <div className="py-2">
                       {STATES.map((state) => (
                         <button
                           key={state.code}
                           onClick={() => {
                             setSelectedState(state.name)
                             setIsStateOpen(false)
                           }}
                           className={`w-full px-4 py-3 text-left text-sm font-medium hover:bg-blue-50 transition-colors duration-200 ${
                             selectedState === state.name ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                           }`}
                         >
                           {state.name}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             </div>

            {/* Headline */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                Buying an EV is money in the bank.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Don't believe us? Calculate for yourself.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-1">
                  {formatRupee(result.annualSavings)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Annual Savings</div>
              </div>
              <div className="flex-1">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 mb-1">
                  {formatRupee(result.monthlySavings)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Monthly Savings</div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 sm:pt-4">
              <button className="text-green-600 font-medium text-sm sm:text-base md:text-lg hover:text-green-700 transition-colors flex items-center gap-2">
                <span>Talk to our Experts</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Right Panel - Slider and Chart */}
          <div className="space-y-6 sm:space-y-8">
            {/* Daily Distance Slider */}
            <div className="space-y-3 sm:space-y-4">
              <div className="text-sm sm:text-base text-gray-900 font-medium">
                Daily distance: {dailyDistance}km
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="15"
                  max="100"
                  value={dailyDistance}
                  onChange={(e) => setDailyDistance(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ev-slider"
                  style={{
                    background: `linear-gradient(to right, #059669 0%, #059669 ${((dailyDistance - 15) / (100 - 15)) * 100}%, #E5E7EB ${((dailyDistance - 15) / (100 - 15)) * 100}%, #E5E7EB 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>15 Km</span>
                  <span>100 Km</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Total cost of ownership (monthly)
              </h3>
              
              <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
                <div className="relative" style={{ height: `${chartHeight + 40}px` }}>
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 flex flex-col justify-between text-sm text-gray-600 w-12" style={{ height: `${chartHeight}px` }}>
                    {yAxisLabels.map((value) => (
                      <span key={value}>
                        {value >= 1000 ? `₹${value / 1000}k` : `₹${value}`}
                      </span>
                    ))}
                    {/* Zero label at bottom */}
                    <span>₹0</span>
                  </div>
                  
                  {/* Grid lines */}
                  <div className="absolute left-12 right-0 top-0 flex flex-col justify-between pointer-events-none" style={{ height: `${chartHeight}px` }}>
                    {yAxisLabels.map((value) => (
                      <div key={value} className="border-t border-gray-200 border-dashed w-full"></div>
                    ))}
                    {/* Zero line at bottom */}
                    <div className="border-t border-gray-300 border-solid w-full"></div>
                  </div>

                  {/* Chart bars */}
                  <div className="absolute left-12 right-0 flex items-end justify-center gap-12" style={{ height: `${chartHeight}px`, bottom: '0px' }}>
                    {/* ICE Scooter Bar */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 flex flex-col justify-end" style={{ height: `${chartHeight}px` }}>
                        {/* Stack from top to bottom: Running (top) -> Maintenance (middle) -> Fixed (bottom) */}
                        <div 
                          className="bg-[#A855F7] w-full"
                          style={{ height: `${(result.ice.running / yAxisLabels[0]) * chartHeight}px` }}
                        ></div>
                        <div 
                          className="bg-[#3B82F6] w-full"
                          style={{ height: `${(result.ice.maintenance / yAxisLabels[0]) * chartHeight}px` }}
                        ></div>
                        <div 
                          className="bg-[#6B7280] w-full"
                          style={{ height: `${(result.ice.fixed / yAxisLabels[0]) * chartHeight}px` }}
                        ></div>
                      </div>
                      <div className="text-center mt-4">
                        <div className="text-sm font-medium text-gray-900">ICE Scooter</div>
                      </div>
                    </div>

                    {/* Selected EV Model Bar */}
                    <div className="flex flex-col items-center">
                      <div className="w-24 flex flex-col justify-end" style={{ height: `${chartHeight}px` }}>
                        {/* Stack from top to bottom: Savings (top) -> Running (middle) -> Fixed (bottom) */}
                        <div 
                          className="bg-[#10B981] w-full"
                          style={{ height: `${(result.ev.savings / yAxisLabels[0]) * chartHeight}px` }}
                        ></div>
                        <div 
                          className="bg-[#A855F7] w-full"
                          style={{ height: `${(result.ev.running / yAxisLabels[0]) * chartHeight}px` }}
                        ></div>
                        <div 
                          className="bg-[#6B7280] w-full"
                          style={{ height: `${(result.ev.fixed / yAxisLabels[0]) * chartHeight}px` }}
                        ></div>
                      </div>
                      <div className="text-center mt-4">
                        <div className="text-sm font-medium text-gray-900">{selectedVariant}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart Legend */}
                <div className="flex flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#6B7280] rounded-full"></div>
                    <span className="text-gray-700">Fixed cost</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#3B82F6] rounded-full"></div>
                    <span className="text-gray-700">Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#A855F7] rounded-full"></div>
                    <span className="text-gray-700">Running cost</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#10B981] rounded-full"></div>
                    <span className="text-gray-700">Savings</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .ev-slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #059669;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .ev-slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #059669;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .ev-slider::-webkit-slider-track {
          height: 8px;
          border-radius: 4px;
        }
        
        .ev-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
      `}</style>
    </section>
  )
}

export default EVCalculator
