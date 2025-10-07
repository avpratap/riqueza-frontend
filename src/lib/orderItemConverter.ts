import { OrderItem } from './orderService';

export interface OrderItemWithCategorizedAccessories extends OrderItem {
  addOns?: any[];
  insurance?: any[];
  accessories: any[]; // Make required to match parent interface
  product_name?: string;
  variant_name?: string;
  color_name?: string;
  color_code?: string;
  product_images?: any[];
}

export const convertOrderItemToCategorized = (orderItem: OrderItem & {
  product_name?: string;
  variant_name?: string;
  color_name?: string;
  color_code?: string;
  product_images?: any[];
}): OrderItemWithCategorizedAccessories => {
  try {
    console.log('🔄 Converting order item with accessories:', {
      id: orderItem.id,
      product_name: orderItem.product_name,
      variant_name: orderItem.variant_name,
      color_name: orderItem.color_name,
      accessories_count: orderItem.accessories?.length || 0
    });

    // Categorize accessories by type
    const addOns = (orderItem.accessories || []).filter(acc => acc.type === 'addon');
    const insurance = (orderItem.accessories || []).filter(acc => acc.type === 'insurance');
    const regularAccessories = (orderItem.accessories || []).filter(acc => !acc.type || acc.type === 'accessory');

    const convertedItem: OrderItemWithCategorizedAccessories = {
      ...orderItem,
      addOns,
      insurance,
      accessories: regularAccessories,
      product_name: orderItem.product_name,
      variant_name: orderItem.variant_name,
      color_name: orderItem.color_name,
      color_code: orderItem.color_code,
      product_images: orderItem.product_images || []
    };

    console.log('✅ Converted order item:', {
      id: convertedItem.id,
      product_name: convertedItem.product_name,
      addOns_count: convertedItem.addOns?.length || 0,
      insurance_count: convertedItem.insurance?.length || 0,
      accessories_count: convertedItem.accessories?.length || 0
    });

    return convertedItem;
  } catch (error) {
    console.error('❌ Error converting order item:', error);
    return orderItem as OrderItemWithCategorizedAccessories;
  }
};

export const convertOrderItemsToCategorized = (orderItems: (OrderItem & {
  product_name?: string;
  variant_name?: string;
  color_name?: string;
  color_code?: string;
  product_images?: any[];
})[]): OrderItemWithCategorizedAccessories[] => {
  console.log('🔄 Converting order items with accessories:', orderItems.length);
  
  const convertedItems = orderItems.map(convertOrderItemToCategorized);
  
  console.log('✅ Converted order items:', convertedItems.length);
  return convertedItems;
};
