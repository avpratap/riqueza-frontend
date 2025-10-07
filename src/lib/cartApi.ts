const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    try {
      // First try the new auth storage format
      const authData = localStorage.getItem('requeza_auth_data');
      if (authData) {
        const parsed = JSON.parse(authData);
        if (parsed.token) {
          // Simple check - if token looks valid (has 3 parts separated by dots)
          const parts = parsed.token.split('.');
          if (parts.length === 3) {
            console.log('🔑 Auth token found (from requeza_auth_data):', parsed.token.substring(0, 20) + '...');
            return parsed.token;
          }
        }
      }
      
      // Fallback to old format
      const token = localStorage.getItem('authToken');
      if (token) {
        const parts = token.split('.');
        if (parts.length === 3) {
          console.log('🔑 Auth token found (from authToken):', token.substring(0, 20) + '...');
          return token;
        }
      }
    } catch (error) {
      console.log('❌ Error parsing auth data:', error);
    }
  }
  console.log('❌ No auth token found');
  return null;
};

// Get guest session ID
const getGuestSessionId = () => {
  if (typeof window !== 'undefined') {
    let sessionId = localStorage.getItem('guestSessionId');
    if (!sessionId) {
      sessionId = 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('guestSessionId', sessionId);
    }
    return sessionId;
  }
  return null;
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const guestSessionId = getGuestSessionId();
  
  // If user is authenticated, don't send guest session ID
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Using authenticated request with token');
  } else if (guestSessionId) {
    headers['X-Guest-Session-Id'] = guestSessionId;
    console.log('👤 Using guest request with session ID:', guestSessionId.substring(0, 20) + '...');
  } else {
    console.log('⚠️ No authentication method available');
  }
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };
  
  console.log('🌐 API Request:', { 
    endpoint, 
    method: config.method || 'GET',
    headers: config.headers,
    hasToken: !!token,
    hasGuestSessionId: !!guestSessionId
  });

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Cart API functions
export const cartApi = {
  // Get user's cart (authenticated or guest)
  getCart: async () => {
    const token = getAuthToken();
    const guestSessionId = getGuestSessionId();
    const endpoint = token ? '/cart' : '/guest-cart';
    
    console.log('🛒 getCart called:', { 
      hasToken: !!token, 
      hasGuestSessionId: !!guestSessionId, 
      endpoint,
      guestSessionId 
    });
    
    return apiRequest(endpoint);
  },

  // Add item to cart (authenticated or guest)
  addToCart: async (cartData: {
    product_id: string;
    variant_id: string;
    color_id: string;
    quantity: number;
    accessories?: any[];
    total_price: number;
  }) => {
    const token = getAuthToken();
    
    // Force authenticated endpoint if token exists
    const endpoint = token ? '/cart/add' : '/guest-cart/add';
    
    console.log('🛒 addToCart called:', { 
      hasToken: !!token, 
      endpoint,
      productId: cartData.product_id,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    });
    
    // If no token, add extra validation
    if (!token) {
      console.log('⚠️ No auth token - using guest endpoint');
    } else {
      console.log('✅ Auth token present - using authenticated endpoint');
    }
    
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(cartData),
    });
  },

  // Update cart item quantity (authenticated or guest)
  updateQuantity: async (itemId: string, quantity: number) => {
    const token = getAuthToken();
    const endpoint = token ? `/cart/items/${itemId}/quantity` : `/guest-cart/items/${itemId}/quantity`;
    return apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  // Increment cart item quantity (authenticated or guest)
  incrementQuantity: async (itemId: string) => {
    const token = getAuthToken();
    const endpoint = token ? `/cart/items/${itemId}/increment` : `/guest-cart/items/${itemId}/increment`;
    return apiRequest(endpoint, {
      method: 'PUT',
    });
  },

  // Decrement cart item quantity (authenticated or guest)
  decrementQuantity: async (itemId: string) => {
    const token = getAuthToken();
    const endpoint = token ? `/cart/items/${itemId}/decrement` : `/guest-cart/items/${itemId}/decrement`;
    return apiRequest(endpoint, {
      method: 'PUT',
    });
  },

  // Remove item from cart (authenticated or guest)
  removeFromCart: async (itemId: string) => {
    const token = getAuthToken();
    const endpoint = token ? `/cart/items/${itemId}` : `/guest-cart/items/${itemId}`;
    
    console.log('🌐 CartAPI.removeFromCart called:', {
      itemId,
      hasToken: !!token,
      endpoint,
      token: token ? token.substring(0, 20) + '...' : 'none'
    });
    
    try {
      const result = await apiRequest(endpoint, {
        method: 'DELETE',
      });
      console.log('✅ CartAPI.removeFromCart success:', result);
      return result;
    } catch (error) {
      console.error('❌ CartAPI.removeFromCart error:', error);
      throw error;
    }
  },

  // Clear cart (authenticated or guest)
  clearCart: async () => {
    const token = getAuthToken();
    const endpoint = token ? '/cart/clear' : '/guest-cart/clear';
    return apiRequest(endpoint, {
      method: 'DELETE',
    });
  },

  // Get cart summary (authenticated or guest)
  getCartSummary: async () => {
    const token = getAuthToken();
    const endpoint = token ? '/cart/summary' : '/guest-cart/summary';
    return apiRequest(endpoint);
  },

  // Check if cart is empty (authenticated or guest)
  checkCartEmpty: async () => {
    const token = getAuthToken();
    const endpoint = token ? '/cart/check-empty' : '/guest-cart/check-empty';
    return apiRequest(endpoint);
  },

  // Transfer guest cart to authenticated user
  transferGuestCartToUser: async (guestSessionId: string) => {
    console.log('🔄 transferGuestCartToUser called:', {
      guestSessionId: guestSessionId.substring(0, 20) + '...'
    });

    return apiRequest('/cart-transfer/transfer', {
      method: 'POST',
      headers: {
        'X-Guest-Session-Id': guestSessionId
      }
    });
  },
};

