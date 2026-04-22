import { Shipping } from "@/types/order.interface";

export type TCustomer = {
  _id: string;
  uid: string;
  phoneNumber: string;
  email: string;
  status: string;
  createdAt: string;
  name: string;
  shipping: Shipping;
};
