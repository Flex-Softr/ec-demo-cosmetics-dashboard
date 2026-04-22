import baseApi from "../../baseApi/baseApi";

const contactMessageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactMessages: builder.query({
      query: (query) => ({
        url: "/contact-messages",
        method: "GET",
        params: query,
      }),
      providesTags: ["contactMessages"],
    }),
    getUnreadContactMessagesCount: builder.query({
      query: () => ({
        url: "/contact-messages/unread-count",
        method: "GET",
      }),
      providesTags: ["contactMessages"],
    }),
    getSingleContactMessage: builder.query({
      query: (id) => ({
        url: `/contact-messages/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "contactMessages", id }],
    }),
    deleteContactMessage: builder.mutation({
      query: (id) => ({
        url: `/contact-messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["contactMessages"],
    }),
    updateContactMessage: builder.mutation({
      query: (id) => ({
        url: `/contact-messages/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["contactMessages"],
    }),
  }),
});

export const {
  useGetContactMessagesQuery,
  useGetUnreadContactMessagesCountQuery,
  useGetSingleContactMessageQuery,
  useDeleteContactMessageMutation,
  useUpdateContactMessageMutation,
} = contactMessageApi;
