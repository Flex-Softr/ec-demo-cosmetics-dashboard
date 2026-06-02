import config from "@/config/config";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeUTF8(str: string | undefined | null): string {
  if (!str) return "";

  // If the string contains any characters outside the Latin-1 range (0-255),
  // it is already a decoded Unicode string and should be returned as is.
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
      return str;
    }
  }

  try {
    // Modern approach to handle UTF-8 bytes misinterpreted as ISO-8859-1
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
      bytes[i] = str.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch (e) {
    // Fallback to original string if decoding fails
    return str;
  }
}

export function formatImageSrc(src: string | undefined | null): string {
  // Return placeholder if src is missing
  if (!src) return "/placeholder.png";

  // Trim and replace backslashes
  let cleanSrc =
    config.env === "development" ? src.trim().replace(/\\/g, "/") : src;

  // Check for string "null" or "undefined"
  if (cleanSrc === "null" || cleanSrc === "undefined" || !cleanSrc) {
    return "/placeholder.png";
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
