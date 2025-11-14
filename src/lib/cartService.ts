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
            const authData = localStorage.getItem('riqueza_auth_data');
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
  // For guest users, databaseId can be the itemId itself if it's a UUID
  async updateQuantity(itemId: string, quantity: number, databaseId?: string | number): Promise<void> {
    if (!this.isOnline) {
      console.log('📱 Offline mode - skipping backend sync');
      return;
    }
    
    // For guest users or when databaseId is not provided, try using itemId
    // Check if databaseId is a valid UUID, if not, try using itemId
    const idToUse = databaseId || itemId;
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(idToUse));
    
    if (!isValidUUID && !databaseId) {
      // If itemId is not a UUID and no databaseId provided, might be a frontend composite ID
      // In this case, we can't sync to backend - this is okay for guest users
      console.log('⚠️ Cannot sync quantity update - invalid ID format (this is okay for some guest cart items):', {
        itemId,
        databaseId,
        idToUse
      });
      return;
    }
    
    try {
      await cartApi.updateQuantity(String(idToUse), quantity);
      console.log('✅ Updated quantity in backend cart:', { id: idToUse, quantity, isGuest: !databaseId });
    } catch (error: any) {
      console.error('❌ Failed to update quantity in backend cart:', error);
      // If authentication error, continue with local storage only
      if (error.message?.includes('Access token required') || error.message?.includes('Authentication')) {
        console.log('User not authenticated, using local storage only');
      }
      // Continue with local storage as fallback
    }
  }

  // Increment cart item quantity (both local and backend)
  async incrementQuantity(itemId: string, databaseId?: string | number): Promise<void> {
    if (!this.isOnline) {
      console.log('📱 Offline mode - skipping backend sync');
      return;
    }
    
    // For guest users or when databaseId is not provided, try using itemId
    const idToUse = databaseId || itemId;
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(idToUse));
    
    if (!isValidUUID && !databaseId) {
      console.log('⚠️ Cannot sync increment - invalid ID format (this is okay for some guest cart items):', {
        itemId,
        databaseId,
        idToUse
      });
      return;
    }
    
    try {
      await cartApi.incrementQuantity(String(idToUse));
      console.log('✅ Incremented quantity in backend cart:', { id: idToUse, isGuest: !databaseId });
    } catch (error: any) {
      console.error('❌ Failed to increment quantity in backend cart:', error);
      // If authentication error, continue with local storage only
      if (error.message?.includes('Access token required') || error.message?.includes('Authentication')) {
        console.log('User not authenticated, using local storage only');
      }
      // Continue with local storage as fallback
    }
  }

  // Decrement cart item quantity (both local and backend)
  async decrementQuantity(itemId: string, databaseId?: string | number): Promise<void> {
    if (!this.isOnline) {
      console.log('📱 Offline mode - skipping backend sync');
      return;
    }
    
    // For guest users or when databaseId is not provided, try using itemId
    const idToUse = databaseId || itemId;
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(idToUse));
    
    if (!isValidUUID && !databaseId) {
      console.log('⚠️ Cannot sync decrement - invalid ID format (this is okay for some guest cart items):', {
        itemId,
        databaseId,
        idToUse
      });
      return;
    }
    
    try {
      await cartApi.decrementQuantity(String(idToUse));
      console.log('✅ Decremented quantity in backend cart:', { id: idToUse, isGuest: !databaseId });
    } catch (error: any) {
      console.error('❌ Failed to decrement quantity in backend cart:', error);
      // If authentication error, continue with local storage only
      if (error.message?.includes('Access token required') || error.message?.includes('Authentication')) {
        console.log('User not authenticated, using local storage only');
      }
      // Continue with local storage as fallback
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

  // Sync entire cart state to backend (update existing items, add new ones, remove deleted ones)
  async syncEntireCartToBackend(cartItems: CartItem[]): Promise<void> {
    if (!this.isOnline) {
      console.log('📱 Offline mode - cart sync skipped');
      return;
    }

    try {
      console.log('🔄 Syncing entire cart to backend...', {
        itemCount: cartItems.length,
        items: cartItems.map(item => ({
          id: item.id,
          databaseId: (item as any)?.databaseId,
          productId: item.product.id,
          variantId: item.variant.id,
          colorId: item.color.id,
          quantity: item.quantity
        }))
      });

      // Get current backend cart
      const backendCartResponse = await cartApi.getCart();
      const backendItems = backendCartResponse.data?.items || [];
      
      console.log('📦 Current backend cart items:', backendItems.length, {
        items: backendItems.map((bi: any) => ({
          id: bi.id,
          productId: bi.product_id,
          variantId: bi.variant_id,
          colorId: bi.color_id,
          quantity: bi.quantity
        }))
      });

      // Match items by product_id, variant_id, and color_id (not just databaseId)
      // This handles cases where databaseId might be missing or items might be added separately
      const matchItems = (frontendItem: CartItem, backendItem: any): boolean => {
        return (
          frontendItem.product.id === backendItem.product_id &&
          frontendItem.variant.id === backendItem.variant_id &&
          frontendItem.color.id === backendItem.color_id
        );
      };

      // Track which backend items we've processed (by ID) and which frontend items we've matched
      const processedBackendItemIds = new Set<string>();
      const matchedFrontendItems = new Set<string>();
      
      // First pass: Update existing items or match items that already exist
      for (const item of cartItems) {
        const databaseId = (item as any)?.databaseId;
        let matched = false;

        // First try to find by databaseId if available
        if (databaseId) {
          const backendItem = backendItems.find((bi: any) => bi.id === databaseId.toString());
          if (backendItem) {
            matched = true;
            processedBackendItemIds.add(backendItem.id);
            
            // Update quantity if it has changed
            if (backendItem.quantity !== item.quantity) {
              console.log('🔄 Updating quantity for matched item (by databaseId):', {
                databaseId,
                oldQuantity: backendItem.quantity,
                newQuantity: item.quantity
              });
              try {
                await cartApi.updateQuantity(databaseId.toString(), item.quantity);
              } catch (error) {
                console.error('❌ Error updating quantity:', error);
              }
            } else {
              console.log('✅ Item already has correct quantity:', {
                databaseId,
                quantity: item.quantity
              });
            }
            continue;
          }
        }

        // If not matched by databaseId, try to find by product/variant/color combination
        const matchingBackendItem = backendItems.find((bi: any) => 
          !processedBackendItemIds.has(bi.id) && matchItems(item, bi)
        );

        if (matchingBackendItem) {
          matched = true;
          processedBackendItemIds.add(matchingBackendItem.id);
          
          // Update quantity if it has changed
          if (matchingBackendItem.quantity !== item.quantity) {
            console.log('🔄 Updating quantity for matched item (by product/variant/color):', {
              backendItemId: matchingBackendItem.id,
              oldQuantity: matchingBackendItem.quantity,
              newQuantity: item.quantity
            });
            try {
              await cartApi.updateQuantity(matchingBackendItem.id, item.quantity);
            } catch (error) {
              console.error('❌ Error updating quantity:', error);
            }
          } else {
            console.log('✅ Matched item already has correct quantity:', {
              backendItemId: matchingBackendItem.id,
              quantity: item.quantity
            });
          }
          continue;
        }

        // Item not found in backend, add it
        if (!matched) {
          console.log('➕ Adding new item to backend cart:', {
            productId: item.product.id,
            variantId: item.variant.id,
            colorId: item.color.id,
            quantity: item.quantity,
            hasDatabaseId: !!databaseId
          });
          try {
            await cartApi.addToCart({
              product_id: item.product.id,
              variant_id: item.variant.id,
              color_id: item.color.id,
              quantity: item.quantity,
              accessories: item.accessories || [],
              total_price: item.totalPrice
            });
          } catch (error) {
            console.error('❌ Error adding item to backend:', error);
          }
        }
      }

      // DON'T automatically remove backend items - only update quantities
      // Removing items automatically can cause data loss if:
      // 1. Frontend Redux state is out of sync with backend
      // 2. Items are being added/updated from multiple sources
      // 3. Database IDs are missing or incorrect
      // Instead, rely on explicit user actions (delete button) to remove items
      // Only log unmatched items for debugging purposes
      for (const backendItem of backendItems) {
        if (!processedBackendItemIds.has(backendItem.id)) {
          // Check if there's a frontend item that matches this backend item
          const hasMatchingFrontendItem = cartItems.some(item => matchItems(item, backendItem));
          
          if (!hasMatchingFrontendItem) {
            console.log('⚠️ Backend item exists but no matching frontend item (keeping in backend):', {
              id: backendItem.id,
              productId: backendItem.product_id,
              variantId: backendItem.variant_id,
              colorId: backendItem.color_id,
              quantity: backendItem.quantity
            });
            // DON'T remove - item might be from another session or device
            // User can explicitly remove it if needed
          } else {
            console.log('⚠️ Backend item not processed but has matching frontend item (should not happen):', {
              id: backendItem.id,
              productId: backendItem.product_id,
              quantity: backendItem.quantity
            });
          }
        }
      }

      console.log('✅ Entire cart synced to backend successfully');
    } catch (error) {
      console.error('❌ Failed to sync entire cart to backend:', error);
      throw error; // Re-throw to allow caller to handle
    }
  }
}

export const cartService = new CartService();