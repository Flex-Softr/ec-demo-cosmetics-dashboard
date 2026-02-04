import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order.interface";
import { TSuccessResponse } from "@/types/response";
import { TCourier } from "@/types/shippingMethod";
import searchParams from "@/utilities/searchParams";

const updateStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["carts", "allOrders", "customerOrderHistory"],
    }),
    getAllOrders: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/all-orders",
        params: searchParams(args),
      }),
      providesTags: ["allOrders"],
    }),
    getSingleOrder: builder.query({
      query: (id: string) => ({
        url: `/orders/admin/order-id/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "singleOrder", id }],
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
      invalidatesTags: (result, error, { _id }) => [
        { type: "singleOrder", id: _id },
        "allOrders",
        "processingOrders",
        "processingDoneAndCourierOrders",
        "monitorDelivery",
        "customerOrderHistory",
      ],
    }),
    updateOrdersStatus: builder.mutation({
      query: (payload: { orderIds: string[]; status: string }) => ({
        url: `/orders/update-status`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { orderIds }) => [
        ...orderIds.map((id) => ({ type: "singleOrder", id }) as const),
        "allOrders",
        "processingOrders",
        "processingDoneAndCourierOrders",
        "monitorDelivery",
        "customerOrderHistory",
      ],
    }),
    deleteOrders: builder.mutation({
      query: (orderIds: string[]) => ({
        url: `/orders/delete-many`,
        method: "DELETE",
        body: { orderIds },
      }),
      invalidatesTags: (result, error, orderIds) => [
        ...orderIds.map((id) => ({ type: "singleOrder", id }) as const),
        "allOrders",
        "processingOrders",
        "processingDoneAndCourierOrders",
        "monitorDelivery",
        "customerOrderHistory",
      ],
    }),
    getShippingMethodsForOrder: builder.query<
      TSuccessResponse<TCourier[]>,
      void
    >({
      query: () => ({
        url: "/orders/get-courier-for-order",
      }),
    }),
    schedulePickup: builder.mutation({
      query: (payload) => ({
        url: "/orders/admin/schedule-pickup",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { order_id }) => [
        { type: "singleOrder", id: order_id },
        "allOrders",
        "processingDoneAndCourierOrders",
        "customerOrderHistory",
      ],
    }),
    getCustomerOrderHistory: builder.query({
      query: (phoneNumber: string) => ({
        url: `/orders/get-customer-order-count/${phoneNumber}`,
      }),
      providesTags: ["customerOrderHistory"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useUpdateOrdersStatusMutation,
  useDeleteOrdersMutation,
  useGetShippingMethodsForOrderQuery,
  useSchedulePickupMutation,
  useGetCustomerOrderHistoryQuery,
} = updateStatusApi;
