import baseApi from "@/redux/baseApi/baseApi";

const mediaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: (files) => ({
        url: "/images",
        method: "POST",
        body: files,
      }),
      invalidatesTags: ["images"],
    }),
    getImages: builder.query({
      query: ({ page, limit, sort }) => ({
        url: `/images?page=${page}&limit=${limit}&sort=${sort}`,
      }),
      providesTags: ["images"],
    }),
    deleteImage: builder.mutation({
      query: (payload: string[]) => ({
        url: "/images",
        method: "DELETE",
        body: { imageIds: payload },
      }),
      invalidatesTags: ["images"],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useGetImagesQuery,
  useDeleteImageMutation,
} = mediaApi;
