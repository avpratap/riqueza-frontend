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
      className={`relative flex-shrink-0 w-48 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
        isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      {/* Recommended Badge */}
      {recommended && (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">
          Recommended
        </div>
      )}
      
      {/* Duration */}
      <div className="font-semibold text-gray-900 text-lg mb-2">{duration}</div>
      
      {/* Description */}
      <div className="text-sm text-gray-600 mb-3">{description}</div>
      
      {/* Price Section */}
      <div className="space-y-1">
        <div className="font-bold text-gray-900 text-lg">
          ₹{price.toLocaleString('en-IN')}
        </div>
        
        {/* Original Price and Savings */}
        {originalPrice && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
            {savings && (
              <span className="text-sm text-green-600 font-semibold">
                {savings}
              </span>
            )}
          </div>
        )}
        
        {/* Add-ons Note */}
        <div className="text-xs text-gray-400 italic">
          *Incl. of add-ons
        </div>
      </div>
    </div>
  )
}

export default DamagePlanCard
