import { TOrders } from "@/types/order/order.interface";
import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  search: boolean;
  searchQuery: string;
  searchedOrders: TOrders[];
};

const initialState: TInitialState = {
  search: false,
  searchQuery: "",
  searchedOrders: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchedOrders: (state, action) => {
      state.searchedOrders = action.payload;
    },
  },
});

export const { setSearch, setSearchQuery, setSearchedOrders } =
  searchSlice.actions;

export default searchSlice.reducer;
