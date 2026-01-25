import api from '@/lib/axios';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  children?: Category[];
}

export interface ProductOption {
  id: number;
  name: string;
  type: 'select' | 'radio' | 'checkbox';
  isRequired: boolean;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: number;
  label: string;
  value: string;
  priceModifier: number;
  isDefault: boolean;
}

export interface PricingTier {
  quantity: number;
  unitPrice: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  basePrice: number;
  mainImage?: string;
  images?: string[];
  category?: Category;
  options?: ProductOption[];
  pricingTiers?: PricingTier[];
  isFeatured: boolean;
}

export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'name' | 'newest';
  page?: number;
  perPage?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PriceCalculation {
  unitPrice: number;
  quantity: number;
  optionsPrice: number;
  subtotal: number;
  breakdown: {
    base_price: number;
    options: number;
    quantity: number;
  };
}

export const productService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data.data;
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get<{ success: boolean; data: Category }>(`/categories/${slug}`);
    return response.data.data;
  },

  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params: filters });
    return response.data;
  },

  async getProductsByCategory(categoryId: number, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(`/categories/${categoryId}/products`, { params: filters });
    return response.data;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get<{ success: boolean; data: Product[] }>('/products/featured');
    return response.data.data;
  },

  async getProduct(id: number): Promise<Product> {
    const response = await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
    return response.data.data;
  },

  async calculatePrice(productId: number, quantity: number, options: Record<string, number> = {}): Promise<PriceCalculation> {
    const response = await api.post<{ success: boolean; data: PriceCalculation }>(`/products/${productId}/calculate-price`, {
      quantity,
      options,
    });
    return response.data.data;
  },

  async searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/products/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },
};
