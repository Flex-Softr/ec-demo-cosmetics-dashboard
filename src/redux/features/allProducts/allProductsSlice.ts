import { createSlice } from "@reduxjs/toolkit";
import { TProductsInitialState } from "./allProductsInterface";

const initialState: TProductsInitialState = {
  products: [],
  selectedStatus: "all",
  bulkProducts: {
    productsIds: [],
  },
  search: false,
  searchQuery: "",
  searchedProducts: [],
  productDataErrors: [],
};

const allProductSlice = createSlice({
  name: "allProducts",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setBulkProduct: (state, action) => {
      state.bulkProducts = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSearchedProducts: (state, action) => {
      state.searchedProducts = action.payload;
    },
    setProductDataErrors: (state, action) => {
      state.productDataErrors = action.payload;
    },
  },
});

export const {
  setProducts,
  setSelectedStatus,
  setBulkProduct,
  setSearch,
  setSearchQuery,
  setSearchedProducts,
  setProductDataErrors,
} = allProductSlice.actions;

export default allProductSlice.reducer;
