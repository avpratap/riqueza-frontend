'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { setSelectedProduct } from '@/store/slices/productSlice';
import { openBuyNowModal } from '@/store/slices/uiSlice';
import VideoPreviewModal from '@/components/modals/VideoPreviewModal';

interface ProductHeroProps {
  product?: any;
}

const ProductHero = ({ product }: ProductHeroProps) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Get background image based on product
  const getBackgroundImage = () => {
    if (!product) {
      return "https://res.cloudinary.com/dnulm62j6/image/upload/v1758558786/s1_pro_plus_banner_web_v2_ttur01.webp";
    }
    
    // Use the same background images as Hero section
    if (product.slug === 'riqueza-s1-pro-plus' || product.name?.toLowerCase().includes('pro+')) {
      return "https://res.cloudinary.com/dnulm62j6/image/upload/v1758558786/s1_pro_plus_banner_web_v2_ttur01.webp";
    } else if (product.slug === 'riqueza-s1-pro' || product.name?.toLowerCase().includes('s1 pro')) {
      return "https://res.cloudinary.com/dnulm62j6/image/upload/v1758558786/s1_x_gen3_plus_banner_web_image_iuok1i.webp";
    }
    
    // Fallback to primary image from product
    const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
    return primaryImage?.image_url || "https://res.cloudinary.com/dnulm62j6/image/upload/v1758558786/s1_pro_plus_banner_web_v2_ttur01.webp";
  };


  const handleBuyNow = () => {
    if (product) {
      dispatch(setSelectedProduct(product));
      dispatch(openBuyNowModal());
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 pt-16">
      {/* Background Image - Full screen */}
      <div className="absolute inset-0">
        <Image
          src={getBackgroundImage()}
          alt={product?.name || "Riqueza Electric Scooter"}
          fill
          className="w-full h-full object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content overlay - centered text and buttons */}
      <div className="container-max relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center justify-center">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-800/80 backdrop-blur-sm text-white text-xs sm:text-sm font-medium rounded-full uppercase tracking-wider">
              {product ? `Introducing ${product.name}` : "Introducing S1 Pro+"}
            </span>
          </div>

          {/* Main Title - Smaller Responsive Typography */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            {product?.description || "Pure Power. Peak Performance."}
          </h1>

          {/* Price - Show lowest price */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 font-medium">
            {product?.variants && product.variants.length > 0 
              ? `From ₹ ${Math.min(...product.variants.map((v: any) => v.price)).toLocaleString('en-IN')}`
              : "From ₹ 1,48,999 or ₹ 5,185/month"
            }
          </p>

          {/* CTA Buttons - Smaller Size, Responsive */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24">
            <button 
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="w-full sm:w-auto min-w-[160px] sm:min-w-[180px] text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 inline-flex items-center justify-center space-x-2 group bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium rounded-lg"
            >
              <span>Watch the film</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button 
              type="button"
              onClick={handleBuyNow}
              className="w-full sm:w-auto min-w-[160px] sm:min-w-[180px] text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 inline-flex items-center justify-center space-x-2 group bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium rounded-lg"
            >
              <span>Buy now</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Specifications - Responsive - Positioned to avoid button overlap */}
      <div className="absolute bottom-8 sm:bottom-12 lg:bottom-16 left-0 right-0 z-30">
        <div className="flex justify-center items-end gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1">
              {product?.variants && product.variants.length > 0 
                ? `${Math.min(...product.variants.map((v: any) => v.range_km))} km`
                : "150 km"
              }
            </div>
            <div className="text-xs text-white/80">Range (IDC)</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1">
              {product?.variants && product.variants.length > 0 
                ? `${Math.min(...product.variants.map((v: any) => v.top_speed_kmh))} km/h`
                : "95 km/h"
              }
            </div>
            <div className="text-xs text-white/80">Top Speed</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1">
              {product?.variants && product.variants.length > 0 
                ? `${Math.max(...product.variants.map((v: any) => v.acceleration_sec))} sec`
                : "3.2 sec"
              }
            </div>
            <div className="text-xs text-white/80">0-40 km/h</div>
          </div>
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-1">
              {product?.variants && product.variants.length > 0 
                ? `${Math.min(...product.variants.map((v: any) => parseFloat(v.battery_capacity.replace('kWh', ''))))} kWh`
                : "2.0 kWh"
              }
            </div>
            <div className="text-xs text-white/80">Battery</div>
          </div>
        </div>
        
      </div>


      {/* Video Preview Modal */}
      <VideoPreviewModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl="/videos/3118680-uhd_3840_2160_30fps.mp4"
        videoTitle="OLA S1 Pro+ Film"
      />
    </section>
  );
};

export default ProductHero;