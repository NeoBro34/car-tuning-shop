export type ListMeta = {
  total: number;
  limit: number;
  offset: number;
};

export type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  is_main: boolean;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  discount_price: string | number | null;
  stock_quantity: number;
  sku: string;
  is_active: boolean;
  category_id: number;
  brand_id: number;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ListResponse<T> = {
  items: T[];
  meta: ListMeta;
};

export type ProductFilters = {
  search: string;
  categoryId: string;
  brandId: string;
  minPrice: string;
  maxPrice: string;
};

export type ProductQueryParams = {
  limit: number;
  offset: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  min_price?: string;
  max_price?: string;
};
