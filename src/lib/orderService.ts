import { orderApi } from './cartApi';

export interface OrderData {
  customer_info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  delivery_info: {
    method: string;
    address: string;
    estimated_days: string;
    fee: number;
  };
  payment_info: {
    method: string;
    details: string;
  };
  order_notes?: string;
  delivery_fee?: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: string;
  total_amount: number;
  delivery_fee: number;
  final_amount: number;
  customer_info: any;
  delivery_info: any;
  payment_info: any;
  order_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: string;
  variant_id: string;
  color_id: string;
  quantity: number;
  accessories: any[];
  unit_price: number;
  total_price: number;
  created_at: string;
}

class OrderService {
  // Create new order
  async createOrder(orderData: OrderData): Promise<Order> {
    try {
      const response = await orderApi.createOrder(orderData);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId: string): Promise<{ order: Order; items: OrderItem[]; status_history: any[] }> {
    try {
      const response = await orderApi.getOrderById(orderId);
      return response.data;
    } catch (error) {
      console.error('Failed to get order:', error);
      throw error;
    }
  }

  // Get order by order number
  async getOrderByNumber(orderNumber: string): Promise<{ order: Order; items: OrderItem[]; status_history: any[] }> {
    try {
      const response = await orderApi.getOrderByNumber(orderNumber);
      return response.data;
    } catch (error) {
      console.error('Failed to get order by number:', error);
      throw error;
    }
  }

  // Get user's orders
  async getUserOrders(limit = 10, offset = 0): Promise<Order[]> {
    try {
      const response = await orderApi.getUserOrders(limit, offset);
      return response.data;
    } catch (error) {
      console.error('Failed to get user orders:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<void> {
    try {
      await orderApi.cancelOrder(orderId, reason);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }

  // Validate order data
  validateOrderData(orderData: OrderData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate customer info
    if (!orderData.customer_info.firstName) errors.push('First name is required');
    if (!orderData.customer_info.lastName) errors.push('Last name is required');
    if (!orderData.customer_info.email) errors.push('Email is required');
    if (!orderData.customer_info.phone) errors.push('Phone is required');
    if (!orderData.customer_info.address) errors.push('Address is required');
    if (!orderData.customer_info.city) errors.push('City is required');
    if (!orderData.customer_info.state) errors.push('State is required');
    if (!orderData.customer_info.pincode) errors.push('Pincode is required');

    // Validate delivery info
    if (!orderData.delivery_info.method) errors.push('Delivery method is required');

    // Validate payment info
    if (!orderData.payment_info.method) errors.push('Payment method is required');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format order data for API
  formatOrderData(cartItems: any[], customerInfo: any, deliveryInfo: any, paymentInfo: any, orderNotes?: string): OrderData {
    return {
      customer_info: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        pincode: customerInfo.pincode,
        landmark: customerInfo.landmark || ''
      },
      delivery_info: {
        method: deliveryInfo.method,
        address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`,
        estimated_days: deliveryInfo.estimatedDays,
        fee: deliveryInfo.fee || 0
      },
      payment_info: {
        method: paymentInfo.method,
        details: paymentInfo.details || ''
      },
      order_notes: orderNotes || '',
      delivery_fee: deliveryInfo.fee || 0
    };
  }
}

export const orderService = new OrderService();
