import { TUserProfile } from "@/types/user.interface";

export type TUser = TUserProfile;

export type TUsersInitialState = {
  users: TUserProfile[];
  isUsersLoading: boolean;
};
