import api from '@/lib/axios';

export interface ApiCartItem {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    short_description: string;
    base_price: string;
    main_image: string | null;
    images: string[];
    is_featured: boolean;
  };
  quantity: number;
  selected_options: number[];
  design: any | null;
  unit_price: string;
  total_price: string;
}

export interface ApiCart {
  id: number;
  items: ApiCartItem[];
  items_count: number;
  subtotal: string;
  discount: string;
  promo_code: string | null;
  total: string;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  selected_options?: Record<number, number>; // { optionId: valueId }
  design_id?: number | null;
}

export const cartService = {
  async getCart(): Promise<ApiCart> {
    const response = await api.get('/cart');
    return response.data.cart || response.data;
  },

  async addItem(data: AddToCartRequest): Promise<ApiCartItem> {
    const response = await api.post('/cart/items', data);
    return response.data.item || response.data;
  },

  async updateItem(itemId: number, quantity: number): Promise<ApiCartItem> {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data.item || response.data;
  },

  async removeItem(itemId: number): Promise<void> {
    await api.delete(`/cart/items/${itemId}`);
  },

  async clearCart(): Promise<void> {
    // Clear all items from cart
    const cart = await this.getCart();
    await Promise.all(cart.items.map(item => this.removeItem(item.id)));
  },

  async applyPromoCode(code: string): Promise<ApiCart> {
    const response = await api.post('/cart/promo', { code });
    return response.data.cart || response.data;
  },

  async removePromoCode(): Promise<ApiCart> {
    const response = await api.delete('/cart/promo');
    return response.data.cart || response.data;
  },

  // Sync local cart items to server cart
  async syncLocalCart(localItems: Array<{
    productId: number;
    quantity: number;
    selectedOptions?: Record<string, string>;
  }>): Promise<ApiCart> {
    // Clear server cart first
    try {
      await this.clearCart();
    } catch (e) {
      // Cart might already be empty
    }

    // Add all local items to server
    for (const item of localItems) {
      try {
        await this.addItem({
          product_id: item.productId,
          quantity: item.quantity,
          selected_options: [], // Options need to be IDs, local cart stores labels
        });
      } catch (e) {
        console.error('Error syncing item:', e);
      }
    }

    return this.getCart();
  },
};
