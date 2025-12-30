import { TOrderSource } from "@/redux/features/reports/reportsInterface";

export const orderSources: TOrderSource[] = [
  "Website",
  "Landing Page",
  "App",
  "Phone Call",
  "Social Media",
  "From Office",
  "Warranty Claimed",
] as const;
