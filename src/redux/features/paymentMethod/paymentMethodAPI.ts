import baseApi from "@/redux/baseApi/baseApi";

const paymentMethodAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethod: builder.query({
      query: () => ({
        url: "/payment-method",
        method: "GET",
      }),
      // transformResponse: (response:unknown) => {
      //   return {
      //     data: response.data,
      //     meta: response.meta,
      //   };
      // },
      providesTags: ["paymentMethod"],
    }),
  }),
});

export const { useGetPaymentMethodQuery } = paymentMethodAPI;
