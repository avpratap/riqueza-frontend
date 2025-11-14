'use client'

import Image from 'next/image'

const Technology = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-8 sm:mb-10 lg:mb-12 xl:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">Technology</h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">Features that will redefine your ride.</p>
      </div>

        {/* Technology Cards Grid - 2 rows with asymmetric layout */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {/* Top Row - Dual ABS (wider) + Mid drive motor (smaller) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Dual ABS Card - Wider, spans 2 columns */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden relative md:col-span-2 group">
              {/* Background Image */}
              <div className="relative w-full aspect-[3/2] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
                <Image
                  src="/images/T1.webp"
                  alt="Dual ABS"
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  quality={90}
                />
                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-start">
                  <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                      Dual ABS
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Advanced electronics and software led anti-lock braking for better safety
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mid drive motor Card - Smaller */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden relative group">
              {/* Background Image */}
              <div className="relative w-full aspect-[3/4] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
                <Image
                  src="/images/T2.webp"
                  alt="Mid drive motor"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  quality={90}
                />
                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-start">
                  <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                      Mid drive motor
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      With integrated MCU and chain drive
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Brake by wire (smaller) + MoveOS5 features (wider) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Brake by wire Card - Smaller */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden relative group">
              {/* Background Image */}
              <div className="relative w-full aspect-[3/4] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
                <Image
                  src="/images/T3.webp"
                  alt="Brake by wire"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                  quality={90}
                />
                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-start">
                  <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                      Brake by wire
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      Patented braking system for better range and control
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MoveOS5 features Card - Wider, spans 2 columns */}
            <div className="bg-blue-900 rounded-2xl overflow-hidden relative md:col-span-2">
              {/* Background Image */}
              <div className="relative w-full aspect-[3/2] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
                <Image
                  src="/images/t4.webp"
                  alt="MoveOS5 features"
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                  priority
                  quality={90}
                />
                {/* Content Overlay */}
                <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-start">
                  <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 leading-tight">
                      MoveOS5 features
                    </h3>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      Features like SOS Alerts, Road Trip, Bharat Mood, Multi-mode Traction Control and much more
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

export default Technology
