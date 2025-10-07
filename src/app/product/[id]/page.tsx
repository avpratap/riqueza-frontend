'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { fetchProductBySlug, fetchProducts } from '@/store/slices/productSlice'
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
  const { selectedProduct, isLoading, error } = useSelector((state: RootState) => state.products)

  useEffect(() => {
    if (params.id) {
      dispatch(fetchProductBySlug(params.id))
    }
  }, [dispatch, params.id])

  // Separate useEffect for fetching all products (for ChooseYourPro)
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Product not found</p>
          {error && <p className="text-red-300 mt-2">Error: {error}</p>}
          <p className="text-gray-400 mt-4">Slug: {params.id}</p>
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
