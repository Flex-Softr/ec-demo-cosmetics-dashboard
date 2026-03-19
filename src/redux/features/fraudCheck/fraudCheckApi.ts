import baseApi from "@/redux/baseApi/baseApi";

export const fraudCheckApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFraudCheck: builder.query({
      query: (phoneNumber: string) => ({
        url: `/check/fraud-customers/${phoneNumber}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetFraudCheckQuery, useLazyGetFraudCheckQuery } =
  fraudCheckApi;
