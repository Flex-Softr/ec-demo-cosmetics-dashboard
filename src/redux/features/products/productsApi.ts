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
      invalidatesTags: ["singleProduct", "products"],
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
      providesTags: ["products"],
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
      invalidatesTags: ["products", "allCustomerProducts"],
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
  useDeleteProductsMutation,
} = productsApi;
