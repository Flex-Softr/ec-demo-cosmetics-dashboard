import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order.interface";
import { IAdminProductResponse, TProductPayload } from "@/types/products";
import searchParams from "@/utilities/searchParams";

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (payload: TProductPayload) => ({
        url: `/products`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["productList", "publicProductList"],
    }),
    getAProduct: builder.query({
      query: (id: string) => ({
        url: `/products/admin/${id}`,
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
      query: ({
        id,
        payload,
      }: {
        id: string;
        payload: Partial<TProductPayload>;
      }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["singleProduct", "productList", "publicProductList"],
    }),
    updateProductStatus: builder.mutation({
      query: (payload: { productIds: string[]; publishedStatus: string }) => ({
        url: `/products/update-status`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["singleProduct", "productList", "publicProductList"],
    }),
    getProducts: builder.query<IAdminProductResponse, TQuery>({
      query: (args: TQuery) => ({
        url: "/products/admin",
        method: "GET",
        params: searchParams(args),
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: IAdminProductResponse) => {
        return response;
      },
      providesTags: ["productList"],
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
      providesTags: ["publicProductList"],
    }),
    deleteProducts: builder.mutation({
      query: (productIds: string[]) => ({
        url: `/products/delete`,
        method: "DELETE",
        body: { productIds },
      }),
      invalidatesTags: ["productList", "publicProductList", "singleProduct"],
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAProductQuery,
  useGetACustomerProductQuery,
  useGetProductsQuery,
  useGetCustomerProductsQuery,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useDeleteProductsMutation,
} = productsApi;
