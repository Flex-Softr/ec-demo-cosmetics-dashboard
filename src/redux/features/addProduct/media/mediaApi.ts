import baseApi from "@/redux/baseApi/baseApi";

const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSingleImage: builder.query({
      query: (id) => ({
        url: `/images/${id}`,
      }),
    }),
  }),
});

export const { useGetSingleImageQuery } = mediaApi;
