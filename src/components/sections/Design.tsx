'use client'

import Image from 'next/image'
import { Shield, Wind, Palette, Heart } from 'lucide-react'

const Design = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-8 sm:mb-10 lg:mb-12 xl:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">Design</h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">Crafted for perfection. Built for performance.</p>
      </div>

      {/* Design Cards Grid - Same layout as Technology: 2 rows with asymmetric layout */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Top Row - Premium Materials (wider) + Sleek Aerodynamics (smaller) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Premium Materials Card - Wider, spans 2 columns */}
          <div className="bg-gray-50 rounded-3xl overflow-hidden relative md:col-span-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border-2 border-gray-100/50">
            {/* Background Image */}
            <div className="relative w-full aspect-[3/2] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
              <Image
                src="/images/D1.webp"
                alt="Premium Materials"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                priority
                quality={90}
              />
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/25 group-hover:from-black/85 group-hover:via-black/60 transition-all duration-300"></div>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-start z-10">
                <div className="relative z-10">
                  <div className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/25 backdrop-blur-md rounded-2xl group-hover:bg-white/35 group-hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
                    <Shield className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white group-hover:rotate-12 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2 sm:mb-3 leading-tight drop-shadow-2xl">
                    Premium Materials
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-white/95 leading-relaxed font-semibold drop-shadow-xl">
                    Crafted with the finest materials for durability and style
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sleek Aerodynamics Card - Smaller */}
          <div className="bg-gray-50 rounded-3xl overflow-hidden relative shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border-2 border-gray-100/50">
            {/* Background Image */}
            <div className="relative w-full aspect-[3/4] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
              <Image
                src="/images/D2.webp"
                alt="Sleek Aerodynamics"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                priority
                quality={90}
              />
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/25 group-hover:from-black/85 group-hover:via-black/60 transition-all duration-300"></div>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-start z-10">
                <div className="relative z-10">
                  <div className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/25 backdrop-blur-md rounded-2xl group-hover:bg-white/35 group-hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
                    <Wind className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white group-hover:rotate-12 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2 sm:mb-3 leading-tight drop-shadow-2xl">
                    Sleek Aerodynamics
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-white/95 leading-relaxed font-semibold drop-shadow-xl">
                    Wind-tunnel tested design for maximum efficiency
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Modern Aesthetics (smaller) + Ergonomic Comfort (wider) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Modern Aesthetics Card - Smaller */}
          <div className="bg-gray-50 rounded-3xl overflow-hidden relative shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border-2 border-gray-100/50">
            {/* Background Image */}
            <div className="relative w-full aspect-[3/4] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
              <Image
                src="/images/D3.webp"
                alt="Modern Aesthetics"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                priority
                quality={90}
              />
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/25 group-hover:from-black/85 group-hover:via-black/60 transition-all duration-300"></div>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-start z-10">
                <div className="relative z-10">
                  <div className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/25 backdrop-blur-md rounded-2xl group-hover:bg-white/35 group-hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
                    <Palette className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white group-hover:rotate-12 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2 sm:mb-3 leading-tight drop-shadow-2xl">
                    Modern Aesthetics
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-white/95 leading-relaxed font-semibold drop-shadow-xl">
                    Contemporary design that turns heads wherever you go
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ergonomic Comfort Card - Wider, spans 2 columns */}
          <div className="bg-gray-50 rounded-3xl overflow-hidden relative md:col-span-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border-2 border-gray-100/50">
            {/* Background Image */}
            <div className="relative w-full aspect-[3/2] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
              <Image
                src="/images/D4.webp"
                alt="Ergonomic Comfort"
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                priority
                quality={90}
              />
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/25 group-hover:from-black/85 group-hover:via-black/60 transition-all duration-300"></div>
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {/* Content Overlay */}
              <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-start z-10">
                <div className="relative z-10">
                  <div className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/25 backdrop-blur-md rounded-2xl group-hover:bg-white/35 group-hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
                    <Heart className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2 sm:mb-3 leading-tight drop-shadow-2xl">
                    Ergonomic Comfort
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-white/95 leading-relaxed font-semibold drop-shadow-xl">
                    Designed for comfort during long rides and daily commutes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Design
