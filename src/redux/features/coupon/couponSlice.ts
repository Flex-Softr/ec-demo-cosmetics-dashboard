import { createSlice } from "@reduxjs/toolkit";
import { TAllCoupons } from "./couponInterface";

const initialState: TAllCoupons = {
  selectedType: undefined,
  isLoading: true,
  codes: [],
  selectedTags: [],
  search: undefined,
};

const couponSlice = createSlice({
  name: "allCoupons",
  initialState,
  reducers: {
    setCoupons: (state, { payload }) => {
      state.codes = payload;
    },
    setCouponSelectedType: (state, { payload }) => {
      state.selectedType = payload;
    },
    setCouponLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setCouponSelectedTags: (state, { payload }) => {
      state.selectedTags = payload;
    },
    setCouponSearch: (state, { payload }) => {
      state.search = payload;
    },
  },
});

export const {
  setCoupons,
  setCouponSelectedType,
  setCouponLoading,
  setCouponSelectedTags,
  setCouponSearch,
} = couponSlice.actions;

export default couponSlice.reducer;
