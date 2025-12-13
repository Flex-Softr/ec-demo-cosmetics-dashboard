export type TStats = {
  title: string;
  name: string;
  count: number;
  description: string;
};

export type TReportOrdersCount = {
  count: number;
  id: string;
  name: string;
};

export type TOrderSource =
  | "Website"
  | "Landing Page"
  | "App"
  | "Phone Call"
  | "Social Media"
  | "From Office"
  | "Warranty Claimed";

export type TReportPlatformCount = {
  source: TOrderSource;
  count: number;
  percentage: number;
};
