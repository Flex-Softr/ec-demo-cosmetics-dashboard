import baseApi from "@/redux/baseApi/baseApi";

const shippingChargeAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createShippingCharge: builder.mutation({
      query: (body) => ({
        url: "/shipping-charges",
        method: "POST",
        body,
      }),
      invalidatesTags: ["shippingCharge"],
    }),
    getShippingCharge: builder.query({
      query: () => ({
        url: "/shipping-charges",
        method: "GET",
      }),
      providesTags: ["shippingCharge"],
    }),
    getShippingChargeAdmin: builder.query({
      query: () => ({
        url: "/shipping-charges/admin",
        method: "GET",
      }),
      providesTags: ["shippingCharge"],
    }),
    updateShippingCharge: builder.mutation({
      query: (body) => ({
        url: `/shipping-charges/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["shippingCharge"],
    }),
  }),
});

export const {
  useGetShippingChargeQuery,
  useCreateShippingChargeMutation,
  useGetShippingChargeAdminQuery,
  useUpdateShippingChargeMutation,
} = shippingChargeAPI;
