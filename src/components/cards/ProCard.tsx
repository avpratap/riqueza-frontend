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
      {/* Product Image Container - Match ProductCard heights */}
      <div className="relative h-[350px] sm:h-[400px] lg:h-[450px] overflow-hidden">
        {/* Full background image */}
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="w-full h-full object-cover"
          priority
        />
        {/* Light overlay for better contrast */}
        <div className="absolute inset-0 bg-black/5"></div>
      </div>

      {/* Product Content - Match ProductCard padding */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
        {/* Product Name - Match ProductCard sizing */}
        <div className="text-left">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
            <span className="font-extrabold bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">{name.split(' ')[0].toUpperCase()}</span> {name.split(' ').slice(1).join(' ')}
            {variant && <span className="text-green-600 font-bold ml-2">{variant}</span>}
          </h3>
        </div>

        {/* Specifications - Match ProductCard style */}
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
          {range} Range | {acceleration} | {batteryCapacity} Battery
        </p>

        {/* Additional Specifications - Compact layout */}
        <div className="flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
          <div className="flex items-center gap-1">
            <span className="text-green-600 font-bold">+</span>
            <span>Peak Power: {peakPower}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-600 font-bold">+</span>
            <span>Top Speed: {topSpeed}</span>
          </div>
        </div>

        {/* Pricing and CTA - Match ProductCard layout */}
        <div className="space-y-1 pt-2">
          <p className="text-xs sm:text-sm text-gray-500">Starting at</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{startingPrice}</p>
        </div>

        {/* CTA Buttons - Match ProductCard style */}
        <div className="space-y-2 sm:space-y-3 pt-2">
          <button
            onClick={onOrderNow}
            type="button"
            className="w-full bg-gray-900 text-white font-medium text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="truncate">Order now</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProCard
