import config from "@/config/config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatImageSrc(src: string | undefined | null): string {
  // Return placeholder if src is missing
  if (!src) return "/image-placeholder.webp";

  // Debug log
  // console.log("formatImageSrc input:", src);

  // Trim and replace backslashes
  let cleanSrc = src.trim().replace(/\\/g, "/");

  // Check for string "null" or "undefined"
  if (cleanSrc === "null" || cleanSrc === "undefined" || !cleanSrc) {
    return "/image-placeholder.webp";
  }

  // If already absolute, just return the cleaned URL
  if (cleanSrc.startsWith("http://") || cleanSrc.startsWith("https://")) {
    return cleanSrc;
  }

  // Remove leading slash if present to avoid double slash when joining
  if (cleanSrc.startsWith("/")) {
    cleanSrc = cleanSrc.substring(1);
  }

  const baseUrl = config.api_base_url || "";
  // Ensure base URL doesn't have trailing slash if we're joining
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  return `${cleanBaseUrl}/${cleanSrc}`;
}

import { STOCK_STATUS, STOCK_STATUS_LABELS } from "@/const/products";

// ... existing imports ...

export function formatStockStatus(status: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    STOCK_STATUS_LABELS[status as keyof typeof STOCK_STATUS_LABELS] || status
  );
}

export function getStockStatusColor(status: string) {
  switch (status) {
    case STOCK_STATUS.IN_STOCK:
      return "text-green-500";
    case STOCK_STATUS.LOW_STOCK:
      return "text-yellow-600";
    case STOCK_STATUS.OUT_OF_STOCK:
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}
