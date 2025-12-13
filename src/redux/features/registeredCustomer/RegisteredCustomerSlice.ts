import { createSlice } from "@reduxjs/toolkit";
import { TRegisteredCustomerSlice } from "./RegisteredCustomerInterface";

const initialState: TRegisteredCustomerSlice = {
  users: undefined,
  isLoading: true,
  searchTerms: undefined,
};

const registeredCustomerSlice = createSlice({
  name: "registeredCustomer",
  initialState,
  reducers: {
    setRegisteredCustomer: (state, { payload }) => {
      state.users = payload;
    },
    setRegisteredCustomerLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setRegisteredUserSearch: (state, { payload }) => {
      state.searchTerms = payload;
    },
  },
});

export const {
  setRegisteredCustomer,
  setRegisteredCustomerLoading,
  setRegisteredUserSearch,
} = registeredCustomerSlice.actions;

export default registeredCustomerSlice.reducer;
