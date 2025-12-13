import baseApi from "@/redux/baseApi/baseApi";
import searchParams from "@/utilities/searchParams";

const registeredUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRegisteredCustomers: builder.query({
      query: (args) => ({
        url: "/customers",
        params: searchParams(args),
      }),
      providesTags: ["registeredCustomers"],
    }),
    updateCustomer: builder.mutation({
      query: (userInfo) => ({
        url: `/customers/admin/${userInfo.id}`,
        method: "PATCH",
        body: userInfo.body,
      }),
      invalidatesTags: ["registeredCustomers"],
    }),
  }),
});

export const { useGetRegisteredCustomersQuery, useUpdateCustomerMutation } =
  registeredUserApi;
