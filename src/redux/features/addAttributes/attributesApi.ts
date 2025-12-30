import { TAttribute } from "@/app/dashboard/attribute/lib/attribute.interface";
import baseApi from "@/redux/baseApi/baseApi";
import { TSuccessResponse } from "@/types/response";

const attributesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttributes: builder.query<
      TSuccessResponse<TAttribute[]>,
      Record<string, unknown>
    >({
      query: (args) => ({
        url: "/attributes",
        params: args,
      }),
      providesTags: ["attributes"],
    }),
    addAttribute: builder.mutation({
      query: (data) => ({
        url: `/attributes`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["attributes"],
    }),
    updateAttribute: builder.mutation({
      query: (data) => ({
        url: `/attributes/${data?.id}`,
        method: "PATCH",
        body: data?.data,
      }),
      invalidatesTags: ["attributes"],
    }),
    deleteAttribute: builder.mutation({
      query: ({
        attributeIds,
        valueIds,
      }: {
        attributeIds?: string[];
        valueIds?: string[];
      }) => ({
        url: `/attributes`,
        method: "DELETE",
        body: {
          attributeIds,
          valueIds,
        },
      }),
      invalidatesTags: ["attributes"],
    }),
  }),
});

export const {
  useGetAttributesQuery,
  useAddAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} = attributesApi;
