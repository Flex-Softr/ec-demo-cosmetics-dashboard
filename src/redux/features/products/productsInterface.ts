import { TProductType } from "@/const/products";

export type TVariation = {
  attributes: {
    name: string;
    value: string;
  }[];
  _id: string; // Added _id
  price: {
    regularPrice: number;
    salePrice: number;
  };
  inventory: {
    stockStatus: string;
    stockQuantity: number;
    sku?: string;
  };
};

export type TProduct = {
  _id: string;
  title: string;
  type?: TProductType;
  variations?: TVariation[];
  thumbnail: {
    _id: string;
    src: string;
    alt: string;
  };
  category: {
    _id: string;
    name: string;
  };
  regularPrice: number;
  salePrice: number;
  sku?: string;
  sales: number;
  stockStatus: string;
  stockAvailable: number;
  totalReview: number;
  averageRating: number | null;
  published: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProductsInitialState = {
  products: TProduct[];
  countsByStatus: { name: string; total: number }[];
  selectedStatus: string;
  bulkProducts: {
    productIds: string[];
    productSlugs: string[];
  };
  search: boolean;
  searchQuery: string;
  searchedProducts: TProduct[];
  productDataErrors: string[];
};
