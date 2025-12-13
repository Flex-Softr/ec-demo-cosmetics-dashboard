import { createSlice } from "@reduxjs/toolkit";
import { TShippingCharge } from "./shippingChargeInterface";

export type TShippingChargeSlice = {
  isLoading: boolean;
  shippingCharges: TShippingCharge[];
};

const initialState: TShippingChargeSlice = {
  isLoading: true,
  shippingCharges: [],
};

const shippingChargesSlice = createSlice({
  name: "shippingCharges",
  initialState,
  reducers: {
    setShippingCharges: (state, { payload }) => {
      state.shippingCharges = payload;
    },
    setShippingChargeLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
});

export const { setShippingCharges, setShippingChargeLoading } =
  shippingChargesSlice.actions;

export default shippingChargesSlice.reducer;
