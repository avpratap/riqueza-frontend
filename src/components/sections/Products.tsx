// 'use client'

// import { useEffect } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { RootState, AppDispatch } from '@/store/store'
// import { fetchProducts, setSelectedProduct } from '@/store/slices/productSlice'
// import ProductCard from '@/components/cards/ProductCard'
// import GigCard from '@/components/cards/GigCard'

// const Products = () => {
//   const dispatch = useDispatch<AppDispatch>()
//   const { products, isLoading, error } = useSelector((state: RootState) => state.products)

//   useEffect(() => {
//     dispatch(fetchProducts())
//   }, [dispatch])

//   const handleViewProduct = (product: any) => {
//     dispatch(setSelectedProduct(product))
//   }

//   if (isLoading) {
//     return (
//       <section className="w-full pt-20">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading products...</p>
//         </div>
//       </section>
//     )
//   }

//   if (error) {
//     return (
//       <section className="w-full pt-20">
//         <div className="text-center">
//           <p className="text-red-600">Error loading products: {error}</p>
//         </div>
//       </section>
//     )
//   }

//   // Create display products from ALL variants only (no main products to avoid duplicates)
//   const createDisplayProducts = () => {
//     const displayProducts: any[] = []
    
//     products.forEach((product, productIndex) => {
//       // Add ONLY variants of the product (no main product to avoid duplicates)
//       if (product.variants && product.variants.length > 0) {
//         product.variants.forEach((variant, variantIndex) => {
//           displayProducts.push({
//             ...product,
//             // Keep original product ID - use displayId for unique key instead
//             displayId: `${product.id}-variant-${variant.id}`,
//             name: product.name, // Keep original name without range
//             displayType: 'variant',
//             variant: variant,
//             gradientFrom: variantIndex % 2 === 0 ? 'from-gray-100' : 'from-green-100',
//             gradientTo: variantIndex % 2 === 0 ? 'to-gray-200' : 'to-green-200'
//           })
//         })
//       }
//     })
    
//     return displayProducts
//   }

//   const displayProducts = createDisplayProducts()

//   // Create gig products from main products
//   const createGigProducts = () => {
//     return products.map(product => {
//       const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0]
//       const lowestPrice = Math.min(...product.variants.map((v: any) => v.price))
//       const highestRange = Math.max(...product.variants.map((v: any) => v.range_km))
//       const bestAcceleration = Math.min(...product.variants.map((v: any) => v.acceleration_sec))
      
//       return {
//         name: product.name, // Use the product name directly (e.g., "Riqueza S1 Pro+")
//         image: primaryImage?.image_url || 'https://res.cloudinary.com/dnulm62j6/image/upload/v1758559111/ola_s1pro_plus_gen3_web_image_v2_1_xz59rm.webp',
//         alt: product.name,
//         specifications: `${highestRange}km Range | 0-40 km/h in ${bestAcceleration} sec | Up to 2 portable batteries`,
//         price: `₹ ${lowestPrice.toLocaleString('en-IN')}`,
//         primaryButtonText: `Explore ${product.name}`,
//         secondaryButtonText: 'Book Now',
//         product: product,
//         slug: product.slug
//       }
//     })
//   }

//   const gigProducts = createGigProducts()

//   return (
//     <>
//       {/* Original Products Section - Horizontal Scroll Only */}
//       <section className="w-full bg-gray-50 py-8 sm:py-12 lg:py-16">
//         {/* Section Header - Responsive */}
//         <div className="w-full text-center mb-6 sm:mb-8 lg:mb-12 px-4 sm:px-6 lg:px-8">
//           <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
//             Choose from our <span className="bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">2nd Gen portfolio</span> with exciting offers
//           </h2>
//         </div>

//         {/* Horizontal Scroll Container - Mobile Responsive */}
//         <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
//           <div className="w-full flex gap-3 sm:gap-4 lg:gap-2 xl:gap-3 overflow-x-auto pb-4 scrollbar-hide">
//             {displayProducts.map((product, index) => (
//               <div 
//                 key={product.displayId || product.id}
//                 className="flex-shrink-0 w-72 sm:w-80 md:w-96 lg:w-112 xl:w-128"
//               >
//                 <ProductCard
//                   product={product}
//                   primaryButtonText={`Explore ${product.name}`}
//                   secondaryButtonText="Book Now"
//                   gradientFrom={product.gradientFrom}
//                   gradientTo={product.gradientTo}
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* New Gig Section - "Your reliable partner for every gig" */}
//       <section className="w-full bg-gray-50 py-20">
//         {/* Section Header */}
//         <div className="w-full text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//             Your reliable partner for every <span className="bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">Electric Vehicle</span>
//           </h2>
//         </div>

//         {/* Gig Products Container */}
//         <div className="w-full px-8 lg:px-16">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
//             {gigProducts.map((gigProduct, index) => (
//               <GigCard
//                 key={index}
//                 name={gigProduct.name}
//                 image={gigProduct.image}
//                 alt={gigProduct.alt}
//                 specifications={gigProduct.specifications}
//                 price={gigProduct.price}
//                 primaryButtonText={gigProduct.primaryButtonText}
//                 secondaryButtonText={gigProduct.secondaryButtonText}
//                 product={gigProduct.product}
//                 slug={gigProduct.slug}
//               />
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }

// export default Products





