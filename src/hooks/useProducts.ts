import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { productService, ProductFilters } from '@/services/product.service';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: ['categories', slug],
    queryFn: () => productService.getCategoryBySlug(slug),
    enabled: !!slug,
  });
};

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  });
};

export const useProductsByCategory = (categoryId: number, filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId, filters],
    queryFn: () => productService.getProductsByCategory(categoryId, filters),
    enabled: !!categoryId,
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: productService.getFeaturedProducts,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};

export const useProductSearch = (query: string, filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', 'search', query, filters],
    queryFn: () => productService.searchProducts(query, filters),
    enabled: query.length >= 2,
  });
};

export const useInfiniteProducts = (filters?: Omit<ProductFilters, 'page'>) => {
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', filters],
    queryFn: ({ pageParam = 1 }) => productService.getProducts({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};
