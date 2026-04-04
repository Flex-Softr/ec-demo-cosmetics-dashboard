import { createSlice } from "@reduxjs/toolkit";
import { TProductsInitialState } from "./productsInterface";

const initialState: TProductsInitialState = {
  products: [],
  countsByStatus: [],
  selectedStatus: "all",
  bulkProducts: {
    productIds: [],
    productSlugs: [],
  },
  search: false,
  searchQuery: "",
  searchedProducts: [],
  productDataErrors: [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCountsByStatus: (state, action) => {
      state.countsByStatus = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    setBulkProduct: (state, action) => {
      state.bulkProducts.productIds = action.payload;
    },
    setBulkProductSlugs: (state, action) => {
      state.bulkProducts.productSlugs = action.payload;
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
  setCountsByStatus,
  setSelectedStatus,
  setBulkProduct,
  setBulkProductSlugs,
  setSearch,
  setSearchQuery,
  setSearchedProducts,
  setProductDataErrors,
} = productsSlice.actions;

export default productsSlice.reducer;
