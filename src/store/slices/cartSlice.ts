import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product, ProductVariant, ProductColor, Accessory } from './productSlice'
import { cartService } from '@/lib/cartService'

export interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  color: ProductColor
  quantity: number
  accessories: Accessory[]
  totalPrice: number
  addOns?: Accessory[]
  insurance?: Accessory[]
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isOpen: boolean
}

// Load initial state from localStorage if available
const loadCartFromStorage = (): CartState => {
  if (typeof window !== 'undefined') {
    try {
      const savedCart = localStorage.getItem('cartState');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('📦 Loaded cart from localStorage:', parsedCart);
        return {
          items: parsedCart.items || [],
          totalItems: parsedCart.totalItems || 0,
          totalPrice: parsedCart.totalPrice || 0,
          isOpen: false, // Always start with cart closed
        };
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }
  return {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isOpen: false,
  };
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{
      product: Product
      variant: ProductVariant
      color: ProductColor
      accessories?: Accessory[]
    }>) => {
      const { product, variant, color, accessories = [] } = action.payload
      
      console.log('🛒 Redux addToCart called:', { 
        productId: product.id, 
        productName: product.name,
        variantId: variant.id, 
        variantName: variant.name,
        colorId: color.id,
        colorName: color.name,
        currentItemsCount: state.items.length 
      });
      
      // Categorize accessories by type
      const addOns = accessories.filter(acc => acc.type === 'addon')
      const insurance = accessories.filter(acc => acc.type === 'insurance')
      const regularAccessories = accessories.filter(acc => !acc.type || acc.type === 'accessory')
      
      // Calculate total price including all accessories
      const accessoryPrice = accessories.reduce((sum, acc) => sum + acc.price, 0)
      const totalPrice = variant.price + accessoryPrice
      
      // Check if item already exists with same product, variant, and color
      const existingItemIndex = state.items.findIndex(
        item => 
          item.product.id === product.id && 
          item.variant.id === variant.id && 
          item.color.id === color.id
      )
      
      if (existingItemIndex >= 0) {
        // Update existing item - increment quantity and recalculate total price
        state.items[existingItemIndex].quantity += 1
        
        // Merge new accessories with existing ones
        const existingAddOns = state.items[existingItemIndex].addOns || []
        const existingInsurance = state.items[existingItemIndex].insurance || []
        const existingAccessories = state.items[existingItemIndex].accessories || []
        
        // Merge add-ons (avoid duplicates)
        const mergedAddOns = [...existingAddOns]
        addOns.forEach(newAddOn => {
          if (!mergedAddOns.find(existing => existing.id === newAddOn.id)) {
            mergedAddOns.push(newAddOn)
          }
        })
        
        // Merge insurance (avoid duplicates)
        const mergedInsurance = [...existingInsurance]
        insurance.forEach(newInsurance => {
          if (!mergedInsurance.find(existing => existing.id === newInsurance.id)) {
            mergedInsurance.push(newInsurance)
          }
        })
        
        // Merge regular accessories (avoid duplicates)
        const mergedAccessories = [...existingAccessories]
        regularAccessories.forEach(newAccessory => {
          if (!mergedAccessories.find(existing => existing.id === newAccessory.id)) {
            mergedAccessories.push(newAccessory)
          }
        })
        
        state.items[existingItemIndex].addOns = mergedAddOns
        state.items[existingItemIndex].insurance = mergedInsurance
        state.items[existingItemIndex].accessories = mergedAccessories
        
        // Recalculate total price including all accessories
        const allAccessories = [...mergedAddOns, ...mergedInsurance, ...mergedAccessories]
        const totalAccessoryPrice = allAccessories.reduce((sum, acc) => sum + acc.price, 0)
        const unitPrice = variant.price + totalAccessoryPrice
        state.items[existingItemIndex].totalPrice = state.items[existingItemIndex].quantity * unitPrice
        
        console.log('✅ Updated existing cart item:', state.items[existingItemIndex]);
        
        // For existing items, use updateQuantity instead of addToCart to prevent backend duplication
        // Capture the necessary data before setTimeout to avoid proxy issues
        const itemId = state.items[existingItemIndex].id;
        const itemQuantity = state.items[existingItemIndex].quantity;
        const itemDatabaseId = (state.items[existingItemIndex] as any)?.databaseId;
        
        setTimeout(() => {
          try {
            cartService.updateQuantity(
              itemId,
              itemQuantity,
              itemDatabaseId
            ).catch(error => {
              console.error('❌ Cart service update error:', error);
            });
          } catch (error) {
            console.error('❌ Cart service sync error:', error);
          }
        }, 300);
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${variant.id}-${color.id}`,
          product,
          variant,
          color,
          quantity: 1,
          accessories: regularAccessories,
          addOns,
          insurance,
          totalPrice,
        }
        state.items.push(newItem)
        console.log('✅ Added new cart item:', newItem);
        
        // Sync with backend for new items only
        // Capture the necessary data before setTimeout to avoid proxy issues
        const productData = { ...product };
        const variantData = { ...variant };
        const colorData = { ...color };
        const accessoriesData = [...accessories];
        
        setTimeout(() => {
          try {
            cartService.addToCart({ 
              product: productData, 
              variant: variantData, 
              color: colorData, 
              accessories: accessoriesData,
              quantity: 1 // Always send 1 for new items, backend handles duplicates
            }).catch(error => {
              console.error('❌ Cart service error:', error);
            });
          } catch (error) {
            console.error('❌ Cart service sync error:', error);
          }
        }, 300);
      }
      
      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice, 0)
      
      console.log('📊 Updated cart totals:', { 
        totalItems: state.totalItems, 
        totalPrice: state.totalPrice,
        itemsCount: state.items.length 
      });
    },
    
    // Add item with specific quantity (for direct quantity updates)
    addToCartWithQuantity: (state, action: PayloadAction<{
      product: Product
      variant: ProductVariant
      color: ProductColor
      accessories?: Accessory[]
      quantity: number
    }>) => {
      const { product, variant, color, accessories = [], quantity } = action.payload
      
      console.log('🛒 Redux addToCartWithQuantity called:', { 
        productId: product.id, 
        variantId: variant.id, 
        colorId: color.id,
        quantity,
        currentItemsCount: state.items.length 
      });
      
      // Calculate total price including accessories
      const accessoryPrice = accessories.reduce((sum, acc) => sum + acc.price, 0)
      const totalPrice = (variant.price + accessoryPrice) * quantity
      
      // Check if item already exists with same product, variant, and color
      const existingItemIndex = state.items.findIndex(
        item => 
          item.product.id === product.id && 
          item.variant.id === variant.id && 
          item.color.id === color.id
      )
      
      if (existingItemIndex >= 0) {
        // Update existing item - set exact quantity
        state.items[existingItemIndex].quantity = quantity
        state.items[existingItemIndex].totalPrice = totalPrice
        console.log('✅ Updated existing cart item with exact quantity:', state.items[existingItemIndex]);
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product.id}-${variant.id}-${color.id}`,
          product,
          variant,
          color,
          quantity,
          accessories,
          totalPrice,
        }
        state.items.push(newItem)
        console.log('✅ Added new cart item with quantity:', newItem);
      }
      
      // Update totals
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice, 0)
      
      console.log('📊 Updated cart totals:', { 
        totalItems: state.totalItems, 
        totalPrice: state.totalPrice,
        itemsCount: state.items.length 
      });
      
      // Sync with backend
      setTimeout(() => {
        try {
          cartService.addToCart({ 
            product, 
            variant, 
            color, 
            accessories,
            quantity: quantity
          }).catch(error => {
            console.error('❌ Cart service error:', error);
          });
        } catch (error) {
          console.error('❌ Cart service sync error:', error);
        }
      }, 300);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      const databaseId = action.payload
      
      console.log('🔍 Redux removeFromCart called with:', databaseId);
      console.log('📋 Current cart items:', state.items.map(item => ({
        frontendId: item.id,
        databaseId: (item as any)?.databaseId,
        productName: item.product?.name
      })));
      
      // Try to find by database ID first, then by frontend ID
      let itemIndex = state.items.findIndex(item => {
        const itemDatabaseId = (item as any)?.databaseId;
        const matches = itemDatabaseId == databaseId || itemDatabaseId === databaseId || String(itemDatabaseId) === String(databaseId);
        console.log('🔍 Checking item:', { 
          frontendId: item.id, 
          databaseId: itemDatabaseId, 
          searchId: databaseId,
          matches,
          typeMatch: typeof itemDatabaseId === typeof databaseId
        });
        return matches;
      });
      
      if (itemIndex === -1) {
        console.log('🔍 Database ID not found, trying frontend ID...');
        // Fallback to frontend ID search
        itemIndex = state.items.findIndex(item => {
          const matches = item.id === databaseId;
          console.log('🔍 Checking frontend ID:', { 
            frontendId: item.id, 
            searchId: databaseId, 
            matches 
          });
          return matches;
        });
      }
      
      // If still not found, try to find by parsing the database ID as a number
      if (itemIndex === -1 && !isNaN(Number(databaseId))) {
        console.log('🔍 Trying numeric database ID search...');
        itemIndex = state.items.findIndex(item => {
          const itemDatabaseId = (item as any)?.databaseId;
          const matches = Number(itemDatabaseId) === Number(databaseId);
          console.log('🔍 Checking numeric ID:', { 
            frontendId: item.id, 
            databaseId: itemDatabaseId, 
            searchId: databaseId, 
            matches 
          });
          return matches;
        });
      }
      
      if (itemIndex >= 0) {
        const itemToRemove = state.items[itemIndex]
        console.log('🗑️ Removing item from cart:', {
          frontendId: itemToRemove.id,
          databaseId: (itemToRemove as any)?.databaseId,
          productName: itemToRemove.product?.name
        });
        
        state.items.splice(itemIndex, 1)
        
        // Update totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
        state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice, 0)
        
        console.log('📊 Updated cart totals after removal:', { 
          totalItems: state.totalItems, 
          totalPrice: state.totalPrice,
          itemsCount: state.items.length 
        });
        
        // Sync with localStorage immediately
        try {
          const cartState = {
            items: state.items,
            totalItems: state.totalItems,
            totalPrice: state.totalPrice,
            lastUpdated: Date.now()
          };
          localStorage.setItem('cartState', JSON.stringify(cartState));
          console.log('💾 Updated localStorage with new cart state');
        } catch (error) {
          console.error('❌ Failed to update localStorage:', error);
        }
        
        // Sync with backend using the database ID
        setTimeout(() => {
          try {
            cartService.removeFromCart(databaseId).catch(error => {
              console.error('❌ Cart service remove error:', error);
            });
          } catch (error) {
            console.error('❌ Cart service remove sync error:', error);
          }
        }, 100);
      } else {
        console.error('❌ Item not found for removal:', databaseId);
        console.error('❌ Available items:', state.items.map(item => ({
          frontendId: item.id,
          databaseId: (item as any)?.databaseId
        })));
      }
    },
    
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number; databaseId?: number }>) => {
      const { itemId, quantity, databaseId } = action.payload
      const itemIndex = state.items.findIndex(item => item.id === itemId)
      
      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          console.log('🗑️ Removing item due to zero quantity:', state.items[itemIndex]);
          state.items.splice(itemIndex, 1)
        } else {
          // Update quantity and recalculate total price
          const item = state.items[itemIndex]
          const unitPrice = item.totalPrice / item.quantity
          item.quantity = quantity
          item.totalPrice = unitPrice * quantity
          console.log('✅ Updated item quantity:', item);
        }
        
        // Update totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
        state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice, 0)
        
        console.log('📊 Updated cart totals after quantity change:', { 
          totalItems: state.totalItems, 
          totalPrice: state.totalPrice,
          itemsCount: state.items.length 
        });
        
        // Sync with backend
        setTimeout(() => {
          try {
            cartService.updateQuantity(itemId, quantity, databaseId).catch(error => {
              console.error('❌ Cart service update quantity error:', error);
            });
          } catch (error) {
            console.error('❌ Cart service update quantity sync error:', error);
          }
        }, 100);
      }
    },
    
    incrementQuantity: (state, action: PayloadAction<{ itemId: string; databaseId?: number }>) => {
      const { itemId, databaseId } = action.payload
      const itemIndex = state.items.findIndex(item => item.id === itemId)
      
      if (itemIndex >= 0) {
        const item = state.items[itemIndex]
        const unitPrice = item.totalPrice / item.quantity
        item.quantity += 1
        item.totalPrice = unitPrice * item.quantity
        
        // Update totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
        state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice, 0)
        
        console.log('✅ Incremented quantity for item:', item);
        
        // Sync with backend
        setTimeout(() => {
          try {
            cartService.incrementQuantity(itemId, databaseId).catch(error => {
              console.error('❌ Cart service increment error:', error);
            });
          } catch (error) {
            console.error('❌ Cart service increment sync error:', error);
          }
        }, 100);
      }
    },
    
    decrementQuantity: (state, action: PayloadAction<{ itemId: string; databaseId?: number }>) => {
      const { itemId, databaseId } = action.payload
      const itemIndex = state.items.findIndex(item => item.id === itemId)
      
      if (itemIndex >= 0) {
        const item = state.items[itemIndex]
        
        if (item.quantity <= 1) {
          // Remove item if quantity would be 0 or less
          console.log('🗑️ Removing item due to decrement to zero:', item);
          state.items.splice(itemIndex, 1)
        } else {
          // Decrement quantity and recalculate total price
          const unitPrice = item.totalPrice / item.quantity
          item.quantity -= 1
          item.totalPrice = unitPrice * item.quantity
          console.log('✅ Decremented quantity for item:', item);
        }
        
        // Update totals
        state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
        state.totalPrice = state.items.reduce((sum, item) => sum + item.totalPrice, 0)
        
        console.log('📊 Updated cart totals after decrement:', { 
          totalItems: state.totalItems, 
          totalPrice: state.totalPrice,
          itemsCount: state.items.length 
        });
        
        // Sync with backend
        setTimeout(() => {
          try {
            cartService.decrementQuantity(itemId, databaseId).catch(error => {
              console.error('❌ Cart service decrement error:', error);
            });
          } catch (error) {
            console.error('❌ Cart service decrement sync error:', error);
          }
        }, 100);
      }
    },
    
    clearCart: (state) => {
      console.log('🧹 Clearing entire cart');
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
      
      // Sync with backend
      setTimeout(() => {
        try {
          cartService.clearCart().catch(error => {
            console.error('❌ Cart service clear error:', error);
          });
        } catch (error) {
          console.error('❌ Cart service clear sync error:', error);
        }
      }, 100);
    },
    
    loadCart: (state, action: PayloadAction<CartItem[]>) => {
      const items = action.payload
      console.log('📦 Loading cart from external source:', items);
      
      state.items = items
      state.totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0)
      
      console.log('📊 Loaded cart totals:', { 
        totalItems: state.totalItems, 
        totalPrice: state.totalPrice,
        itemsCount: state.items.length 
      });
    },
    
    openCart: (state) => {
      state.isOpen = true
    },
    
    closeCart: (state) => {
      state.isOpen = false
    },
    
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    }
  }
})

// Save to localStorage whenever cart state changes
const saveCartToStorage = (state: CartState) => {
  if (typeof window !== 'undefined') {
    try {
      const cartToSave = {
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice
      };
      localStorage.setItem('cartState', JSON.stringify(cartToSave));
      console.log('💾 Saved cart to localStorage:', cartToSave);
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }
};

// Add middleware to save cart to localStorage after each action
const cartMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Save to localStorage after cart actions
  if (action.type.startsWith('cart/')) {
    const state = store.getState().cart;
    saveCartToStorage(state);
  }
  
  return result;
};

export const { 
  addToCart, 
  addToCartWithQuantity,
  removeFromCart, 
  updateQuantity, 
  incrementQuantity, 
  decrementQuantity, 
  clearCart, 
  loadCart,
  openCart, 
  closeCart, 
  toggleCart 
} = cartSlice.actions

export { cartMiddleware }
export default cartSlice.reducer