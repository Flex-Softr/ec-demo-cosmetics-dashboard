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

export type TPlaceOrder = {
  invoice: string; // Must be Unique and can be alpha-numeric including hyphens and underscores.
  recipient_name: string; // Within 100 characters.
  recipient_phone: string; // Must be 11 Digits Phone number
  recipient_address: string; // Recipient’s address within 250 characters.
  cod_amount: number; // Cash on delivery amount in BDT including all charges. Can’t be less than 0.
  note?: string; // Delivery instructions or other notes. Optional
};
export type TUpdatePayload = {
  id: string;
  status: {
    status: string;
    message?: string;
  };
};

export type TOrdersInitialState = {
  orders: TOrders[];
  selectedStatus: string;
  startFrom: string;
  endAt: string;
  iSOrderUpdate: boolean;
  singleOrder: TPlaceOrder;
  bulkOrders: {
    selectedOrders: TPlaceOrder[];
    orderIds: string[];
    invoices: TOrders[];
  };
};
export type TInitialStateUpdateOrder = {
  updateOrder: UpdateOrderInitialState;
};
