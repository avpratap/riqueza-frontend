'use client'

import { ArrowRight, ShoppingCart } from 'lucide-react'

const ProductCTA = () => {
  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="w-full px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join thousands of riders who have already made the switch to electric mobility.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Order Now
            </button>
            
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 transition-colors duration-200 flex items-center justify-center gap-2">
              <ArrowRight className="w-5 h-5" />
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductCTA
