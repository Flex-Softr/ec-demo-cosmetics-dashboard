import { TPermissionName } from "@/const/permissions";
import { TRole } from "@/const/role";

export type TUser = {
  userId: string;
  role: TRole;
  permissions: { _id: string; name: TPermissionName }[]; // Use TPermissionName for name to keep strictness if possible, or just string
  iat: number;
  exp: number;
};

type UserProfile = {
  permissions: { _id: string; name: TPermissionName }[];
  _id: string;
  uid?: string;
  role: TRole;
  phoneNumber: string;
  email: string;
  status: string;
  fullName: string;
  profilePicture: string;
  emergencyContact?: string;
  NIDNo?: string;
  birthCertificateNo?: string;
  joiningDate?: string;
  address?: {
    fullAddress?: string;
  };
};

export type TInitialState = {
  user: null | TUser;
  token: null | string;
  profile: null | UserProfile;
  isProfileLoading: null | boolean;
};
