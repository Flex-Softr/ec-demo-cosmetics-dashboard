import { TUserProfile } from "@/types/user/user.interface";

export type TUser = TUserProfile;

export type TUsersInitialState = {
  users: TUserProfile[];
  isUsersLoading: boolean;
};
