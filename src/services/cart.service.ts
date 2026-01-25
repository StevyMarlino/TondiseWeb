import api from '@/lib/axios';
import { CartItem } from '@/stores/cartStore';

export interface ApiCartItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions?: Record<string, string>;
  designId?: number;
  product: {
    id: number;
    name: string;
    mainImage: string;
  };
}

export interface ApiCart {
  id: number;
  items: ApiCartItem[];
  itemsCount: number;
  subtotal: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  selected_options?: Record<string, number>;
  design_id?: number;
}

export const cartService = {
  async getCart(): Promise<ApiCart> {
    const response = await api.get<{ success: boolean; data: ApiCart }>('/cart');
    return response.data.data;
  },

  async addItem(data: AddToCartRequest): Promise<ApiCartItem> {
    const response = await api.post<{ success: boolean; data: ApiCartItem }>('/cart/items', data);
    return response.data.data;
  },

  async updateItem(itemId: number, quantity: number): Promise<ApiCartItem> {
    const response = await api.put<{ success: boolean; data: ApiCartItem }>(`/cart/items/${itemId}`, { quantity });
    return response.data.data;
  },

  async removeItem(itemId: number): Promise<void> {
    await api.delete(`/cart/items/${itemId}`);
  },

  async applyPromoCode(code: string): Promise<{ discount: number; promoCode: string }> {
    const response = await api.post<{ success: boolean; data: { discount: number; promo_code: string } }>('/cart/promo', { code });
    return {
      discount: response.data.data.discount,
      promoCode: response.data.data.promo_code,
    };
  },

  async removePromoCode(): Promise<void> {
    await api.delete('/cart/promo');
  },
};
