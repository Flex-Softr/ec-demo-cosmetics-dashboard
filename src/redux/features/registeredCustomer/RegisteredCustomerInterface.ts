import { TRegisteredCustomer } from "@/types/registeredUser/registeredUser";

export type TRegisteredCustomerSlice = {
  users?: TRegisteredCustomer[];
  isLoading: boolean;
  searchTerms?: string;
};
