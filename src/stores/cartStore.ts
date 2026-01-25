import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: number;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions?: Record<string, string>;
  designId?: number;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
}

interface CartState {
  items: CartItem[];
  promoCode: PromoCode | null;
  isOpen: boolean;

  // Computed
  itemsCount: () => number;
  subtotal: () => number;
  discount: () => number;
  total: () => number;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setPromoCode: (promo: PromoCode | null) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      isOpen: false,

      itemsCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      subtotal: () => get().items.reduce((acc, item) => acc + item.totalPrice, 0),

      discount: () => {
        const { promoCode } = get();
        const subtotal = get().subtotal();
        if (!promoCode) return 0;

        if (promoCode.type === 'percentage') {
          return subtotal * (promoCode.discount / 100);
        }
        return promoCode.discount;
      },

      total: () => get().subtotal() - get().discount(),

      addItem: (item) => {
        const id = crypto.randomUUID();
        set((state) => {
          // Vérifier si le produit existe déjà avec les mêmes options
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId &&
                   JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += item.quantity;
            newItems[existingIndex].totalPrice = newItems[existingIndex].quantity * newItems[existingIndex].unitPrice;
            return { items: newItems };
          }

          return { items: [...state.items, { ...item, id }] };
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
              : item
          ),
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => set({ items: [], promoCode: null }),

      setPromoCode: (promoCode) => set({ promoCode }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode }),
    }
  )
);
