import api from '@/lib/axios';

export interface Address {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions?: Record<string, string>;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: {
    value: string;
    label: string;
    color: string;
  };
  paymentStatus: string;
  items: OrderItem[];
  shippingAddress: Address;
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  trackingNumber?: string;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface CreateOrderRequest {
  shipping_address_id: number;
  billing_address_id?: number;
  shipping_method: string;
  payment_method: string;
  promo_code?: string;
  notes?: string;
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const response = await api.get<{ success: boolean; data: Order[] }>('/orders');
    return response.data.data;
  },

  async getOrder(id: number): Promise<Order> {
    const response = await api.get<{ success: boolean; data: Order }>(`/orders/${id}`);
    return response.data.data;
  },

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<{ success: boolean; data: Order }>('/orders', data);
    return response.data.data;
  },

  async cancelOrder(id: number): Promise<Order> {
    const response = await api.post<{ success: boolean; data: Order }>(`/orders/${id}/cancel`);
    return response.data.data;
  },

  async reorder(id: number): Promise<void> {
    await api.post(`/orders/${id}/reorder`);
  },

  async getTracking(id: number): Promise<{ trackingNumber: string; status: string; events: Array<{ date: string; status: string; location: string }> }> {
    const response = await api.get(`/orders/${id}/tracking`);
    return response.data.data;
  },
};

export const addressService = {
  async getAddresses(): Promise<Address[]> {
    const response = await api.get<{ success: boolean; data: Address[] }>('/addresses');
    return response.data.data;
  },

  async createAddress(data: Omit<Address, 'id'>): Promise<Address> {
    const response = await api.post<{ success: boolean; data: Address }>('/addresses', {
      first_name: data.firstName,
      last_name: data.lastName,
      address: data.address,
      city: data.city,
      postal_code: data.postalCode,
      country: data.country,
      phone: data.phone,
      is_default: data.isDefault,
    });
    return response.data.data;
  },

  async updateAddress(id: number, data: Partial<Address>): Promise<Address> {
    const response = await api.put<{ success: boolean; data: Address }>(`/addresses/${id}`, data);
    return response.data.data;
  },

  async deleteAddress(id: number): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },

  async setDefault(id: number): Promise<void> {
    await api.post(`/addresses/${id}/default`);
  },
};
