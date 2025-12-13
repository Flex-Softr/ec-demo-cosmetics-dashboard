import { createSlice } from "@reduxjs/toolkit";
import { TCustomersInitialState } from "./customersInterface";

const initialState: TCustomersInitialState = {
  customers: [],
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

const customersSlice = createSlice({
  name: "customersSlice",
  initialState,
  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
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
    setCustomerFilterClear: (state) => {
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
  setCustomers,
  setSelectedStatus,
  setSelectedProduct,
  setSelectedTimes,
  setSelectedSource,
  setSelectedDivision,
  setSelectedDistrict,
  setSelectedUpazila,
  setCustomerFilterClear,
  // setIsOrderUpdate,
  setBulkOrder,
} = customersSlice.actions;

export default customersSlice.reducer;
