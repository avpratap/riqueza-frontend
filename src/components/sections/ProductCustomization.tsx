'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const ProductCustomization = () => {
  const [selectedColor, setSelectedColor] = useState(0)
  const [is360View, setIs360View] = useState(false)
  const [rotationAngle, setRotationAngle] = useState(0)

  const colors = [
    {
      id: 0,
      name: 'Silver',
      image: '/images/scoty.png',
      colorClass: 'bg-gray-400',
      filter: 'grayscale(1)'
    },
    {
      id: 1,
      name: 'Passion Red',
      image: '/images/scoty.png',
      colorClass: 'bg-red-500',
      filter: 'hue-rotate(0deg) saturate(1.5)'
    },
    {
      id: 2,
      name: 'Stellar Blue',
      image: '/images/scoty.png',
      colorClass: 'bg-blue-500',
      filter: 'hue-rotate(200deg) saturate(1.2)'
    },
    {
      id: 3,
      name: 'Midnight Blue',
      image: '/images/scoty.png',
      colorClass: 'bg-blue-900',
      filter: 'hue-rotate(220deg) saturate(1.5)'
    }
  ]

  const handleColorChange = (colorId: number) => {
    setSelectedColor(colorId)
  }

  const handle360ViewToggle = () => {
    setIs360View(!is360View)
    if (!is360View) {
      setRotationAngle(0)
    }
  }

  // Auto-rotation when 360° view is active
  useEffect(() => {
    if (is360View) {
      const interval = setInterval(() => {
        setRotationAngle(prev => (prev + 0.5) % 360)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [is360View])

  return (
    <section className="w-full bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            {/* Left Section - Text and Color Selection */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              {/* Heading */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                  Custom made.
                  <br />
                  <span className="font-normal bg-gradient-to-r from-blue-600 via-teal-500 to-yellow-500 bg-clip-text text-transparent">For you</span>
                </h2>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Go glossy. Go matte. Go full technicolour.
                  <br />
                  Choose your vibe here.
                </p>
              </div>

              {/* Color Selection */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Selected Color Name */}
                <div className="text-xl sm:text-2xl lg:text-3xl font-medium text-gray-900">
                  {colors[selectedColor].name}
                </div>

                {/* Color Swatches */}
                <div className="flex gap-3 sm:gap-4 lg:gap-6 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full border-2 transition-all duration-200 hover:scale-105 ${
                        selectedColor === color.id
                          ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/30'
                          : 'border-gray-300 hover:border-gray-400'
                      } ${color.colorClass}`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* 360° View Button */}
              <div>
                <button 
                  onClick={handle360ViewToggle}
                  className={`w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl font-semibold text-base sm:text-lg lg:text-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 ${
                    is360View 
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                      : 'bg-gradient-to-r from-blue-600 via-teal-500 to-yellow-500 text-white'
                  }`}
                >
                  {is360View ? 'Exit 360°' : 'View in 360°'}
                  <span className={`w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full ${is360View ? 'animate-spin' : 'animate-pulse'}`}></span>
                </button>
              </div>
            </div>

            {/* Right Section - Product Image */}
            <div className="relative order-first lg:order-last">
              <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
                  <div 
                    className="transition-transform duration-100 ease-out"
                    style={{ 
                      transform: `rotateY(${rotationAngle}deg)`,
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <Image
                      src={colors[selectedColor].image}
                      alt={colors[selectedColor].name}
                      width={600}
                      height={600}
                      className="object-contain object-center transition-all duration-500 hover:scale-105"
                      style={{ filter: colors[selectedColor].filter }}
                      priority
                    />
                  </div>
                </div>
                
                {/* 360° View Instructions */}
                {is360View && (
                  <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                    Auto-rotating
                  </div>
                )}
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductCustomization
