import { createSlice } from "@reduxjs/toolkit";
import { TMonitorOrdersInitialState } from "./monitorDeliveryInterface";

const initialState: TMonitorOrdersInitialState = {
  monitorDeliveryOrders: [],
  selectedStatus: "all",
  iSOrderUpdate: false,
  bulkOrders: {
    selectedOrders: [],
    orderIds: [],
    invoices: [],
  },
  editPermission: false,
};

const monitorDeliverySlice = createSlice({
  name: "monitorDelivery",
  initialState,
  reducers: {
    setMonitorDeliveryOrders: (state, action) => {
      state.monitorDeliveryOrders = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setIsOrderUpdate: (state, action) => {
      state.iSOrderUpdate = action.payload;
    },
    setBulkOrder: (state, action) => {
      state.bulkOrders = action.payload;
    },
    setEditPermission: (state, action) => {
      state.editPermission = action.payload;
    },
  },
});

export const {
  setMonitorDeliveryOrders,
  setSelectedStatus,
  setBulkOrder,
  setEditPermission,
} = monitorDeliverySlice.actions;

export default monitorDeliverySlice.reducer;
