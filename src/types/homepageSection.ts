import { ICollection } from "./collection";

export type THomePageSection = {
  _id: string;
  title?: string;
  subtitle: string;
  collectionId: string | ICollection; // Foreign key to Collection
  sortOrder: number;
  limit: number;
  ctaText?: string;
  ctaLink?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Input for Create/Update
export type THomePageInput = {
  title: string;
  subtitle?: string;
  collectionId: string;
  sortOrder?: number;
  limit?: number;
  ctaText?: string;
  ctaLink?: string;
};
