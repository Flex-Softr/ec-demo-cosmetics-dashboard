import baseApi from "@/redux/baseApi/baseApi";
import { TRedXDeliveryArea } from "@/types/shippingMethod";

const shippingMethodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRedXShippingArea: builder.query<{ data: TRedXDeliveryArea[] }, void>({
      query: () => ({
        url: "/courier-config/area/redx",
      }),
    }),
  }),
});

export const { useGetRedXShippingAreaQuery } = shippingMethodApi;
