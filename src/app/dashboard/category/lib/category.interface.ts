export type TCategoryImage = {
  _id?: string;
  src: string;
  alt: string;
};

export type TCategories = {
  _id: string;
  image: TCategoryImage;
  name: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
  subcategories?: TCategories[];
  parent?: string;
  sortOrder?: number;
};
