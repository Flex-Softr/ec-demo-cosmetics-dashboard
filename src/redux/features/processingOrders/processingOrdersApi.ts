import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order/order.interface";
import searchParams from "@/utilities/searchParams";

const processingOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProcessingOrders: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/processing-orders",
        params: searchParams(args),
      }),
      providesTags: ["processingOrders"],
    }),
    updateProcessingOrderStatus: builder.mutation({
      query: (payload: { orderIds: string[]; status: string }) => ({
        url: `/orders/update-processing-status`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["processingOrders"],
    }),
  }),
});

export const {
  useGetProcessingOrdersQuery,
  useUpdateProcessingOrderStatusMutation,
} = processingOrdersApi;
