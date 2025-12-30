import {
  TBrand,
  TBrandPayload,
} from "@/app/dashboard/brand/lib/brand.interface";
import baseApi from "@/redux/baseApi/baseApi";
import { TSuccessResponse } from "@/types/response";

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query<
      TSuccessResponse<TBrand[]>,
      Record<string, unknown>
    >({
      query: (args) => ({
        url: "/brands",
        params: args,
      }),
      providesTags: ["brands"],
    }),
    addBrand: builder.mutation<TSuccessResponse<TBrand>, TBrandPayload>({
      query: (data) => ({
        url: `/brands`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["brands"],
    }),
    updateBrand: builder.mutation<
      TSuccessResponse<TBrand>,
      { id: string; data: TBrandPayload }
    >({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["brands"],
    }),
    deleteBrand: builder.mutation<TSuccessResponse<unknown>, string[]>({
      query: (data) => ({
        url: `/brands`,
        method: "DELETE",
        body: {
          brandIds: data,
        },
      }),
      invalidatesTags: ["brands"],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useDeleteBrandMutation,
  useAddBrandMutation,
  useUpdateBrandMutation,
} = brandApi;
