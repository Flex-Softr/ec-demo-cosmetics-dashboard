export type TUserProfile = {
  fullAddress: string | number | readonly string[] | undefined;
  _id: string;
  uid: string;
  role: string;
  phoneNumber: string;
  email: string;
  status: string;
  fullName: string;
  emergencyContact: string;
  profilePicture?: string;
  NIDNo?: string;
  birthCertificateNo?: string;
  dateOfBirth?: string;
  joiningDate?: string;
  permissions?: string[];
  address?: {
    fullAddress?: string;
  };
};
