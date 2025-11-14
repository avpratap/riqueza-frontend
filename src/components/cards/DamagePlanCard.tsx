'use client'

interface DamagePlanCardProps {
  duration: string
  description: string
  price: number
  originalPrice?: number
  savings?: string
  recommended?: boolean
  isSelected: boolean
  onSelect: () => void
}

const DamagePlanCard = ({
  duration,
  description,
  price,
  originalPrice,
  savings,
  recommended,
  isSelected,
  onSelect
}: DamagePlanCardProps) => {
  return (
    <div
      className={`relative flex-shrink-0 w-44 sm:w-48 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
          Recommended
        </div>
      )}
      
      {/* Duration */}
      <div className="font-semibold text-gray-900 text-base sm:text-lg mb-1.5 sm:mb-2 leading-tight">{duration}</div>
      
      {/* Description */}
      <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-relaxed">{description}</div>
      
      {/* Price Section */}
      <div className="space-y-1">
        <div className="font-bold text-gray-900 text-base sm:text-lg">
          ₹{price.toLocaleString('en-IN')}
        </div>
        
        {/* Original Price and Savings */}
        {originalPrice && (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
            {savings && (
              <span className="text-xs sm:text-sm text-green-600 font-semibold">
                {savings}
              </span>
            )}
          </div>
        )}
        
        {/* Add-ons Note */}
        <div className="text-[10px] sm:text-xs text-gray-400 italic">
          *Incl. of add-ons
        </div>
      </div>
    </div>
  )
}

export default DamagePlanCard
