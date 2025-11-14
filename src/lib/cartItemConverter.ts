import { CartItem } from '@/store/slices/cartSlice';

export interface CartItemWithDatabaseId extends CartItem {
  databaseId?: string; // UUID as string
}

export interface BackendCartItem {
  id: string; // UUID
  user_id: string; // UUID
  product_id: string; // UUID
  variant_id: string; // UUID
  color_id: string; // UUID
  quantity: number;
  accessories: any[];
  total_price: string;
  created_at: string;
  updated_at: string;
  // Product details from the enhanced query
  product_name: string;
  product_slug: string;
  product_description: string;
  product_category: string;
  product_base_price: number;
  product_original_price: number;
  product_rating: number;
  product_review_count: number;
  product_is_featured: boolean;
  variant_name: string;
  variant_battery_capacity: string;
  variant_range_km: number;
  variant_top_speed_kmh: number;
  variant_acceleration_sec: number;
  variant_price: number;
  variant_is_new: boolean;
  color_name: string;
  color_code: string;
  color_css_filter: string;
  product_images: any[];
}

export const convertBackendCartItemToFrontend = async (backendItem: BackendCartItem): Promise<CartItemWithDatabaseId | null> => {
  try {
    console.log('🔄 Converting backend cart item:', {
      id: backendItem.id,
      product_name: backendItem.product_name,
      variant_name: backendItem.variant_name,
      color_name: backendItem.color_name,
      quantity: backendItem.quantity
    });

    console.log('🔄 Converting backend cart item:', {
      id: backendItem.id,
      product_name: backendItem.product_name,
      variant_name: backendItem.variant_name,
      color_name: backendItem.color_name,
      quantity: backendItem.quantity
    });
    
    const convertedItem = {
      id: `${backendItem.product_id}-${backendItem.variant_id}-${backendItem.color_id}`,
      databaseId: backendItem.id, // Store the UUID database ID as string for backend operations
      product: {
        id: backendItem.product_id,
        name: backendItem.product_name || `Product ${backendItem.product_id}`,
        slug: backendItem.product_slug || `product-${backendItem.product_id}`,
        description: backendItem.product_description || 'Product description',
        category: (backendItem.product_category as 'scooter' | 'bike' | 'accessory') || 'scooter',
        base_price: backendItem.product_base_price || 0,
        original_price: backendItem.product_original_price || 0,
        is_active: true,
        is_featured: backendItem.product_is_featured || false,
        rating: backendItem.product_rating || 4.0,
        review_count: backendItem.product_review_count || 0,
        variants: [],
        colors: [],
        images: backendItem.product_images && backendItem.product_images.length > 0 
          ? backendItem.product_images.sort((a, b) => a.display_order - b.display_order)
          : [
              {
                id: 'img_1',
                image_url: 'https://res.cloudinary.com/dnulm62j6/image/upload/v1758562609/m1_o5y1jo.webp',
                alt_text: 'Product image',
                display_order: 0,
                is_primary: true
              }
            ],
        specifications: [],
        features: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      variant: {
        id: backendItem.variant_id,
        name: backendItem.variant_name || `Variant ${backendItem.variant_id}`,
        battery_capacity: backendItem.variant_battery_capacity || '2kWh',
        range_km: backendItem.variant_range_km || 150,
        top_speed_kmh: backendItem.variant_top_speed_kmh || 110,
        acceleration_sec: backendItem.variant_acceleration_sec || 3.2,
        price: backendItem.variant_price || parseFloat(backendItem.total_price) / backendItem.quantity,
        is_new: backendItem.variant_is_new || false,
        is_active: true
      },
      color: {
        id: backendItem.color_id,
        name: backendItem.color_name || `Color ${backendItem.color_id}`,
        color_code: backendItem.color_code || '#9CA3AF',
        css_filter: backendItem.color_css_filter || 'grayscale(1)'
      },
      quantity: backendItem.quantity,
      accessories: (backendItem.accessories || []).filter(acc => !acc.type || acc.type === 'accessory'),
      addOns: (backendItem.accessories || []).filter(acc => acc.type === 'addon'),
      insurance: (backendItem.accessories || []).filter(acc => acc.type === 'insurance'),
      totalPrice: parseFloat(backendItem.total_price)
    };
    
    console.log('✅ Converted item:', {
      frontendId: convertedItem.id,
      databaseId: convertedItem.databaseId,
      productName: convertedItem.product.name
    });
    
    return convertedItem;
  } catch (error) {
    console.error('❌ Error converting backend cart item:', error);
    return null;
  }
};

export const convertBackendCartItems = async (backendItems: BackendCartItem[]): Promise<CartItemWithDatabaseId[]> => {
  console.log('🔄 Converting backend cart items:', backendItems.length);
  
  const convertedItems = await Promise.all(
    backendItems.map(item => convertBackendCartItemToFrontend(item))
  );
  
  const validItems = convertedItems.filter(item => item !== null) as CartItemWithDatabaseId[];
  console.log('✅ Converted cart items:', validItems.length);
  
  return validItems;
};