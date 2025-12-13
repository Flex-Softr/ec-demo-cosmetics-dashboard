import { createSlice } from "@reduxjs/toolkit";
import { TProcessingOrdersInitialState } from "./courierManagementInterface";

const initialState: TProcessingOrdersInitialState = {
  processingDoneOrders: [],
  selectedStatus: "processing done",
  iSOrderUpdate: false,
  singleOrder: {
    invoice: "",
    recipient_name: "",
    recipient_phone: "",
    recipient_address: "",
    cod_amount: 0,
    note: "",
  },
  bulkOrders: {
    selectedOrders: [],
    orderIds: [],
    invoices: [],
  },
};

const courierManagementSlice = createSlice({
  name: "allProducts",
  initialState,
  reducers: {
    setProcessingDoneOrders: (state, action) => {
      state.processingDoneOrders = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setIsOrderUpdate: (state, action) => {
      state.iSOrderUpdate = action.payload;
    },
    setSingleOrder: (state, action) => {
      state.singleOrder = action.payload;
    },
    setBulkOrder: (state, action) => {
      state.bulkOrders = action.payload;
    },
  },
});
export const {
  setProcessingDoneOrders,
  setSelectedStatus,
  setSingleOrder,
  setBulkOrder,
} = courierManagementSlice.actions;

export default courierManagementSlice.reducer;
