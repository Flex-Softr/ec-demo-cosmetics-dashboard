import { createSlice } from "@reduxjs/toolkit";
import { TCompletedOrdersInitialState } from "./completedOrdersInterface";

const initialState: TCompletedOrdersInitialState = {
  completedOrders: [],
  selectedStatus: "completed",
  selectedProduct: "",
  selectedTimes: undefined,
  selectedSource: "",
  selectedDivision: "",
  selectedDistrict: "",
  selectedUpazila: "",
  iSOrderUpdate: false,
  bulkOrders: {
    orderIds: [],
    invoices: [],
  },
};

const completedOrdersSlice = createSlice({
  name: "completedOrdersSlice",
  initialState,
  reducers: {
    setCompletedOrders: (state, action) => {
      state.completedOrders = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setSelectedTimes: (state, action) => {
      state.selectedTimes = action.payload;
    },
    setSelectedSource: (state, action) => {
      state.selectedSource = action.payload;
    },
    setSelectedDivision: (state, action) => {
      state.selectedDivision = action.payload;
    },
    setSelectedDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
    },
    setSelectedUpazila: (state, action) => {
      state.selectedUpazila = action.payload;
    },
    setIsOrderUpdate: (state, action) => {
      state.iSOrderUpdate = action.payload;
    },
    setBulkOrder: (state, action) => {
      state.bulkOrders = action.payload;
    },
    setCompletedOrderFilterClear: (state) => {
      state.selectedStatus = "completed";
      state.selectedProduct = "";
      state.selectedTimes = undefined;
      state.selectedSource = "";
      state.selectedDivision = "";
      state.selectedDistrict = "";
      state.selectedUpazila = "";
    },
  },
});
export const {
  setCompletedOrders,
  setSelectedStatus,
  setSelectedProduct,
  setSelectedTimes,
  setSelectedSource,
  setSelectedDivision,
  setSelectedDistrict,
  setSelectedUpazila,
  setCompletedOrderFilterClear,
  // setIsOrderUpdate,
  setBulkOrder,
} = completedOrdersSlice.actions;

export default completedOrdersSlice.reducer;
