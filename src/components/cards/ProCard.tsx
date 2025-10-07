'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface ProCardProps {
  name: string
  variant: string
  image: string
  alt: string
  batteryCapacity: string
  range: string
  topSpeed: string
  peakPower: string
  acceleration: string
  startingPrice: string
  product?: any // Add product data for navigation
  onOrderNow: () => void
}

const ProCard = ({
  name,
  variant,
  image,
  alt,
  batteryCapacity,
  range,
  topSpeed,
  peakPower,
  acceleration,
  startingPrice,
  product,
  onOrderNow
}: ProCardProps) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-full border border-gray-100">
      {/* Product Image Container - Full width and height - Same size as GigCard */}
      <div className="relative h-[800px] overflow-hidden">
        {/* Full background image */}
        <Image
          src={image}
          alt={alt}
          fill
          className="w-full h-full object-cover"
          priority
        />
        {/* Light overlay for better contrast */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      {/* Product Content - Same padding and spacing as GigCard */}
      <div className="p-8 space-y-6">
        {/* Product Name - Larger like GigCard */}
        <div className="text-left">
          <h3 className="text-4xl font-bold">
            <span className="font-extrabold bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">{name.split(' ')[0].toUpperCase()}</span> {name.split(' ').slice(1).join(' ')}
            {variant && <span className="text-green-600 font-bold ml-2">{variant}</span>}
          </h3>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-4 py-4">
          {/* Battery Capacity */}
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{batteryCapacity}</div>
            <div className="text-xs text-gray-600">Battery Capacity</div>
          </div>
          
          {/* Range */}
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{range}</div>
            <div className="text-xs text-gray-600">Range (IDC)</div>
          </div>
          
          {/* Top Speed */}
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{topSpeed}</div>
            <div className="text-xs text-gray-600">Top speed</div>
          </div>
        </div>

        {/* Additional Specifications - Larger text */}
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 text-base text-gray-700">
            <span className="text-green-600 font-bold">+</span>
            <span>Peak Power: {peakPower}</span>
          </div>
          <div className="flex items-center gap-2 text-base text-gray-700">
            <span className="text-green-600 font-bold">+</span>
            <span>Acceleration: {acceleration}</span>
          </div>
        </div>

        {/* Pricing and CTA - Same line layout as screenshot */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-sm text-gray-500 mb-1">Starting at</p>
              <p className="text-2xl font-bold text-gray-900">{startingPrice}</p>
            </div>
            
            <button
              onClick={onOrderNow}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              <span>Order now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProCard
