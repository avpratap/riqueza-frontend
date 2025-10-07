'use client'

import Image from 'next/image'
import { Shield, Wind, Palette, Heart } from 'lucide-react'

const Design = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Design</h2>
        <p className="text-xl text-gray-600">Crafted for perfection. Built for performance.</p>
      </div>

      {/* Design Cards Grid - 2x2 equal grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Design Card 1 */}
        <div className="rounded-2xl overflow-hidden relative">
          <div className="relative w-full" style={{ height: '50rem' }}>
            <Image
              src="/images/d1.webp"
              alt="Premium Materials"
              fill
              className="w-full h-full object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>
            {/* Text overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-start">
              <div className="mb-6">
                <Shield className="w-12 h-12 text-white mb-4" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">
                Premium Materials
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                Crafted with the finest materials for durability and style
              </p>
            </div>
          </div>
        </div>

        {/* Design Card 2 */}
        <div className="rounded-2xl overflow-hidden relative">
          <div className="relative w-full" style={{ height: '50rem' }}>
            <Image
              src="/images/d2.webp"
              alt="Sleek Aerodynamics"
              fill
              className="w-full h-full object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>
            {/* Text overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-start">
              <div className="mb-6">
                <Wind className="w-12 h-12 text-white mb-4" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">
                Sleek Aerodynamics
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                Wind-tunnel tested design for maximum efficiency
              </p>
            </div>
          </div>
        </div>

        {/* Design Card 3 */}
        <div className="rounded-2xl overflow-hidden relative">
          <div className="relative w-full" style={{ height: '50rem' }}>
            <Image
              src="/images/d3.webp"
              alt="Modern Aesthetics"
              fill
              className="w-full h-full object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>
            {/* Text overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-start">
              <div className="mb-6">
                <Palette className="w-12 h-12 text-white mb-4" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">
                Modern Aesthetics
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                Contemporary design that turns heads wherever you go
              </p>
            </div>
          </div>
        </div>

        {/* Design Card 4 */}
        <div className="rounded-2xl overflow-hidden relative">
          <div className="relative w-full" style={{ height: '50rem' }}>
            <Image
              src="/images/d4.webp"
              alt="Ergonomic Comfort"
              fill
              className="w-full h-full object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>
            {/* Text overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-start">
              <div className="mb-6">
                <Heart className="w-12 h-12 text-white mb-4" />
              </div>
              <h3 className="text-4xl font-bold text-white mb-4">
                Ergonomic Comfort
              </h3>
              <p className="text-lg text-white/90 leading-relaxed">
                Designed for comfort during long rides and daily commutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Design
