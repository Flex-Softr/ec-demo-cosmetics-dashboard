import { STOCK_STATUS, TProductType } from "@/const/products";

export type TProductPayload = {
  // --- Basic Info Section ---
  title: string; // Text input
  slug?: string; // Auto-generated from title or custom input
  type?: TProductType; // Dropdown/Radio
  description?: string; // Rich Text Editor (HTML)
  shortDescription?: string; // Textarea
  additionalInfo?: string; // Textarea (optional)
  usageGuidelines?: string; // Textarea (optional)
  previewLink?: string; // URL input for preview

  // --- Pricing Section ---
  price?: {
    regularPrice: number; // Number input
    salePrice?: number; // Number input
    discountPercent?: number; // Calculated or Number input
    date?: {
      // Date Range Picker (if salePrice is set)
      start: string; // ISO Date
      end: string; // ISO Date
    };
  };

  // --- Media Section ---
  image: {
    thumbnail: string; // URL from image uploader
    gallery: string[]; // Array of URLs from image uploader
  };

  // --- Inventory Section ---
  inventory?: {
    sku?: string; // Text input
    stockStatus?: (typeof STOCK_STATUS)[keyof typeof STOCK_STATUS];
    stockQuantity?: number; // Number input
    manageStock?: boolean; // Checkbox
    lowStockWarning?: number; // Number input
    hideStock?: boolean; // Checkbox
  };

  // --- Organization Section ---
  category: {
    name: string; // Text input (backend finds/creates category)
    subCategory?: string; // Text input (backend finds/creates subcategory)
  };
  productCollection?: string; // ID of the collection
  brand?: string; // Text input (backend finds/creates brand)
  tag?: {
    // Tag inputs
    label: string;
    value: string;
  }[];

  // --- Attributes (Dynamic Section) ---
  attributes?: {
    name: string; // e.g., "Color"
    values: string[]; // e.g., ["Red", "Blue"]
  }[];

  // --- Variations (Conditional Section: Show if type === "variable") ---
  variations?: {
    attributes: { [key: string]: string };
    price: {
      // Variation specific price
      regularPrice: number;
      salePrice?: number;
    };
    inventory: {
      // Variation specific inventory
      sku?: string;
      stockQuantity: number;
    };
    image: string; // Variation specific image URL
  }[];

  // --- Meta & SEO Section ---
  seo?: {
    metaTitle?: string; // Text input
    metaDescription?: string; // Textarea
    keywords?: string; // Comma-separated keywords
    canonicalUrl?: string;
    schemaMarkup?: string;
  };

  // --- Warranty & Policy ---
  warranty: boolean; // Checkbox (Has Warranty?)
  warrantyInfo?: {
    // Show if warranty is true
    duration: {
      quantity: string; // Number input (as string)
      unit: string; // Dropdown: "Month" | "Year" | "Day"
    };
    terms: string; // Textarea
  };

  // --- Publish Options ---
  publishedStatus: string;
};

export type IAdminProductResponse = {
  success: boolean;
  statusCode: number; // 200
  message: string; // "All Products retrieved successfully"
  meta: {
    page: number; // Current page
    limit: number; // Limit per page
    total: number; // Total matching items
    totalPage: number; // Total pages
  };
  data: {
    // Stats for "All", "Public", "Draft" tabs
    countsByStatus: {
      name: string; // e.g., "all", "Public", "Draft"
      total: number; // Count
    }[];
    // Table Rows
    data: IAdminProduct[];
  };
};

// Single Row Data Structure
export type IAdminProduct = {
  _id: string; // Use for Key and Actions (Edit/Delete)
  title: string; // Product Name Column
  slug: string; // Product Slug Column
  sku?: string; // SKU Column
  stockStatus: (typeof STOCK_STATUS)[keyof typeof STOCK_STATUS]; // Stock Status Badge
  stockAvailable: number; // Quantity Column
  thumbnail: {
    src: string; // Thumbnail Image
    alt: string;
  };
  previewLink?: string;
  category: {
    name: string; // Category Column
  }[];
  productCollection?: {
    _id: string;
    title: string;
    slug: string;
  };
  type?: TProductType;
  variations?: {
    _id: string;
    attributes: {
      [key: string]: string;
    };
    price: {
      regularPrice: number;
      salePrice?: number;
    };
    inventory: {
      sku?: string;
      stockQuantity: number;
      stockStatus: (typeof STOCK_STATUS)[keyof typeof STOCK_STATUS];
      stockAvailable: number;
      manageStock: boolean;
    };
    isActive: boolean;
  }[];
  regularPrice?: number; // Price Column
  salePrice?: number; // Show sale price if exists
  manageStock: boolean;
  publishedStatus: string; // Date Column (ISO String)
};
