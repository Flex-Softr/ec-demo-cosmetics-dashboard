import { Shipping } from "../order/order.interface";

export type TRegisteredUserStatus = "active" | "banned" | "deleted";

export type TRegisteredCustomer = {
  _id: string;
  uid: string;
  phoneNumber: string;
  status: TRegisteredUserStatus;
  createdAt: string;
  totalOrders: number;
  name: string;
  shipping: Shipping;
};
