export type ProductImage = { src: string; thumb: string; alt: string };

export type Product = {
  id: number;
  slug: string;
  name: string;
  type: "simple" | "grouped" | "variable" | string;
  description: string[];
  shortDescription: string[];
  regularPrice: number;
  price: number;
  onSale: boolean;
  images: ProductImage[];
  categories: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  /** Units left, or null when stock isn't tracked. */
  stock: number | null;
  soldIndividually: boolean;
  purchasable: boolean;
  groupedProducts: number[];
  /** Vendor slug, or null for products sold by AIIR itself. */
  vendor: string | null;
  /** Lower = newer. Mirrors the WordPress publish order. */
  createdRank: number;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  parent: string | null;
};

export type CategoryNode = Category & { count: number; children: CategoryNode[] };

export type Vendor = {
  slug: string;
  name: string;
  email: string;
  /** Store address as entered by the vendor; empty when not set. */
  address: string;
  phone: string;
  rating: number;
};

export type Review = {
  productId: number;
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string[];
  image: string | null;
  category: string;
  comments: { author: string; date: string; text: string }[];
};

export type SortKey = "default" | "popularity" | "rating" | "date" | "price" | "price-desc";

export type ProductQuery = {
  category?: string;
  vendor?: string;
  search?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
};

export type Paged<T> = { items: T[]; total: number; page: number; totalPages: number };
