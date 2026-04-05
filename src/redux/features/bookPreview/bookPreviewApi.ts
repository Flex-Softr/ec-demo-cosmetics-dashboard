import baseApi from "../../baseApi/baseApi";
import searchParams from "@/utilities/searchParams";

const bookPreviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadBookPreview: builder.mutation({
      query: (data) => ({
        url: "/book-previews",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["bookPreviews"],
    }),
    getBookPreviews: builder.query({
      query: (args) => ({
        url: "/book-previews",
        method: "GET",
        params: searchParams(args),
      }),
      providesTags: ["bookPreviews"],
    }),
    deleteBookPreview: builder.mutation({
      query: (previewIds) => ({
        url: `/book-previews`,
        method: "DELETE",
        body: { previewIds },
      }),
      invalidatesTags: ["bookPreviews"],
    }),
  }),
});

export const {
  useUploadBookPreviewMutation,
  useGetBookPreviewsQuery,
  useDeleteBookPreviewMutation,
} = bookPreviewApi;

export default bookPreviewApi;
