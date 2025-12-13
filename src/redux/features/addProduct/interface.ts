import { TVariation } from "./variation/interface";

type TSelectValue = {
  label: string;
  value: string;
};

type PriceDate = {
  start: string;
  end: string;
};

export type TPrice = {
  index?: number;
  regularPrice: number;
  salePrice?: number;
  discountPercent?: number;
  priceSave?: number;
  date?: PriceDate;
};

export type TImage = {
  thumbnail: string;
  gallery: string[];
};

export type TInventory = {
  index?: number;
  sku?: string;
  stockStatus: string;
  stockQuantity: number;
  stockAvailable: number;
  preStockQuantity: number;
  productCode?: string;
  manageStock: boolean;
  lowStockWarning: number;
  // showStockQuantity?: boolean;
  // showStockWithText?: boolean;
  hideStock: boolean;
  // soldIndividually?: boolean;
};

export type TOffer = {
  index?: number;
  flash: boolean;
  today: boolean;
  featured: boolean;
};

export type TAttribute = {
  name: string;
  values: string[];
};

export type TCategory = {
  name: string;
  subCategory: string | undefined;
};

export type TSeoData = {
  focusKeyphrase: string;
  metaTitle: string;
  slug: string;
  metaDescription: string;
};

export type TWarrantyInfo = {
  duration: { quantity: string; unit: string };
  terms: string;
};

export type TPublishedStatus = {
  status: string;
  visibility: string;
  date: string;
};

export type TProduct = {
  _id?: string;
  title: string;
  permalink?: string;
  slug?: string;
  type?: string;
  description: string;
  shortDescription: string;
  additionalInfo: string;
  usageGuidelines: string;
  price: TPrice;
  image: TImage;
  inventory: TInventory;
  attributes: TAttribute[];
  variations: TVariation[];
  brand: string | undefined;
  category: TCategory;
  tag?: TSelectValue[];
  seoData?: TSeoData;
  offer?: TOffer;
  featured: boolean;
  downloadable?: boolean;
  review?: boolean;
  warranty: boolean;
  warrantyInfo: TWarrantyInfo;
  publishedStatus: TPublishedStatus;
};
