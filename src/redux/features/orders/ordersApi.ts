import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order.interface";
import searchParams from "@/utilities/searchParams";

const updateStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["allOrders", "customerOrderHistory"],
    }),
    getSingleOrder: builder.query({
      query: (id: string) => ({
        url: `/orders/admin/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "singleOrder", id }],
    }),
    getAllOrders: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/all-orders",
        params: searchParams(args),
      }),
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
      invalidatesTags: (result, error, { _id }) => [
        { type: "singleOrder", id: _id },
        "allOrders",
        "processingOrders",
        "courierShipmentOrders",
        "monitorDeliveryOrders",
        "customerOrderHistory",
      ],
    }),
    updateOrderStatus: builder.mutation({
      query: (payload: { orderIds: string[]; status: string }) => ({
        url: `/orders/update-order-status`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { orderIds }) => [
        ...orderIds.map((id) => ({ type: "singleOrder", id }) as const),
        "allOrders",
        "processingOrders",
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
        "courierShipmentOrders",
        "monitorDeliveryOrders",
        "customerOrderHistory",
      ],
    }),
    getCustomerOrderHistory: builder.query({
      query: (phoneNumber: string) => ({
        url: `/orders/get-customer-order-count/${phoneNumber}`,
      }),
      providesTags: ["customerOrderHistory"],
    }),
    syncCourierStatus: builder.mutation({
      query: (id: string) => ({
        url: `/orders/sync-courier-status/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "singleOrder", id },
        "courierShipmentOrders",
        "monitorDeliveryOrders",
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrdersMutation,
  useGetCustomerOrderHistoryQuery,
  useSyncCourierStatusMutation,
} = updateStatusApi;
