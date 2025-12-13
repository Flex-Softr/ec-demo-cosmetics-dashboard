import baseApi from "@/redux/baseApi/baseApi";

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBrand: builder.mutation({
      query: (data) => ({
        url: `/brands`,
        method: "POST",
        body: data,
      }),
    }),
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteBrand: builder.mutation({
      query: (data) => ({
        url: `/brands`,
        method: "DELETE",
        body: {
          brandIds: data,
        },
      }),
    }),
  }),
});

export const {
  useDeleteBrandMutation,
  useAddBrandMutation,
  useUpdateBrandMutation,
} = brandApi;
