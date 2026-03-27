import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order.interface";
import searchParams from "@/utilities/searchParams";

const monitorDeliveryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMonitorDeliveryOrders: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/admin/monitor-delivery-orders",
        params: searchParams(args),
      }),
      providesTags: ["monitorDeliveryOrders"],
    }),
    updateMonitorDeliveryStatus: builder.mutation({
      query: (payload: { orderIds: string[]; status: string }) => ({
        url: "/orders/update-monitor-delivery-status",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { orderIds }) => [
        ...(orderIds || []).map(
          (id: string) => ({ type: "singleOrder", id }) as const
        ),
        "courierShipmentOrders",
        "monitorDeliveryOrders",
        "completedOrders",
        "customerOrderHistory",
      ],
    }),
  }),
});

export const {
  useGetMonitorDeliveryOrdersQuery,
  useUpdateMonitorDeliveryStatusMutation,
} = monitorDeliveryApi;
