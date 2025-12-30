import { TOrders } from "@/types/order.interface";

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

type UpdateCustomersInitialState = {
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

export type TCustomersInitialState = {
  customers: TOrders[];
  selectedStatus: string;
  selectedProduct: string;
  selectedTimes: number | undefined;
  selectedSource: string;
  selectedDivision: string;
  selectedDistrict: string;
  selectedUpazila: string;
  iSOrderUpdate: boolean;
  bulkOrders: {
    orderIds: string[];
    invoices: TOrders[];
  };
};
export type TInitialStateUpdateCustomers = {
  updateOrder: UpdateCustomersInitialState;
};
