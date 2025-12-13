import baseApi from "@/redux/baseApi/baseApi";

const variationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteVariation: builder.mutation({
      query: (id: string) => ({
        url: `/variations/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteVariationMutation } = variationsApi;
