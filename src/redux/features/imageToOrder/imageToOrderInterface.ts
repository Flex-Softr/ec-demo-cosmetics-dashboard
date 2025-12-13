export type TImageToOrderSlice = {
  isLoading: boolean;
  allRequests: TImageToOrderReq[];
};

export type TImageToOrderContactStatus =
  | "pending"
  | "confirmed"
  | "retry required";

export type TImageToOrderStatus =
  | "pending"
  | "confirmed"
  | "canceled"
  | "completed";

export type TImageToOrderReq = {
  _id: string;
  reqId: string;
  shipping: {
    fullName: string;
    phoneNumber: string;
    fullAddress: string;
  };
  contactStatus: TImageToOrderContactStatus;
  status: TImageToOrderStatus;
  createdAt: string;
  images: string[];
  customerNotes: string;
};
