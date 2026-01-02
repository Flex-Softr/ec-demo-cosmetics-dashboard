import { createSlice } from "@reduxjs/toolkit";
import { TCustomerOrdersInitialState } from "./customerOrdersInterface";

const initialState: TCustomerOrdersInitialState = {
  customerOrders: [],
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

const customerOrdersSlice = createSlice({
  name: "customerOrdersSlice",
  initialState,
  reducers: {
    setCustomerOrders: (state, action) => {
      state.customerOrders = action.payload;
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
    setCustomerOrderFilterClear: (state) => {
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
  setCustomerOrders,
  setSelectedStatus,
  setSelectedProduct,
  setSelectedTimes,
  setSelectedSource,
  setSelectedDivision,
  setSelectedDistrict,
  setSelectedUpazila,
  setCustomerOrderFilterClear,
  // setIsOrderUpdate,
  setBulkOrder,
} = customerOrdersSlice.actions;

export default customerOrdersSlice.reducer;
