export type TUser = {
  userId: string;
  role: string;
  permissions: string[];
  iat: number;
  exp: number;
};

type UserProfile = {
  permissions: string[];
  _id: string;
  role: string;
  phoneNumber: string;
  email: string;
  status: string;
  fullName: string;
  profilePicture: string;
};

export type TInitialState = {
  user: null | TUser;
  token: null | string;
  profile: null | UserProfile;
  isProfileLoading: null | boolean;
};
