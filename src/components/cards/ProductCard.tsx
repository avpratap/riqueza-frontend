'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store/store'
import { openBuyNowModal } from '@/store/slices/uiSlice'
import { setSelectedProduct } from '@/store/slices/productSlice'
import { Product, ProductVariant } from '@/store/slices/productSlice'

// Extended Product interface for display purposes
interface DisplayProduct extends Product {
  displayType?: 'main' | 'variant'
  variant?: ProductVariant
  displayId?: string
}

interface ProductCardProps {
  product: DisplayProduct
  primaryButtonText: string
  secondaryButtonText: string
  gradientFrom: string
  gradientTo: string
}

const ProductCard = ({
  product,
  primaryButtonText,
  secondaryButtonText,
  gradientFrom,
  gradientTo
}: ProductCardProps) => {
  const dispatch = useDispatch<AppDispatch>()
  
  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]
  const lowestPrice = product.variants && product.variants.length > 0 ? Math.min(...product.variants.map(v => v.price)) : 0
  const highestPrice = product.variants && product.variants.length > 0 ? Math.max(...product.variants.map(v => v.price)) : 0
  
  const handleExplore = () => {
    // Navigation will be handled by Link component
  }
  
  const handleBuyNow = () => {
    dispatch(setSelectedProduct(product))
    dispatch(openBuyNowModal())
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-full max-w-[400px] flex flex-col flex-shrink-0 min-w-0">
      {/* Product Image Container */}
      <div className={`relative h-[350px] sm:h-[400px] lg:h-[450px] bg-gradient-to-br ${gradientFrom} ${gradientTo} overflow-hidden flex-shrink-0`}>
        {/* View in 360° Button */}
        <div className="absolute top-4 right-4 z-10">
          <button className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-lg hover:bg-white transition-all duration-200 shadow-md flex items-center gap-2">
            View in 360° <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Product Image */}
        <Image
          src={primaryImage?.image_url || '/images/placeholder.png'}
          alt={primaryImage?.alt_text || product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Product Content */}
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-5">
        {/* Product Name */}
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          <span className="font-extrabold bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">{product.name.split(' ')[0].toUpperCase()}</span> {product.name.split(' ').slice(1).join(' ')}
        </h3>

        {/* Specifications */}
        <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
          {product.displayType === 'variant' && product.variant 
            ? `${product.variant.range_km}km Range | 0-40 km/h in ${product.variant.acceleration_sec} sec`
            : 'Multiple variants available - See options below'
          }
        </p>

        {/* Pricing */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-gray-500">
            {product.displayType === 'variant' ? 'Price' : 'Starting from'}
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {product.displayType === 'variant' && product.variant
              ? `₹${product.variant.price.toLocaleString('en-IN')}`
              : `₹${lowestPrice.toLocaleString('en-IN')}`
            }
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-2 sm:space-y-3 pt-2">
          <Link
            href={`/product/${product.slug}`}
            onClick={handleExplore}
            className="w-full bg-gray-900 text-white font-medium text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span className="truncate">{primaryButtonText}</span>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
          </Link>
          
          <button 
            type="button"
            onClick={handleBuyNow}
            className="w-full text-gray-900 font-bold text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 border border-gray-200"
          >
            <span className="truncate">{secondaryButtonText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
