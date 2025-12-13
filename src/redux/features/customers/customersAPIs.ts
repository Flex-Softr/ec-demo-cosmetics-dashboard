import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order/order.interface";
import searchParams from "@/utilities/searchParams";

const customersAPIs = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/completed-returned",
        params: searchParams(args),
      }),
      providesTags: ["customers"],
    }),
  }),
});

export const { useGetCustomersQuery } = customersAPIs;
