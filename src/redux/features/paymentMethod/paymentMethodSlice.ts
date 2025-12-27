import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TPaymentMethod } from "./paymentMethodInterface";

type TPaymentMethodState = {
  selectedPaymentMethod: TPaymentMethod | null;
};

const initialState: TPaymentMethodState = {
  selectedPaymentMethod: null,
};

const paymentMethodSlice = createSlice({
  name: "paymentMethod",
  initialState,
  reducers: {
    setSelectedPaymentMethod: (
      state,
      action: PayloadAction<TPaymentMethod | null>
    ) => {
      state.selectedPaymentMethod = action.payload;
    },
  },
});

export const { setSelectedPaymentMethod } = paymentMethodSlice.actions;

export default paymentMethodSlice.reducer;
