import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order.interface";
import searchParams from "@/utilities/searchParams";

const completedOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCompletedOrders: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/completed-orders",
        params: searchParams(args),
      }),
      providesTags: ["completedOrders"],
    }),
  }),
});

export const { useGetCompletedOrdersQuery } = completedOrdersApi;
