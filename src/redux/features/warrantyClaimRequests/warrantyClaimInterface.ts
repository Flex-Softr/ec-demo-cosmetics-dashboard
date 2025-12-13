import { TVariation } from "../addProduct/variation/interface";

type TShipping = {
  fullName: string;
  fullAddress: string;
  phoneNumber: string;
};

export type TPrevWarrantyInformation = {
  duration: string;
  endsDate: string;
  startDate: string;
};

export type TClaims = {
  _id: string;
  createdAt: string;
  claimedCodes: string[];
  order_id?: string;
};

export type TClaimReqData = {
  order_id: string;
  orderItemId: string;
  productId: string;
  prevWarrantyInformation: TPrevWarrantyInformation;
  product: {
    _id: string;
    title: string;
    variations?: TVariation[];
  };
  claimedCodes: string[];
  _id: string;
  warrantyClaimHistory?: {
    _id: string;
    parentItemId: string;
    parentOrder: string;
    claims?: TClaims[];
  };
  attributes: Record<string, string>;
  variation: string;
};

export type TVideosAndImages = {
  path: string;
  fileType: "image" | "video";
  _id: string;
};

export type TWarrantyClaimContactStatus =
  | "pending"
  | "confirmed"
  | "retry required";

export type TWarrantyClaimResult = "pending" | "solved" | "problem";
export type TWarrantyClaimApprovalStatus = "approved";

export type TWarrantyClaim = {
  _id: string;
  reqId: string;
  problemInDetails: string;
  shipping: TShipping;
  videosAndImages: TVideosAndImages[];
  officialNotes?: string;
  contactStatus: TWarrantyClaimContactStatus;
  result: TWarrantyClaimResult;
  approvalStatus?: TWarrantyClaimApprovalStatus;
  warrantyClaimReqData: TClaimReqData[];
  createdAt: string;
};

export type TWarrantyClaimInitialState = {
  warrantyClaimRequests: TWarrantyClaim[];
  bulkSelect: {
    requestIds: string[];
  };
};
