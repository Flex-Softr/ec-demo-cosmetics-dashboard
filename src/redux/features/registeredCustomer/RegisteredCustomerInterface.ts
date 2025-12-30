import { TRegisteredCustomer } from "@/types/registeredUser";

export type TRegisteredCustomerSlice = {
  users?: TRegisteredCustomer[];
  isLoading: boolean;
  searchTerms?: string;
};
