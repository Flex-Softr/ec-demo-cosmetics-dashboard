import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order.interface";
import searchParams from "@/utilities/searchParams";

const customerOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomerOrders: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/completed-returned",
        params: searchParams(args),
      }),
      providesTags: ["customers"],
    }),
  }),
});

export const { useGetCustomerOrdersQuery } = customerOrdersApi;
