export type TAllProducts = {
  _id: string;
  title: string;
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
  sku: string;
  sales: number;
  stockStatus: string;
  stockAvailable: number;
  totalReview: number;
  averageRating: number | null;
  published: string;
};

export type TProductsInitialState = {
  products: TAllProducts[];
  selectedStatus: string;
  bulkProducts: {
    productsIds: string[];
  };
  search: boolean;
  searchQuery: string;
  searchedProducts: TAllProducts[];
  productDataErrors: string[];
};
