import api from '@/lib/axios';

interface ApiOrder {
  id: number;
  order_number: string;
  status: string;
  status_label: string;
  status_color: string;
  payment_status: string;
  shipping_method: string;
  shipping_cost: string;
  subtotal: string;
  discount: string;
  total: string;
  promo_code: string | null;
  tracking_number: string | null;
  created_at?: string;
}

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

export interface Order {
  id: number;
  orderNumber: string;
  status: {
    value: string;
    label: string;
    color: string;
  };
  paymentStatus: string;
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string | null;
  trackingNumber?: string | null;
  createdAt?: string;
}

const mapOrder = (order: ApiOrder): Order => ({
  id: order.id,
  orderNumber: order.order_number,
  status: {
    value: order.status,
    label: order.status_label,
    color: order.status_color,
  },
  paymentStatus: order.payment_status,
  shippingMethod: order.shipping_method,
  shippingCost: Number(order.shipping_cost),
  subtotal: Number(order.subtotal),
  discount: Number(order.discount),
  total: Number(order.total),
  promoCode: order.promo_code,
  trackingNumber: order.tracking_number,
  createdAt: order.created_at,
});

export interface CreateOrderRequest {
  shipping_address_id: number;
  billing_address_id?: number;
  shipping_method: string;
  payment_method: string;
  promo_code?: string;
  notes?: string;
}

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<{
      order: ApiOrder;
      message: string;
    }>('/orders', data);

    if (!response.data?.order) {
      throw new Error("Commande invalide retournée par l'API");
    }

    return mapOrder(response.data.order);
  },

  async getOrder(id: number): Promise<Order> {
    const response = await api.get<{ order: ApiOrder }>(`/orders/${id}`);
    return mapOrder(response.data.order);
  },
};
