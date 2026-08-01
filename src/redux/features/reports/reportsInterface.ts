export type TSalesSummary = {
  total_orders: number;
  gross_sales: number;
  discount_total: number;
  net_sales: number;
  paid_amount: number;
  due_amount: number;
  refund_amount: number;
};

export type TSalesReportOrder = {
  order_id: string;
  created_at: string;
  order_status: string;
  order_source: string | null;
  invoice_id: string;
  invoice_no: string;
  grand_total: number;
  paid_total: number;
  due_total: number;
  payment_status: string;
  customer_name: string | null;
  customer_phone: string | null;
};

export type TProductReport = {
  product_id: string;
  product_name: string;
  sku: string | null;
  quantity_sold: number;
  total_sales: number;
};

export type TCategoryReport = {
  category_id: string;
  category_name: string;
  quantity_sold: number;
  total_sales: number;
};

export type TPaymentReport = {
  method_id: string;
  method_name: string;
  total_received: number;
  total_refunded: number;
};

export type TSalesReportFilters = {
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
  order_status?: string;
  product_id?: string;
  category_id?: string;
  method_id?: string;
};
