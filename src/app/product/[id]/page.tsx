'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { fetchProductBySlug, fetchProducts, setSelectedProduct } from '@/store/slices/productSlice'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductHero from '@/components/sections/ProductHero'
import ChooseYourPro from '@/components/sections/ChooseYourPro'
import ProductTabsSection from '@/components/sections/ProductTabsSection'
import ProductCustomization from '@/components/sections/ProductCustomization'
import ComparisonTable from '@/components/sections/ComparisonTable'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedProduct, isLoading, error, products } = useSelector((state: RootState) => state.products)
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Reset selected product when params change
  useEffect(() => {
    dispatch(setSelectedProduct(null))
    setHasAttemptedFetch(false)
    setIsInitialLoading(true)
  }, [dispatch, params.id])

  // Fetch product by slug
  useEffect(() => {
    if (params.id && !hasAttemptedFetch) {
      setIsInitialLoading(true)
      setHasAttemptedFetch(true)
      dispatch(fetchProductBySlug(params.id))
        .then((result) => {
          // Wait a bit to ensure state updates
          setTimeout(() => {
            setIsInitialLoading(false)
          }, 100)
        })
        .catch(() => {
          setTimeout(() => {
            setIsInitialLoading(false)
          }, 100)
        })
    }
  }, [dispatch, params.id, hasAttemptedFetch])

  // Also update loading state based on Redux isLoading
  useEffect(() => {
    if (hasAttemptedFetch && !isLoading && selectedProduct) {
      setIsInitialLoading(false)
    }
  }, [isLoading, selectedProduct, hasAttemptedFetch])

  // Separate useEffect for fetching all products (for ChooseYourPro)
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts())
    }
  }, [dispatch, products.length])

  // Show loading state while initially fetching
  // Don't show error until we've actually attempted to fetch and it's complete
  if (isInitialLoading || (isLoading && hasAttemptedFetch)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading product...</p>
        </div>
      </div>
    )
  }

  // Only show error if we've attempted to fetch, it's complete, and it failed
  if (hasAttemptedFetch && !isLoading && (error || !selectedProduct)) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-2">Product not found</p>
          {error && <p className="text-red-300 mb-2">Error: {error}</p>}
          <p className="text-gray-400 mb-6">Slug: {params.id}</p>
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <ProductHero product={selectedProduct} />
      <ChooseYourPro product={selectedProduct} />
      <ProductTabsSection />
      <ProductCustomization />
      <ComparisonTable />
      <Footer />
    </div>
  )
}
