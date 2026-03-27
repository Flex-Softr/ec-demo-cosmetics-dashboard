import baseApi from "@/redux/baseApi/baseApi";
import { TSuccessResponse } from "@/types/response";
import { TCourier, TRedXDeliveryArea } from "@/types/shippingMethod";

const shippingMethodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShippingMethodsForOrder: builder.query<
      TSuccessResponse<TCourier[]>,
      void
    >({
      query: () => ({
        url: "/orders/get-courier-for-order",
      }),
    }),
    getRedXShippingArea: builder.query<{ data: TRedXDeliveryArea[] }, void>({
      query: () => ({
        url: "/courier-config/area/redx",
      }),
    }),
  }),
});

export const {
  useGetShippingMethodsForOrderQuery,
  useGetRedXShippingAreaQuery,
} = shippingMethodApi;
