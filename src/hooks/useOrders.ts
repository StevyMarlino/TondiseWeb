import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService, addressService, CreateOrderRequest, Address } from '@/services/order.service';
import { useCartStore } from '@/stores/cartStore';
import { useNavigate } from 'react-router-dom';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders,
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { clearCart } = useCartStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => orderService.createOrder(data),
    onSuccess: (order) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate(`/checkout/success?order=${order.orderNumber}`);
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => orderService.cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useReorder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (id: number) => orderService.reorder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate('/cart');
    },
  });
};

// Addresses
export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: addressService.getAddresses,
  });
};

export const useCreateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Address, 'id'>) => addressService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Address> }) =>
      addressService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
};
