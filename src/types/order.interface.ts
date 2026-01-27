import { TVariation } from "../redux/features/addProduct/variation/interface";

export type ShippingCharge = { _id?: string; name: string; amount: number };

export type Payment = {
  paymentMethod: {
    _id?: string;
    name: string;
    image: string;
  };
  paymentDetails?: Record<string, string>;
};

type StatusHistory = {
  refunded: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Shipping = {
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  upazila: string;
  district: string;
  division: string;
};

export type TOrderedProducts = {
  _id: string;
  productId: string;
  slug: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  unitPrice: number;
  quantity: number;
  total: number;
  variation: TVariation;
  attributes: {
    [key: string]: string;
  };
  isProductWarrantyAvailable: boolean;
  isWarrantyClaim: boolean;
  warranty: {
    warrantyCodes?: {
      code: string;
    }[];
  };
};

export type TOrders = {
  _id: string;
  orderId: string;
  sessionId: string;
  products: TOrderedProducts[];
  subtotal: number;
  shippingCharge: ShippingCharge;
  advance: number;
  discount: number;
  couponDiscount: number;
  total: number;
  payment: Payment;
  statusHistory: StatusHistory;
  status: string;
  deliveryStatus: string;
  monitoringStatus: string;
  trackingStatus: string;
  followUpDate: string;
  shipping: Shipping;
  createdAt: Date;
  updatedAt: Date;
  orderNotes?: string;
  invoiceNotes?: string;
  officialNotes?: string;
  courierNotes?: string;
  monitoringNotes?: string;
  reasonNotes?: string;
  orderSource: { name: string; url: string; lpNo: number };
  courierDetails: { trackingId: string };
  eventId?: string;
  messageFromShippingProvider?: string;
  statusFromShippingProvider?: string;
};

export type TQuery = {
  status?: string;
  deliveryStatus?: string;
  category?: string;
  collection?: string;
  stock?: string;
  sort?: string;
  startFrom?: string;
  endAt?: string;
  productIds?: string;
  orderedTimes?: number;
  orderSource?: string;
  upazila?: string;
  district?: string;
  division?: string;
  page?: number;
  limit?: number;
  brand?: string;
};
