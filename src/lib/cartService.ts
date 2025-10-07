import { cartApi } from './cartApi';
import { Product, ProductVariant, ProductColor, Accessory } from '@/store/slices/productSlice';

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant;
  color: ProductColor;
  quantity: number;
  accessories: Accessory[];
  totalPrice: number;
}

export interface CartSummary {
  total_items: number;
  total_quantity: number;
  total_price: number;
  is_empty: boolean;
}

class CartService {
  private isOnline = true;
  private guestSessionId: string | null = null;
  private pendingAddCalls = new Map<string, Promise<void>>();

  constructor() {
    // Check if we're online
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;
      window.addEventListener('online', () => { this.isOnline = true; });
      window.addEventListener('offline', () => { this.isOnline = false; });
      
      // Get or create guest session ID
      this.guestSessionId = localStorage.getItem('guestSessionId');
      if (!this.guestSessionId) {
        this.guestSessionId = 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('guestSessionId', this.guestSessionId);
      }
    }
  }

  // Add item to cart (both local and backend)
  async addToCart(item: {
    product: Product;
    variant: ProductVariant;
    color: ProductColor;
    accessories?: Accessory[];
    quantity?: number;
  }): Promise<void> {
    // Create a unique key for this item to prevent duplicate calls
    const itemKey = `${item.product.id}-${item.variant.id}-${item.color.id}`;
    
    // If there's already a pending call for this item, wait for it to complete
    if (this.pendingAddCalls.has(itemKey)) {
      console.log('⏳ Waiting for existing addToCart call to complete for:', itemKey);
      return this.pendingAddCalls.get(itemKey);
    }
    
    console.log('🛒 CartService.addToCart called:', { 
      productId: item.product.id, 
      variantId: item.variant.id, 
      colorId: item.color.id,
      isOnline: this.isOnline 
    });
    
    const addToCartPromise = this.performAddToCart(item);
    this.pendingAddCalls.set(itemKey, addToCartPromise);
    
    try {
      await addToCartPromise;
    } catch (error) {
      console.error('❌ Cart service addToCart failed:', error);
      // Don't rethrow - let the frontend handle the error
    } finally {
      // Remove the pending call after completion
      this.pendingAddCalls.delete(itemKey);
    }
  }

  private async performAddToCart(item: {
    product: Product;
    variant: ProductVariant;
    color: ProductColor;
    accessories?: Accessory[];
    quantity?: number;
  }): Promise<void> {
    if (this.isOnline) {
      try {
        // Check authentication state before making API call
        let authToken = null;
        if (typeof window !== 'undefined') {
          try {
            // Try new auth storage format first
            const authData = localStorage.getItem('requeza_auth_data');
            if (authData) {
              const parsed = JSON.parse(authData);
              authToken = parsed.token;
            }
            // Fallback to old format
            if (!authToken) {
              authToken = localStorage.getItem('authToken');
            }
          } catch (error) {
            console.log('❌ Error getting auth token in cartService:', error);
          }
        }
        console.log('🔍 Auth check in cartService:', { hasToken: !!authToken });
        
        const accessories = item.accessories || [];
        const accessoryPrice = accessories.reduce((sum, acc) => sum + acc.price, 0);
        const totalPrice = item.variant.price + accessoryPrice;

        console.log('📤 Adding to backend cart:', {
          product_id: item.product.id,
          variant_id: item.variant.id,
          color_id: item.color.id,
          quantity: item.quantity || 1,
          total_price: totalPrice,
          hasAuthToken: !!authToken
        });

        const result = await cartApi.addToCart({
          product_id: item.product.id,
          variant_id: item.variant.id,
          color_id: item.color.id,
          quantity: item.quantity || 1,
          accessories: accessories,
          total_price: totalPrice
        });
        
        console.log('✅ Backend cart response:', result);
      } catch (error) {
        console.error('❌ Failed to add item to backend cart:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          response: error.response
        });
        
        // If authentication error, continue with local storage only
        if (error.message?.includes('Access token required') || 
            error.message?.includes('Authentication') ||
            error.message?.includes('already authenticated')) {
          console.log('🔐 Authentication issue detected, using local storage only');
        }
        // Continue with local storage as fallback
      }
    } else {
      console.log('📱 Offline mode - skipping backend sync');
    }
  }

  // Update cart item quantity (both local and backend)
  async updateQuantity(itemId: string, quantity: number, databaseId?: number): Promise<void> {
    if (this.isOnline && databaseId) {
      try {
        await cartApi.updateQuantity(databaseId.toString(), quantity);
        console.log('✅ Updated quantity in backend cart:', { databaseId, quantity });
      } catch (error) {
        console.error('❌ Failed to update quantity in backend cart:', error);
        // If authentication error, continue with local storage only
        if (error.message?.includes('Access token required') || error.message?.includes('Authentication')) {
          console.log('User not authenticated, using local storage only');
        }
        // Continue with local storage as fallback
      }
    }
  }

  // Increment cart item quantity (both local and backend)
  async incrementQuantity(itemId: string, databaseId?: number): Promise<void> {
    if (this.isOnline && databaseId) {
      try {
        await cartApi.incrementQuantity(databaseId.toString());
        console.log('✅ Incremented quantity in backend cart:', { databaseId });
      } catch (error) {
        console.error('❌ Failed to increment quantity in backend cart:', error);
        // If authentication error, continue with local storage only
        if (error.message?.includes('Access token required') || error.message?.includes('Authentication')) {
          console.log('User not authenticated, using local storage only');
        }
        // Continue with local storage as fallback
      }
    }
  }

  // Decrement cart item quantity (both local and backend)
  async decrementQuantity(itemId: string, databaseId?: number): Promise<void> {
    if (this.isOnline && databaseId) {
      try {
        await cartApi.decrementQuantity(databaseId.toString());
        console.log('✅ Decremented quantity in backend cart:', { databaseId });
      } catch (error) {
        console.error('❌ Failed to decrement quantity in backend cart:', error);
        // If authentication error, continue with local storage only
        if (error.message?.includes('Access token required') || error.message?.includes('Authentication')) {
          console.log('User not authenticated, using local storage only');
        }
        // Continue with local storage as fallback
      }
    }
  }

  // Remove item from cart (both local and backend)
  async removeFromCart(itemId: string): Promise<void> {
    console.log('🔄 CartService.removeFromCart called with itemId:', itemId);
    
    if (this.isOnline) {
      try {
        console.log('🌐 Making API call to remove item from backend...');
        const result = await cartApi.removeFromCart(itemId);
        console.log('✅ Backend API response:', result);
        console.log('✅ Removed item from backend cart:', { itemId });
      } catch (error) {
        console.error('❌ Failed to remove item from backend cart:', error);
        console.error('❌ Error details:', {
          message: error.message,
          status: error.status,
          response: error.response
        });
        // If authentication error, continue with local storage only
        if (error.message?.includes('Access token required') || error.message?.includes('Authentication')) {
          console.log('User not authenticated, using local storage only');
        }
        // Continue with local storage as fallback
      }
    } else {
      console.log('📱 Offline mode - skipping backend sync');
    }
  }

  // Clear cart (both local and backend)
  async clearCart(): Promise<void> {
    if (this.isOnline) {
      try {
        await cartApi.clearCart();
        console.log('✅ Cleared backend cart');
      } catch (error) {
        console.error('❌ Failed to clear backend cart:', error);
        // If authentication error, continue with local storage only
        if (error.message?.includes('Access token required') || error.message?.includes('Authentication')) {
          console.log('User not authenticated, using local storage only');
        }
        // Continue with local storage as fallback
      }
    }
  }

  // Get cart summary from backend
  async getCartSummary(): Promise<CartSummary | null> {
    if (!this.isOnline) {
      return null;
    }

    try {
      const response = await cartApi.getCartSummary();
      return response.data;
    } catch (error) {
      console.error('Failed to get cart summary from backend:', error);
      return null;
    }
  }

  // Check if cart is empty on backend
  async isCartEmpty(): Promise<boolean> {
    if (!this.isOnline) {
      return false; // Assume not empty for offline mode
    }

    try {
      const response = await cartApi.checkCartEmpty();
      return response.data.is_empty;
    } catch (error) {
      console.error('Failed to check cart status:', error);
      return false;
    }
  }

  // Get cart from backend
  async getBackendCart(): Promise<CartItem[]> {
    if (!this.isOnline) {
      return [];
    }

    try {
      const response = await cartApi.getCart();
      return response.data.items || [];
    } catch (error) {
      console.error('Failed to get cart from backend:', error);
      return [];
    }
  }

  // Sync cart with backend
  async syncCartWithBackend(cartItems: CartItem[]): Promise<void> {
    if (!this.isOnline) {
      console.log('Offline mode - cart sync skipped');
      return;
    }

    try {
      // Get current backend cart
      const backendCart = await cartApi.getCart();
      
      // Clear backend cart first
      await cartApi.clearCart();
      
      // Add all items to backend
      for (const item of cartItems) {
        await cartApi.addToCart({
          product_id: item.product.id,
          variant_id: item.variant.id,
          color_id: item.color.id,
          quantity: item.quantity,
          accessories: item.accessories,
          total_price: item.totalPrice
        });
      }
      
      console.log('✅ Cart synced with backend successfully');
    } catch (error) {
      console.error('❌ Failed to sync cart with backend:', error);
      // Don't throw error - allow offline functionality
    }
  }
}

export const cartService = new CartService();