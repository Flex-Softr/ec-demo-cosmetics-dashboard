import { TOrders } from "@/types/order/order.interface";

export type TProduct = {
  _id: string;
  quantity: number;
  price: number;
};

type TShipping = {
  fullName: string | undefined;
  phoneNumber: string | undefined;
  fullAddress: string | undefined;
};

type UpdateOrderInitialState = {
  discount: number;
  product: TProduct;
  subtotal: number;
  total: number;
  shipping: TShipping;
  officialNotes: string;
  invoiceNotes: string;
  courierNotes: string;
};

export type TUpdatePayload = {
  id: string;
  status: {
    status: string;
    message?: string;
  };
};

export type TProcessingOrdersInitialState = {
  processingOrders: TOrders[];
  selectedStatus: string;
  iSOrderUpdate: boolean;
  bulkOrders: {
    orderIds: string[];
    invoices: TOrders[];
  };
};
export type TInitialStateUpdateOrder = {
  updateOrder: UpdateOrderInitialState;
};
