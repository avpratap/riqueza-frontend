'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { setAuthModalOpen } from '@/store/slices/uiSlice'
import Header from '@/components/layout/Header'
import Hero from '@/components/sections/Hero'
import Features from '@/components/sections/Features'
import Products from '@/components/sections/Products'
import EVCalculator from '@/components/sections/EVCalculator'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/layout/Footer'
import AuthModal from '@/components/auth/AuthModal'

export default function Home() {
  const dispatch = useDispatch()
  const { isAuthModalOpen, authModalMode } = useSelector((state: RootState) => state.ui)
  

  return (
    <div className="min-h-screen flex flex-col max-w-full overflow-x-hidden">
      <Header />
      <main className="flex-1 max-w-full overflow-x-hidden">
        <Hero />
        <Products />
        <Features />
        <EVCalculator />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      
      {/* Auth Modal at root level */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => dispatch(setAuthModalOpen(false))}
      />
      
    </div>
  )
}
