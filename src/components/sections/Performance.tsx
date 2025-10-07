'use client'

import Image from 'next/image'
import { Zap, Gauge, Timer, Target, Disc } from 'lucide-react'

const Performance = () => {
  const performanceCards = [
    {
      id: 'peak-power',
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      title: '13kW Peak power.',
      subtitle: 'Feel the adrenaline.',
      bgColor: 'bg-orange-50',
      image: null
    },
    {
      id: 'top-speed',
      icon: <Gauge className="w-8 h-8 text-blue-600" />,
      title: 'Top Speed',
      subtitle: '141kmph Top Speed',
      description: 'Got a racing suit?',
      bgColor: 'bg-blue-100',
      image: '/images/P1.webp'
    },
    {
      id: 'hyper-mode',
      icon: <Timer className="w-8 h-8 text-blue-500" />,
      title: 'Hyper Mode',
      subtitle: 'Turbocharge with a tap of a button',
      bgColor: 'bg-blue-50',
      image: null
    },
    {
      id: 'range',
      icon: null,
      title: 'Range (IDC)',
      subtitle: '320 km range (IDC).',
      description: 'Go far. and then some.',
      bgColor: 'bg-blue-100',
      image: '/images/P2.webp'
    },
    {
      id: 'dual-disc-brakes',
      icon: <Disc className="w-8 h-8 text-orange-500" />,
      title: 'Dual disc brakes',
      subtitle: 'No slipping. No sliding.',
      bgColor: 'bg-orange-50',
      image: null
    },
    {
      id: 'acceleration',
      icon: <Target className="w-8 h-8 text-gray-600" />,
      title: 'Acceleration',
      subtitle: '0-40km in 2.1sec',
      description: 'Go fast. let go.',
      bgColor: 'bg-gray-100',
      image: '/images/P3.webp'
    }
  ]

  return (
    <div>
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Performance</h2>
        <p className="text-xl text-blue-600 font-medium">Ready. Set. Thrill.</p>
      </div>

      {/* Performance Cards Grid - Exact layout matching second screenshot */}
      <div className="grid grid-cols-3 gap-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          {/* Peak Power Card */}
          <div className="bg-orange-50 rounded-2xl overflow-hidden relative p-6 flex flex-col justify-start h-48">
            <div className="relative z-10">
              <div className="mb-4">
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                13kW Peak power.
              </h3>
              <p className="text-sm text-gray-700">
                Feel the adrenaline.
              </p>
            </div>
          </div>

          {/* Range Card - Full background image */}
          <div className="rounded-2xl overflow-hidden relative">
            {/* Full background image */}
            <div className="relative w-full">
              <Image
                src="/images/P2.webp"
                alt="Range"
                width={400}
                height={300}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
              {/* Text overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <h3 className="text-xl font-bold text-white mb-2">
                  Range (IDC)
                </h3>
                <p className="text-sm text-white mb-1">
                  320 km range (IDC).
                </p>
                <p className="text-sm text-white/90">
                  Go far. and then some.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          {/* Top Speed Card - Full background image, tallest */}
          <div className="rounded-2xl overflow-hidden relative">
            {/* Full background image */}
            <div className="relative w-full">
              <Image
                src="/images/P1.webp"
                alt="Top Speed"
                width={400}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
              {/* Text overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <div className="mb-4">
                  <Gauge className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Top Speed
                </h3>
                <p className="text-sm text-white mb-1">
                  141kmph Top Speed
                </p>
                <p className="text-sm text-white/90">
                  Got a racing suit?
                </p>
              </div>
            </div>
          </div>

          {/* Dual Disc Brakes Card */}
          <div className="bg-orange-50 rounded-2xl overflow-hidden relative p-6 flex flex-col justify-start h-32">
            <div className="relative z-10">
              <div className="mb-2">
                <Disc className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Dual disc brakes
              </h3>
              <p className="text-sm text-gray-700">
                No slipping. No sliding.
              </p>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          {/* Hyper Mode Card */}
          <div className="bg-blue-50 rounded-2xl overflow-hidden relative p-6 flex flex-col justify-start h-40">
            <div className="relative z-10">
              <div className="mb-4">
                <Timer className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Hyper Mode
              </h3>
              <p className="text-sm text-gray-700">
                Turbocharge with a tap of a button
              </p>
            </div>
          </div>

          {/* Acceleration Card - Full background image */}
          <div className="rounded-2xl overflow-hidden relative">
            {/* Full background image */}
            <div className="relative w-full">
              <Image
                src="/images/P3.webp"
                alt="Acceleration"
                width={400}
                height={300}
                className="w-full h-auto object-cover"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20"></div>
              {/* Text overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-start">
                <div className="mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Acceleration
                </h3>
                <p className="text-sm text-white mb-1">
                  0-40km in 2.1sec
                </p>
                <p className="text-sm text-white/90">
                  Go fast. let go.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Performance