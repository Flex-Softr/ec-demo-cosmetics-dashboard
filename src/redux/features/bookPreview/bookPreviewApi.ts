import baseApi from "../../baseApi/baseApi";

const bookPreviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookPreviewPresignedUrl: builder.mutation({
      query: (payload: {
        filename: string;
        contentType: string;
        previewType?: string;
        bookId?: string;
      }) => ({
        url: "/book-previews/presigned-url",
        method: "POST",
        body: payload,
      }),
    }),
    uploadBookPreview: builder.mutation({
      query: (payload: {
        previews: { src: string; alt: string; previewType?: string }[];
      }) => ({
        url: "/book-previews",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["bookPreviews"],
    }),
    getBookPreviews: builder.query({
      query: ({
        page,
        limit,
        sort,
        search,
        previewType,
      }: {
        page: number;
        limit: number;
        sort: string;
        search?: string;
        previewType?: string;
      }) => ({
        url: `/book-previews?page=${page}&limit=${limit}&sort=${sort}${
          search ? `&searchTerm=${search}` : ""
        }${previewType ? `&previewType=${previewType}` : ""}`,
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
  useGetBookPreviewPresignedUrlMutation,
  useUploadBookPreviewMutation,
  useGetBookPreviewsQuery,
  useDeleteBookPreviewMutation,
} = bookPreviewApi;

export default bookPreviewApi;
