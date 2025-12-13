import { createSlice } from "@reduxjs/toolkit";
import { TOrdersInitialState } from "./ordersInterface";

const initialState: TOrdersInitialState = {
  orders: [],
  selectedStatus: "all",
  startFrom: "",
  endAt: "",
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

const ordersSlice = createSlice({
  name: "allOrders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setDate: (state, action) => {
      const { startFrom, endAt } = action.payload;
      state.startFrom = startFrom;
      state.endAt = endAt;
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
  setOrders,
  setSelectedStatus,
  setDate,
  setIsOrderUpdate,
  setSingleOrder,
  setBulkOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;
