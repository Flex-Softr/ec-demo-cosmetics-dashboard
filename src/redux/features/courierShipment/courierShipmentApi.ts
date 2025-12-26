import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order/order.interface";
import searchParams from "@/utilities/searchParams";

const updateStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProcessingDoneAndCourierOrders: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/processing-done-on-courier-orders",
        params: searchParams(args),
      }),
      providesTags: ["processingDoneAndCourierOrders"],
    }),
    sendCourierAndUpdateStatus: builder.mutation({
      query: (payload: { orderIds: string[]; status: string }) => ({
        url: `/orders/book-courier-and-update-status`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["processingDoneAndCourierOrders"],
    }),
  }),
});

export const {
  useGetProcessingDoneAndCourierOrdersQuery,
  useSendCourierAndUpdateStatusMutation,
} = updateStatusApi;
