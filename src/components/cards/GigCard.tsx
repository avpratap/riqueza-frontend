






'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { setSelectedProduct } from '@/store/slices/productSlice'
import { openBuyNowModal } from '@/store/slices/uiSlice'

interface GigCardProps {
  name: string
  image: string
  alt: string
  specifications: string
  price: string
  primaryButtonText: string
  secondaryButtonText: string
  product?: any
  slug?: string
  variant?: any
}

const GigCard = ({
  name,
  image,
  alt,
  specifications,
  price,
  primaryButtonText,
  secondaryButtonText,
  product,
  slug,
  variant
}: GigCardProps) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleExplore = () => {
    // Navigation will be handled by Link component
  }

  const handleBookNow = () => {
    if (product) {
      dispatch(setSelectedProduct(product))
      dispatch(openBuyNowModal())
    }
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-full border border-gray-100 h-full flex flex-col min-w-0">
      {/* Product Image Container */}
      <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[400px] bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden flex-shrink-0">
        {/* Product Image */}
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5 lg:space-y-6 flex-1 flex flex-col">
        {/* Content Section */}
        <div className="space-y-3 sm:space-y-4">
          {/* Product Name */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            <span className="font-extrabold bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">
              {name.split(' ')[0].toUpperCase()}
            </span> {name.split(' ').slice(1).join(' ')}
          </h3>

          {/* Specifications */}
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
            {specifications}
          </p>

          {/* Pricing */}
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-gray-500">Introductory Price</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{price}</p>
          </div>
        </div>

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1"></div>

        {/* CTA Buttons */}
        <div className="space-y-2 sm:space-y-3 pt-2">
          {slug ? (
            <Link
              href={`/product/${slug}`}
              onClick={handleExplore}
              className="w-full bg-gray-900 text-white font-medium text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="truncate">{primaryButtonText}</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleExplore}
              className="w-full bg-gray-900 text-white font-medium text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="truncate">{primaryButtonText}</span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </button>
          )}
          
          {product ? (
            <button 
              type="button"
              onClick={handleBookNow}
              className="w-full text-gray-900 font-bold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200"
            >
              <span className="truncate">{secondaryButtonText}</span>
            </button>
          ) : (
            <button 
              type="button"
              className="w-full text-gray-900 font-bold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200"
            >
              <span className="truncate">{secondaryButtonText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default GigCard
