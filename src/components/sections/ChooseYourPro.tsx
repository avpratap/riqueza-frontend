'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { setSelectedProduct } from '@/store/slices/productSlice'
import { openBuyNowModal } from '@/store/slices/uiSlice'
import ProCard from '@/components/cards/ProCard'

interface ChooseYourProProps {
  product?: any
}

const ChooseYourPro = ({ product }: ChooseYourProProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { products, isLoading, error } = useSelector((state: RootState) => state.products)

  const handleOrderNow = (selectedProduct: any) => {
    dispatch(setSelectedProduct(selectedProduct))
    dispatch(openBuyNowModal())
  }

  // Products are already fetched by parent component

  // Create pro products from backend data - Show MAXIMUM values
  const createProProducts = () => {
    return products.map(product => {
      const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0]
      const highestPrice = Math.max(...product.variants.map((v: any) => v.price))
      const highestRange = Math.max(...product.variants.map((v: any) => v.range_km))
      const highestSpeed = Math.max(...product.variants.map((v: any) => v.top_speed_kmh))
      const bestAcceleration = Math.min(...product.variants.map((v: any) => v.acceleration_sec))
      
      // Get maximum battery capacity
      const maxBatteryCapacity = Math.max(...product.variants.map((v: any) => parseFloat(v.battery_capacity.replace('kWh', ''))))
      
      return {
        name: product.name,
        variant: '',
        image: primaryImage?.image_url || 'https://res.cloudinary.com/dnulm62j6/image/upload/v1758559111/ola_s1pro_plus_gen3_web_image_v2_1_xz59rm.webp',
        alt: product.name,
        batteryCapacity: `${maxBatteryCapacity} kWh`,
        range: `${highestRange} km`,
        topSpeed: `${highestSpeed} km/h`,
        peakPower: '13kW', // This could be dynamic if we add it to variants
        acceleration: `0-40km in ${bestAcceleration}sec`,
        startingPrice: `₹${highestPrice.toLocaleString('en-IN')}*`,
        product: product // Pass the full product object for navigation
      }
    })
  }

  const proProducts = createProProducts()

  // Show loading state
  if (isLoading) {
    return (
      <section className="w-full bg-gray-900 py-20">
        <div className="relative z-10 w-full px-8 lg:px-16">
          <div className="w-full text-left mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose your Pro
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-xl">Loading products...</div>
          </div>
        </div>
      </section>
    )
  }

  // Show error state
  if (error) {
    return (
      <section className="w-full bg-gray-900 py-20">
        <div className="relative z-10 w-full px-8 lg:px-16">
          <div className="w-full text-left mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose your Pro
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="text-red-400 text-xl">Error loading products: {error}</div>
          </div>
        </div>
      </section>
    )
  }

  // Show empty state
  if (!products || products.length === 0) {
    return (
      <section className="w-full bg-gray-900 py-20">
        <div className="relative z-10 w-full px-8 lg:px-16">
          <div className="w-full text-left mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose your Pro
            </h2>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-xl">No products available</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-gray-900 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-12 lg:pb-16">
      {/* Diagonal pattern background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`
        }}></div>
      </div>
      
      {/* Section Header - Left aligned */}
      <div className="relative z-10 w-full text-left mb-6 sm:mb-8 lg:mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
          Choose your <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">Pro</span>
        </h2>
      </div>

      {/* Pro Products Container - Grid Layout for All Screen Sizes */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        {/* Grid Layout for All Screen Sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-6 xl:gap-8 w-full">
          {proProducts.map((proProduct, index) => (
            <ProCard
              key={index}
              name={proProduct.name}
              variant={proProduct.variant}
              image={proProduct.image}
              alt={proProduct.alt}
              batteryCapacity={proProduct.batteryCapacity}
              range={proProduct.range}
              topSpeed={proProduct.topSpeed}
              peakPower={proProduct.peakPower}
              acceleration={proProduct.acceleration}
              startingPrice={proProduct.startingPrice}
              product={proProduct.product}
              onOrderNow={() => handleOrderNow(proProduct.product)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ChooseYourPro
