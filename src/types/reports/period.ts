export type TPeriod =
  | "Select date"
  | "allTime"
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear"
  | "yearly"
  | "customDate"
  | "customRange";

export type TReportsQuery = {
  type: TPeriod;
  customDate?: string;
  startDate?: string;
  endDate?: string;
};

export type TOrderStatusChangeCount = {
  date: string;
  status: string;
  count: number;
};

export type TBestSellingProduct = {
  productId: string;
  productName: string;
  productImage: string;
  stockAvailable: number;
  totalSales: number;
  totalWarrantyClaims: number;
};
