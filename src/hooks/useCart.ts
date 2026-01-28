import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService, AddToCartRequest } from '@/services/cart.service';
import { useCartStore } from '@/stores/cartStore';

// Hook pour synchroniser avec l'API (mode connecté)
export const useCartSync = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook pour les mutations du panier
export const useCartActions = () => {
  const queryClient = useQueryClient();
  const localCart = useCartStore();

  const addItemMutation = useMutation({
    mutationFn: (data: AddToCartRequest) => cartService.addItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => cartService.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const applyPromoMutation = useMutation({
    mutationFn: (code: string) => cartService.applyPromoCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  return {
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    removeItem: removeItemMutation.mutate,
    applyPromo: applyPromoMutation.mutate,
    isAdding: addItemMutation.isPending,
    isUpdating: updateItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
  };
};

// Hook unifié pour le panier (utilise local store pour mode guest, API pour mode connecté)
export const useCart = () => {
  const cartStore = useCartStore();

  return {
    items: cartStore.items,
    itemsCount: cartStore.itemsCount(), // Nombre de produits distincts (ex: 2)
    totalQuantity: cartStore.totalQuantity(), // Somme des quantités (ex: 8)
    subtotal: cartStore.subtotal(),
    discount: cartStore.discount(),
    total: cartStore.total(),
    promoCode: cartStore.promoCode,
    isOpen: cartStore.isOpen,

    addItem: cartStore.addItem,
    updateQuantity: cartStore.updateQuantity,
    removeItem: cartStore.removeItem,
    clearCart: cartStore.clearCart,
    setPromoCode: cartStore.setPromoCode,
    toggleCart: cartStore.toggleCart,
    openCart: cartStore.openCart,
    closeCart: cartStore.closeCart,
  };
};
