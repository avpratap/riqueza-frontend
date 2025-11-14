'use client'

import Image from 'next/image'

const Performance = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-8 sm:mb-10 lg:mb-12 xl:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">Performance</h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600">Ready. Set. Thrill.</p>
      </div>

      {/* Performance Cards Grid - 2 rows with asymmetric layout (same as Technology) */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* Top Row - Top Speed (wider) + Range (smaller) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Top Speed Card - Wider, spans 2 columns */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden relative md:col-span-2 group">
            {/* Background Image */}
            <div className="relative w-full aspect-[3/2] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
              <Image
                src="/images/P1.webp"
                alt="Top Speed"
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
                    Top Speed
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    141kmph Top Speed. Got a racing suit?
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Range Card - Smaller */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden relative group">
            {/* Background Image */}
            <div className="relative w-full aspect-[3/4] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
              <Image
                src="/images/P2.webp"
                alt="Range (IDC)"
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
                    Range (IDC)
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    320 km range (IDC). Go far. and then some.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Acceleration (smaller) + Manufacturing (wider) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Acceleration Card - Smaller */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden relative group">
            {/* Background Image */}
            <div className="relative w-full aspect-[3/4] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
              <Image
                src="/images/P3.webp"
                alt="Acceleration"
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
                    Acceleration
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    0-40km in 2.1sec. Go fast. let go.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Manufacturing Card - Wider, spans 2 columns */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden relative md:col-span-2 group">
            {/* Background Image */}
            <div className="relative w-full aspect-[3/2] sm:aspect-auto sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
              <Image
                src="https://res.cloudinary.com/dnulm62j6/image/upload/v1763122630/about-us-manufacturing_mweb_v1_ncwc07.webp"
                alt="Manufacturing Excellence"
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
                    Manufacturing Excellence
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    Crafted with precision and dedication to quality
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

export default Performance