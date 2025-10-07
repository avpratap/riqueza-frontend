'use client'

import Image from 'next/image'

const Technology = () => {
  return (
    <div>
      {/* Section Header */}
      <div className="mb-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Technology</h2>
        <p className="text-xl text-gray-600">Features that will redefine your ride.</p>
      </div>

        {/* Technology Cards Grid - 2 rows with asymmetric layout */}
        <div className="space-y-6">
          {/* Top Row - Dual ABS (wider) + Mid drive motor (smaller) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dual ABS Card - Wider, spans 2 columns */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden relative md:col-span-2">
              {/* Background Image */}
              <div className="relative w-full">
                <Image
                  src="/images/t1.webp"
                  alt="Dual ABS"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-start">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Dual ABS
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Advanced electronics and software led anti-lock braking for better safety
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mid drive motor Card - Smaller */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden relative">
              {/* Background Image */}
              <div className="relative w-full">
                <Image
                  src="/images/t2.webp"
                  alt="Mid drive motor"
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-start">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Mid drive motor
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      With integrated MCU and chain drive
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Brake by wire (smaller) + MoveOS5 features (wider) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brake by wire Card - Smaller */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden relative">
              {/* Background Image */}
              <div className="relative w-full">
                <Image
                  src="/images/t3.webp"
                  alt="Brake by wire"
                  width={300}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-start">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Brake by wire
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Patented braking system for better range and control
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MoveOS5 features Card - Wider, spans 2 columns */}
            <div className="bg-blue-900 rounded-2xl overflow-hidden relative md:col-span-2">
              {/* Background Image */}
              <div className="relative w-full">
                <Image
                  src="/images/t4.webp"
                  alt="MoveOS5 features"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-start">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      MoveOS5 features
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed">
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
