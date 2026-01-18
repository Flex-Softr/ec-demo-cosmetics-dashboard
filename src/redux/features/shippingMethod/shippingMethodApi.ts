import baseApi from "@/redux/baseApi/baseApi";
import { TRedXDeliveryArea } from "@/types/shippingMethod";

const shippingMethodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRedXShippingArea: builder.query<{ data: TRedXDeliveryArea[] }, void>({
      query: () => ({
        url: "/shipping-methods/redx/areas",
      }),
    }),
  }),
});

export const { useGetRedXShippingAreaQuery } = shippingMethodApi;