// Order API functions
export const orderApi = {
  // Create new order (guest or authenticated)
  createOrder: async (orderData: {
    customer_info: any;
    delivery_info: any;
    payment_info: any;
    order_notes?: string;
    delivery_fee?: number;
  }) => {
    const token = getAuthToken();
    const endpoint = token ? '/orders' : '/guest-orders';
    
    console.log('📦 createOrder called:', { 
      hasToken: !!token, 
      endpoint,
      customerName: orderData.customer_info?.firstName 
    });
    
    return apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get order by ID (guest or authenticated)
  getOrderById: async (orderId: string) => {
    const token = getAuthToken();
    const endpoint = token ? `/orders/${orderId}` : `/guest-orders/${orderId}`;
    return apiRequest(endpoint);
  },

  // Get order by order number (guest or authenticated)
  getOrderByNumber: async (orderNumber: string) => {
    const token = getAuthToken();
    const endpoint = token ? `/orders/number/${orderNumber}` : `/guest-orders/number/${orderNumber}`;
    return apiRequest(endpoint);
  },

  // Get user's orders (guest or authenticated)
  getUserOrders: async (limit = 10, offset = 0) => {
    const token = getAuthToken();
    const endpoint = token ? `/orders/my-orders?limit=${limit}&offset=${offset}` : `/guest-orders/my-orders?limit=${limit}&offset=${offset}`;
    return apiRequest(endpoint);
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason?: string) => {
    return apiRequest(`/orders/${orderId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },
};

// Product API functions
export const productApi = {
  // Get all products
  getProducts: async () => {
    return apiRequest('/products');
  },

  // Get product by ID
  getProductById: async (productId: string) => {
    return apiRequest(`/products/${productId}`);
  },

  // Get accessories
  getAccessories: async () => {
    return apiRequest('/products/accessories');
  },
};
