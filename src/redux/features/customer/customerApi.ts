import baseApi from "@/redux/baseApi/baseApi";
import searchParams from "@/utilities/searchParams";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: (args) => ({
        url: "/customers",
        params: searchParams(args),
      }),
      providesTags: ["customers"],
    }),
  }),
});

export const { useGetAllCustomersQuery, useLazyGetAllCustomersQuery } =
  couponApi;
