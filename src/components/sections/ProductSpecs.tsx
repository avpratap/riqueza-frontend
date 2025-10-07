'use client'

import { Zap, Gauge, Timer, Target } from 'lucide-react'

const ProductSpecs = () => {
  const specs = [
    {
      icon: <Zap className="w-6 h-6 text-orange-500" />,
      label: 'Peak Power',
      value: '13kW'
    },
    {
      icon: <Gauge className="w-6 h-6 text-blue-500" />,
      label: 'Top Speed',
      value: '141 kmph'
    },
    {
      icon: <Timer className="w-6 h-6 text-green-500" />,
      label: 'Range (IDC)',
      value: '320 km'
    },
    {
      icon: <Target className="w-6 h-6 text-purple-500" />,
      label: 'Acceleration',
      value: '0-40km in 2.1sec'
    }
  ]

  return (
    <div className="absolute bottom-8 left-8 right-8">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((spec, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                {spec.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {spec.value}
              </div>
              <div className="text-sm text-gray-600">
                {spec.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductSpecs
