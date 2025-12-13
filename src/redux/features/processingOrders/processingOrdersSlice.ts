import { createSlice } from "@reduxjs/toolkit";
import { TProcessingOrdersInitialState } from "./processingOrdersInterface";

const initialState: TProcessingOrdersInitialState = {
  processingOrders: [],
  selectedStatus: "processing",
  iSOrderUpdate: false,
  bulkOrders: {
    orderIds: [],
    invoices: [],
  },
};

const processingOrdersSlice = createSlice({
  name: "processingOrderSlice",
  initialState,
  reducers: {
    setProcessingOrders: (state, action) => {
      state.processingOrders = action.payload;
    },
    setSelectedStatus: (state, action) => {
      // state.search = false
      // state.searchQuery = "";
      // state.searchedOrders = [];
      state.selectedStatus = action.payload;
    },
    setIsOrderUpdate: (state, action) => {
      state.iSOrderUpdate = action.payload;
    },
    setBulkOrder: (state, action) => {
      state.bulkOrders = action.payload;
    },
  },
});
export const {
  setProcessingOrders,
  setSelectedStatus,
  // setIsOrderUpdate,
  setBulkOrder,
} = processingOrdersSlice.actions;

export default processingOrdersSlice.reducer;
