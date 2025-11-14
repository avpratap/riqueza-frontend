import { cartApi } from './cartApi';

export interface CartTransferResult {
  success: boolean;
  message: string;
  data?: {
    itemsTransferred: number;
    guestUserId?: string;
  };
  error?: string;
}

class CartTransferService {
  /**
   * Transfer guest cart to authenticated user
   */
  async transferGuestCartToUser(guestSessionId: string): Promise<CartTransferResult> {
    try {
      console.log('🔄 Transferring guest cart to authenticated user...', {
        guestSessionId: guestSessionId.substring(0, 20) + '...'
      });

      const result = await cartApi.transferGuestCartToUser(guestSessionId);
      
      console.log('✅ Cart transfer result:', result);
      
      // If result indicates no items to transfer, that's still success
      if (result.success) {
        const itemsTransferred = result.data?.itemsTransferred || 0;
        if (itemsTransferred === 0) {
          console.log('ℹ️ No guest cart items to transfer (this is okay)');
        }
        return {
          success: true,
          message: result.message || 'Cart transfer completed',
          data: result.data
        };
      } else {
        // If error indicates no items, treat as success
        if (result.error?.includes('not found') || result.error?.includes('not needed')) {
          console.log('ℹ️ No guest cart items found (this is okay):', result.error);
          return {
            success: true,
            message: 'No guest cart items to transfer',
            data: { itemsTransferred: 0 }
          };
        }
        return {
          success: false,
          message: result.error || 'Failed to transfer cart',
          error: result.error || 'Unknown error'
        };
      }
    } catch (error: any) {
      // Handle 404 and "not found" errors gracefully
      if (error.status === 404 || error.message?.includes('not found') || error.message?.includes('404')) {
        console.log('ℹ️ Guest cart not found or already transferred (this is okay):', error.message);
        return {
          success: true,
          message: 'No guest cart items to transfer',
          data: { itemsTransferred: 0 }
        };
      }
      console.error('❌ Cart transfer failed:', error);
      
      return {
        success: false,
        message: 'Failed to transfer cart',
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Transfer localStorage cart data directly to authenticated user
   * This handles cases where guest user doesn't exist in database
   */
  async transferLocalStorageCartToUser(): Promise<CartTransferResult> {
    try {
      console.log('🔄 Transferring localStorage cart to authenticated user...');

      if (typeof window === 'undefined') {
        throw new Error('Cart transfer can only be performed on client side');
      }

      // Check if transfer has already been attempted
      const transferAttempted = localStorage.getItem('cartTransferAttempted');
      if (transferAttempted) {
        console.log('ℹ️ Cart transfer already attempted, skipping...');
        return { success: true, message: 'Cart transfer already attempted' };
      }

      // Mark transfer as attempted
      localStorage.setItem('cartTransferAttempted', 'true');

      const cartData = localStorage.getItem('cartState');
      if (!cartData) {
        return { success: false, message: 'No cart data found in localStorage' };
      }

      const parsed = JSON.parse(cartData);
      if (!parsed.items || parsed.items.length === 0) {
        return { success: false, message: 'Cart is empty' };
      }

      console.log(`📦 Found ${parsed.items.length} items in localStorage cart`);

      // Add each cart item to authenticated user's cart
      let transferredCount = 0;
      for (const item of parsed.items) {
        try {
          const cartItemData = {
            product_id: item.product.id,
            variant_id: item.variant.id,
            color_id: item.color.id,
            quantity: item.quantity,
            accessories: item.accessories || [],
            total_price: item.totalPrice
          };

          console.log('📤 Adding item to authenticated cart:', cartItemData);
          
          await cartApi.addToCart(cartItemData);
          transferredCount++;
          
          console.log(`✅ Transferred item ${transferredCount}/${parsed.items.length}`);
        } catch (error: any) {
          console.error(`❌ Failed to transfer item:`, error);
          // Continue with other items
        }
      }

      if (transferredCount > 0) {
        console.log(`🎉 Successfully transferred ${transferredCount} items to authenticated cart`);
        
        // Clear localStorage cart after successful transfer
        localStorage.removeItem('cartState');
        localStorage.removeItem('guestSessionId');
        localStorage.removeItem('cartTransferAttempted');
        console.log('🧹 Cleared localStorage cart after successful transfer');
        
        return {
          success: true,
          message: `Transferred ${transferredCount} items to authenticated cart`,
          data: { itemsTransferred: transferredCount }
        };
      } else {
        return {
          success: false,
          message: 'Failed to transfer any items',
          error: 'All transfer attempts failed'
        };
      }

    } catch (error: any) {
      console.error('❌ localStorage cart transfer failed:', error);
      
      return {
        success: false,
        message: 'Failed to transfer localStorage cart',
        error: error.message || 'Unknown error'
      };
    }
  }

  /**
   * Get guest session ID from localStorage
   */
  getGuestSessionId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('guestSessionId');
    }
    return null;
  }

  /**
   * Clear guest session ID after successful transfer
   */
  clearGuestSessionId(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('guestSessionId');
      console.log('🧹 Cleared guest session ID from localStorage');
    }
  }

  /**
   * Check if there are guest cart items in localStorage
   */
  hasGuestCartItems(): boolean {
    if (typeof window !== 'undefined') {
      const cartData = localStorage.getItem('cartState');
      if (cartData) {
        try {
          const parsed = JSON.parse(cartData);
          return parsed.items && parsed.items.length > 0;
        } catch (error) {
          console.error('Error parsing cart data:', error);
          return false;
        }
      }
    }
    return false;
  }
}

export default new CartTransferService();
