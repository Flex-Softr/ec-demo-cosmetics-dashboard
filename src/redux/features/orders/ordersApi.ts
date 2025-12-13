import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order/order.interface";
import searchParams from "@/utilities/searchParams";

const updateStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["carts", "allOrders"],
    }),
    getAllOrders: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/all-orders",
        params: searchParams(args),
      }),
      // transformResponse: (response:unknown) => {
      //   return {
      //     data: response.data,
      //     meta: response.meta,
      //   };
      // },
      providesTags: ["allOrders"],
    }),
    updateOrder: builder.mutation({
      query: ({
        payload,
        _id,
      }: {
        payload: Record<string, unknown>;
        _id: string;
      }) => ({
        url: `/orders/update-order/${_id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [
        "allOrders",
        "processingOrders",
        "processingDoneAndCourierOrders",
        "monitorDelivery",
      ],
    }),
    updateOrdersStatus: builder.mutation({
      query: (payload: { orderIds: string[]; status: string }) => ({
        url: `/orders/update-status`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: [
        "allOrders",
        "processingOrders",
        "processingDoneAndCourierOrders",
        "monitorDelivery",
      ],
    }),
    deleteOrders: builder.mutation({
      query: (orderIds: string[]) => ({
        url: `/orders/delete-many`,
        method: "DELETE",
        body: { orderIds },
      }),
      invalidatesTags: [
        "allOrders",
        "processingOrders",
        "processingDoneAndCourierOrders",
        "monitorDelivery",
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useUpdateOrdersStatusMutation,
  useDeleteOrdersMutation,
} = updateStatusApi;
