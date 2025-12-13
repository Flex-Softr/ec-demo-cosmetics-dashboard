import { TCategories } from "@/app/dashboard/category/components/CategoryTable";
import { TProduct } from "../addProduct/interface";

export type TAllCoupons = {
  selectedType?: string;
  isLoading: boolean;
  codes: TCoupon[];
  selectedTags?: string | string[];
  search?: string;
};

export type TCoupon = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  maxDiscount: number;
  minimumOrderValue: number;
  startDate: string;
  usageLimit: number;
  usageCount: number;
  onlyForRegisteredUsers: false;
  endDate: string;
  tags: string[];
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  allowedUsers: {
    _id: string;
    name: string;
    uid: string;
    phoneNumber: string;
  }[];
  fixedCategories: TCategories[];
  restrictedCategories: TCategories[];
  fixedProducts: TProduct[];
};
