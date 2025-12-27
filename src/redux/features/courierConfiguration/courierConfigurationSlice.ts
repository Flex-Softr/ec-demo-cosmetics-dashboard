import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TCourierConfig,
  TCourierConfigInitialState,
} from "./courierConfigurationInterface";

const initialState: TCourierConfigInitialState = {
  couriers: [],
  isLoading: false,
  error: null,
  selectedCourier: null,
};

const courierConfigurationSlice = createSlice({
  name: "courierConfiguration",
  initialState,
  reducers: {
    setCouriers: (state, action: PayloadAction<TCourierConfig[]>) => {
      state.couriers = action.payload;
    },
    setSelectedCourier: (
      state,
      action: PayloadAction<TCourierConfig | null>
    ) => {
      state.selectedCourier = action.payload;
    },
  },
});

export const { setCouriers, setSelectedCourier } =
  courierConfigurationSlice.actions;

export default courierConfigurationSlice.reducer;
