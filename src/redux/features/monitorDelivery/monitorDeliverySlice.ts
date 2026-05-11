import { createSlice } from "@reduxjs/toolkit";
import { TMonitorOrdersInitialState } from "./monitorDeliveryInterface";

const initialState: TMonitorOrdersInitialState = {
  monitorDeliveryOrders: [],
  selectedStatus: "all",
  selectedCourierId: "",
  countsByCourier: [],
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
    setSelectedCourierId: (state, action) => {
      state.selectedCourierId = action.payload;
    },
    setCountsByCourier: (state, action) => {
      state.countsByCourier = action.payload;
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
  setSelectedCourierId,
  setCountsByCourier,
  setBulkOrder,
  setEditPermission,
} = monitorDeliverySlice.actions;

export default monitorDeliverySlice.reducer;
