"use client";
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import baseApi from "./baseApi/baseApi";
import courierBaseApi from "./baseApi/courierBaseApi";
import addProductReducer from "./features/addProduct/addProductSlice";
import variationReducer from "./features/addProduct/variation/variationSlice";
import authReducer from "./features/auth/authSlice";
import couponSlice from "./features/coupon/couponSlice";
import courierConfigurationReducer from "./features/courierConfiguration/courierConfigurationSlice";
import courierShipmentReducer from "./features/courierShipment/courierShipmentSlice";
import customerOrdersSlice from "./features/customerOrders/customerOrdersSlice";
import imageSelectorReducer from "./features/imageSelector/imageSelectorSlice";
import imageToOrderReqSlice from "./features/imageToOrder/imageToOrderSlice";
import monitorDeliveryReducer from "./features/monitorDelivery/monitorDeliverySlice";
import ordersReducer from "./features/orders/ordersSlice";
import paginationReducer from "./features/pagination/PaginationSlice";
import paymentMethodReducer from "./features/paymentMethod/paymentMethodSlice";
import processingOrdersReducer from "./features/processingOrders/processingOrdersSlice";
import productsReducer from "./features/products/productsSlice";
import registeredCustomer from "./features/registeredCustomer/RegisteredCustomerSlice";
import searchReducer from "./features/search/searchSlice";
import shippingChargesSlice from "./features/shippingCharge/ShippingChargeSlice";
import userSlice from "./features/user/userSlice";
import warrantyClaimSlice from "./features/warrantyClaimRequests/warrantyClaimSlice";
import storage from "./storage";

const persistConfig = {
  key: "auth",
  storage,
};
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const createStore = () => {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      [courierBaseApi.reducerPath]: courierBaseApi.reducer,
      auth: persistedAuthReducer,
      addProduct: addProductReducer,
      productVariation: variationReducer,
      products: productsReducer,
      imageSelector: imageSelectorReducer,
      orders: ordersReducer,
      processingOrders: processingOrdersReducer,
      courierShipment: courierShipmentReducer,
      monitorDelivery: monitorDeliveryReducer,
      search: searchReducer,
      pagination: paginationReducer,
      warrantyClaim: warrantyClaimSlice,
      users: userSlice,
      customerOrders: customerOrdersSlice,
      allCoupons: couponSlice,
      shippingCharges: shippingChargesSlice,
      imageToOrder: imageToOrderReqSlice,
      registeredCustomer: registeredCustomer,
      courierConfiguration: courierConfigurationReducer,
      paymentMethod: paymentMethodReducer,
    },
    middleware: (getDefaultMiddlewares) =>
      getDefaultMiddlewares({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApi.middleware, courierBaseApi.middleware),
  });
};

export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

persistStore(store);

export default store;
