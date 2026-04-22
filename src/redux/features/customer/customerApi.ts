import baseApi from "@/redux/baseApi/baseApi";
import searchParams from "@/utilities/searchParams";

const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: (args) => ({
        url: "/customers",
        params: searchParams(args),
      }),
      providesTags: ["customers"],
    }),
    getSingleCustomer: builder.query({
      query: (id: string) => ({
        url: `/customers/${id}`,
      }),
      providesTags: ["customers"],
    }),
  }),
});

export const {
  useGetAllCustomersQuery,
  useLazyGetAllCustomersQuery,
  useGetSingleCustomerQuery,
} = customerApi;
