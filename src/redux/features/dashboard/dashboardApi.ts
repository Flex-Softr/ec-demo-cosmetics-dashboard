import baseApi from "@/redux/baseApi/baseApi";
import { TSuccessResponse } from "@/types/response";
import {
  TDashboardSummary,
  TOrderReportFilter,
  TOrderReportItem,
  TOrderStatusCount,
  TOrdersSummary,
  TRecentOrder,
  TTopCustomer,
} from "./dashboardInterface";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query<
      TSuccessResponse<TDashboardSummary>,
      void
    >({
      query: () => ({
        url: "/dashboard/stats",
      }),
    }),
    getOrderStatusCount: builder.query<
      TSuccessResponse<TOrderStatusCount[]>,
      void
    >({
      query: () => ({
        url: "/dashboard/order-status",
      }),
    }),
    getShippingStatusCount: builder.query<
      TSuccessResponse<TOrderStatusCount[]>,
      void
    >({
      query: () => ({
        url: "/dashboard/shipping-status",
      }),
    }),
    getOrdersSummary: builder.query<TSuccessResponse<TOrdersSummary>, void>({
      query: () => ({
        url: "/dashboard/orders-summary",
      }),
    }),
    getOrderReport: builder.query<
      TSuccessResponse<TOrderReportItem[]>,
      TOrderReportFilter
    >({
      query: (filter) => ({
        url: `/dashboard/order-report?filter=${filter}`,
      }),
    }),
    getTopCustomers: builder.query<TSuccessResponse<TTopCustomer[]>, void>({
      query: () => ({
        url: "/dashboard/top-customers",
      }),
    }),
    getRecentOrders: builder.query<TSuccessResponse<TRecentOrder[]>, void>({
      query: () => ({
        url: "/dashboard/recent-orders",
      }),
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetOrderStatusCountQuery,
  useGetShippingStatusCountQuery,
  useGetOrdersSummaryQuery,
  useGetOrderReportQuery,
  useGetTopCustomersQuery,
  useGetRecentOrdersQuery,
} = dashboardApi;
