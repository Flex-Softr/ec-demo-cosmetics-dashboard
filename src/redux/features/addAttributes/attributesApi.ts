import baseApi from "@/redux/baseApi/baseApi";

const attributesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addAttribute: builder.mutation({
      query: (data) => ({
        url: `/attributes`,
        method: "POST",
        body: data,
      }),
    }),
    updateAttribute: builder.mutation({
      query: (data) => ({
        url: `/attributes/${data?.attributeId}`,
        method: "PATCH",
        body: { values: data?.values },
      }),
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
    }),
  }),
});

export const {
  useAddAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} = attributesApi;
