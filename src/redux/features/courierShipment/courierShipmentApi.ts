import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order.interface";
import searchParams from "@/utilities/searchParams";

const updateStatusApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProcessingDoneAndCourierOrders: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/courier-shipment-orders",
        params: searchParams(args),
      }),
      providesTags: ["courierShipmentOrders"],
    }),
    schedulePickup: builder.mutation({
      query: (payload) => ({
        url: "/orders/admin/schedule-pickup",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { order_id }) => [
        { type: "singleOrder", id: order_id },
        "processingOrders",
        "courierShipmentOrders",
        "monitorDeliveryOrders",
        "customerOrderHistory",
      ],
    }),
    bulkSchedulePickup: builder.mutation({
      query: (payload) => ({
        url: "/orders/admin/bulk-schedule-pickup",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { order_ids }) => [
        ...(order_ids || []).map(
          (id: string) => ({ type: "singleOrder", id }) as const
        ),
        "processingOrders",
        "courierShipmentOrders",
        "monitorDeliveryOrders",
        "customerOrderHistory",
      ],
    }),
  }),
});

export const {
  useGetProcessingDoneAndCourierOrdersQuery,
  useSchedulePickupMutation,
  useBulkSchedulePickupMutation,
} = updateStatusApi;
