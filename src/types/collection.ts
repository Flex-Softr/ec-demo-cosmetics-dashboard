import { IAdminProduct } from "./products";

export type ICollection = {
  _id: string;
  title: string;
  slug: string;
  image?: string | { _id: string; src: string; alt: string }; // ObjectId of the Image
  isActive: boolean;
  sortOrder?: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // The 'products' array is populated in the Single Collection Get API
  products?: IAdminProduct[];
};

export type ICreateCollectionPayload = {
  title: string;
  slug?: string; // Auto-generated if omitted
  image?: string; // ObjectId from Image Upload
  isActive?: boolean; // Defaults to true
  sortOrder?: number;
};

export type IUpdateCollectionPayload = {
  title?: string;
  slug?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
};
