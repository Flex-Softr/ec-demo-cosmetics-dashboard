export const PRODUCT_TYPE = {
  SIMPLE: "simple",
  VARIABLE: "variable",
} as const;

export const productStatus = {
  published: "published",
  draft: "draft",
  private: "private",
} as const;

export const STOCK_STATUS = {
  IN_STOCK: "in_stock",
  LOW_STOCK: "low_stock",
  OUT_OF_STOCK: "out_of_stock",
} as const;

export const stockStatus = Object.values(STOCK_STATUS);

export const STOCK_STATUS_LABELS = {
  [STOCK_STATUS.IN_STOCK]: "In Stock",
  [STOCK_STATUS.LOW_STOCK]: "Low Stock",
  [STOCK_STATUS.OUT_OF_STOCK]: "Out of Stock",
};

export const stockStatusOptions = [
  {
    value: STOCK_STATUS.IN_STOCK,
    label: STOCK_STATUS_LABELS[STOCK_STATUS.IN_STOCK],
  },
  {
    value: STOCK_STATUS.LOW_STOCK,
    label: STOCK_STATUS_LABELS[STOCK_STATUS.LOW_STOCK],
  },
  {
    value: STOCK_STATUS.OUT_OF_STOCK,
    label: STOCK_STATUS_LABELS[STOCK_STATUS.OUT_OF_STOCK],
  },
];
