import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order/order.interface";
import searchParams from "@/utilities/searchParams";

const allProductsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (payload) => ({
        url: `/products`,
        method: "POST",
        body: payload,
      }),
    }),
    getAProduct: builder.query({
      query: (id: string) => ({
        url: `/products/${id}/admin`,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => {
        return response?.data;
      },
      providesTags: ["singleProduct"],
    }),
    getACustomerProduct: builder.query({
      query: (id: string) => ({
        url: `/products/${id}`,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => {
        return response?.data;
      },
      providesTags: ["singleProduct"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["singleProduct", "allProducts"],
    }),
    getAllProducts: builder.query({
      query: (args: TQuery) => ({
        url: "/products/admin",
        method: "GET",
        params: searchParams(args),
      }),
      // transformResponse: (response:unknown) => {
      //   return {
      //     data: response.data,
      //     meta: response.meta,
      //   };
      // },
      providesTags: ["allProducts"],
    }),
    getCustomerProducts: builder.query({
      query: (args: TQuery) => ({
        url: "/products",
        method: "GET",
        params: searchParams(args),
      }),
      //   transformResponse: (response:any) => {
      //     return {
      //       data: response.data,
      //       meta: response.meta,
      //     };
      //   },
      providesTags: ["allCustomerProducts"],
    }),
    deleteProducts: builder.mutation({
      query: (productIds: string[]) => ({
        url: `/products/delete`,
        method: "DELETE",
        body: { productIds },
      }),
      invalidatesTags: ["allProducts", "allCustomerProducts"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAProductQuery,
  useGetACustomerProductQuery,
  useGetAllProductsQuery,
  useGetCustomerProductsQuery,
  useUpdateProductMutation,
  useDeleteProductsMutation,
} = allProductsApi;