'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { fetchProducts, setSelectedProduct } from '@/store/slices/productSlice'
import ProductCard from '@/components/cards/ProductCard'
import GigCard from '@/components/cards/GigCard'

const Products = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { products, isLoading, error } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const handleViewProduct = (product: any) => {
    dispatch(setSelectedProduct(product))
  }

  if (isLoading) {
    return (
      <section className="w-full pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full pt-20">
        <div className="text-center">
          <p className="text-red-600">Error loading products: {error}</p>
        </div>
      </section>
    )
  }

  // Create display products from ALL variants only (no main products to avoid duplicates)
  const createDisplayProducts = () => {
    const displayProducts: any[] = []
    
    products.forEach((product, productIndex) => {
      // Add ONLY variants of the product (no main product to avoid duplicates)
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant, variantIndex) => {
          displayProducts.push({
            ...product,
            // Keep original product ID - use displayId for unique key instead
            displayId: `${product.id}-variant-${variant.id}`,
            name: product.name, // Keep original name without range
            displayType: 'variant',
            variant: variant,
            gradientFrom: variantIndex % 2 === 0 ? 'from-gray-100' : 'from-green-100',
            gradientTo: variantIndex % 2 === 0 ? 'to-gray-200' : 'to-green-200'
          })
        })
      }
    })
    
    return displayProducts
  }

  const displayProducts = createDisplayProducts()

  // Create gig products from main products with top variant details
  const createGigProducts = () => {
    return products.map(product => {
      const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0]
      const lowestPrice = Math.min(...product.variants.map((v: any) => v.price))
      const topVariant = product.variants.find((v: any) => v.price === lowestPrice) || product.variants[0]
      
      return {
        name: product.name,
        image: primaryImage?.image_url || 'https://res.cloudinary.com/dnulm62j6/image/upload/v1758559111/ola_s1pro_plus_gen3_web_image_v2_1_xz59rm.webp',
        alt: product.name,
        specifications: `${topVariant.range_km}km Range | 0-40 km/h in ${topVariant.acceleration_sec} sec`,
        price: `₹${topVariant.price.toLocaleString('en-IN')}`,
        primaryButtonText: `Explore ${product.name}`,
        secondaryButtonText: 'Book Now',
        product: product,
        slug: product.slug,
        variant: topVariant
      }
    })
  }

  const gigProducts = createGigProducts()

  return (
    <>
      {/* Original Products Section - Horizontal Scroll Only */}
      <section className="w-full bg-gray-50 pt-8 sm:pt-12 lg:pt-16">
        {/* Section Header - Responsive */}
        <div className="w-full text-center mb-6 sm:mb-8 lg:mb-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Choose from our <span className="bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">2nd Gen portfolio</span> with exciting offers
          </h2>
        </div>

        {/* Horizontal Scroll Container - Mobile Responsive */}
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 max-w-full overflow-hidden">
          <div className="w-full flex gap-3 sm:gap-4 lg:gap-2 xl:gap-3 overflow-x-auto pb-4 scrollbar-hide max-w-full">
            {displayProducts.map((product, index) => (
              <div 
                key={product.displayId || product.id}
                className="flex-shrink-0 w-72 sm:w-80 md:w-96 lg:w-112 xl:w-128 max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw]"
              >
                <ProductCard
                  product={product}
                  primaryButtonText={`Explore ${product.name}`}
                  secondaryButtonText="Book Now"
                  gradientFrom={product.gradientFrom}
                  gradientTo={product.gradientTo}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Gig Section - "Your reliable partner for every gig" */}
      <section className="w-full bg-gray-50 pt-8 sm:pt-12 lg:pt-16">
        {/* Section Header - Responsive */}
        <div className="w-full text-center mb-6 sm:mb-8 lg:mb-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 leading-tight">
            Your reliable partner for every <span className="bg-gradient-to-r from-blue-600 via-teal-500 via-green-500 to-yellow-500 bg-clip-text text-transparent">Electric Vehicle</span>
          </h2>
        </div>

        {/* Gig Products Container - Responsive Layout */}
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8">
          {/* Desktop/Laptop: Grid Layout (2 cards side by side) */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-6 xl:gap-8 w-full">
            {gigProducts.map((gigProduct, index) => (
              <GigCard
                key={index}
                name={gigProduct.name}
                image={gigProduct.image}
                alt={gigProduct.alt}
                specifications={gigProduct.specifications}
                price={gigProduct.price}
                primaryButtonText={gigProduct.primaryButtonText}
                secondaryButtonText={gigProduct.secondaryButtonText}
                product={gigProduct.product}
                slug={gigProduct.slug}
                variant={gigProduct.variant}
              />
            ))}
          </div>

          {/* Tablet/Mobile: Horizontal Scroll Layout */}
          <div className="lg:hidden max-w-full overflow-hidden">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide max-w-full">
              {gigProducts.map((gigProduct, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 w-80 sm:w-96 max-w-[90vw] sm:max-w-[80vw]"
                >
                  <GigCard
                    name={gigProduct.name}
                    image={gigProduct.image}
                    alt={gigProduct.alt}
                    specifications={gigProduct.specifications}
                    price={gigProduct.price}
                    primaryButtonText={gigProduct.primaryButtonText}
                    secondaryButtonText={gigProduct.secondaryButtonText}
                    product={gigProduct.product}
                    slug={gigProduct.slug}
                    variant={gigProduct.variant}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Products
