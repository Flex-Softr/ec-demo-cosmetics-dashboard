import baseApi from "@/redux/baseApi/baseApi";
import {
  TBlogQACategory,
  TBlogQACategoryPayload,
  TBlogQATag,
  TBlogQATagPayload,
  TBlogQATopic,
  TBlogPost,
  TBlogPostPayload,
  TQnA,
  TQnAPayload,
} from "@/types/blog-qna";
import { TListResponse, TSuccessResponse } from "@/types/response";
import searchParams from "@/utilities/searchParams";

type TQuery = Record<string, unknown>;
type TMutationArgs<T> = { id: string; data: Partial<T> };

const blogQnaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogPosts: builder.query<TListResponse<TBlogPost>, TQuery>({
      query: (args) => ({
        url: "/blog-posts",
        params: searchParams(args),
      }),
      providesTags: ["blogPosts"],
    }),
    getBlogPost: builder.query<TSuccessResponse<TBlogPost>, string>({
      query: (id) => ({ url: `/blog-posts/${id}` }),
      providesTags: (result, error, id) => [{ type: "blogPosts", id }],
    }),
    createBlogPost: builder.mutation<
      TSuccessResponse<TBlogPost>,
      TBlogPostPayload
    >({
      query: (data) => ({
        url: "/blog-posts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogPosts"],
    }),
    updateBlogPost: builder.mutation<
      TSuccessResponse<TBlogPost>,
      TMutationArgs<TBlogPostPayload>
    >({
      query: ({ id, data }) => ({
        url: `/blog-posts/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blogPosts"],
    }),
    deleteBlogPost: builder.mutation<TSuccessResponse, string>({
      query: (id) => ({
        url: `/blog-posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogPosts"],
    }),

    getQnAList: builder.query<TListResponse<TQnA>, TQuery>({
      query: (args) => ({
        url: "/qna",
        params: searchParams(args),
      }),
      providesTags: ["qna"],
    }),
    getQnA: builder.query<TSuccessResponse<TQnA>, string>({
      query: (id) => ({ url: `/qna/${id}` }),
      providesTags: (result, error, id) => [{ type: "qna", id }],
    }),
    createQnA: builder.mutation<TSuccessResponse<TQnA>, TQnAPayload>({
      query: (data) => ({
        url: "/qna",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["qna"],
    }),
    updateQnA: builder.mutation<
      TSuccessResponse<TQnA>,
      TMutationArgs<TQnAPayload>
    >({
      query: ({ id, data }) => ({
        url: `/qna/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["qna"],
    }),
    deleteQnA: builder.mutation<TSuccessResponse, string>({
      query: (id) => ({
        url: `/qna/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["qna"],
    }),

    getBlogQaCategories: builder.query<TListResponse<TBlogQACategory>, TQuery>({
      query: (args) => ({
        url: "/blog-qa-categories",
        params: searchParams(args),
      }),
      providesTags: ["blogQaCategories"],
    }),
    createBlogQaCategory: builder.mutation<
      TSuccessResponse<TBlogQACategory>,
      TBlogQACategoryPayload
    >({
      query: (data) => ({
        url: "/blog-qa-categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogQaCategories"],
    }),
    updateBlogQaCategory: builder.mutation<
      TSuccessResponse<TBlogQACategory>,
      TMutationArgs<TBlogQACategoryPayload>
    >({
      query: ({ id, data }) => ({
        url: `/blog-qa-categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blogQaCategories"],
    }),
    deleteBlogQaCategory: builder.mutation<TSuccessResponse, string>({
      query: (id) => ({
        url: `/blog-qa-categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogQaCategories"],
    }),

    getBlogQaTags: builder.query<TListResponse<TBlogQATag>, TQuery>({
      query: (args) => ({
        url: "/blog-qa-tags",
        params: searchParams(args),
      }),
      providesTags: ["blogQaTags"],
    }),
    createBlogQaTag: builder.mutation<
      TSuccessResponse<TBlogQATag>,
      TBlogQATagPayload
    >({
      query: (data) => ({
        url: "/blog-qa-tags",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogQaTags"],
    }),
    updateBlogQaTag: builder.mutation<
      TSuccessResponse<TBlogQATag>,
      TMutationArgs<TBlogQATagPayload>
    >({
      query: ({ id, data }) => ({
        url: `/blog-qa-tags/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blogQaTags"],
    }),
    deleteBlogQaTag: builder.mutation<TSuccessResponse, string>({
      query: (id) => ({
        url: `/blog-qa-tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogQaTags"],
    }),
    // Topics
    getBlogQaTopics: builder.query<TListResponse<TBlogQATopic>, TQuery>({
      query: (args) => ({
        url: "/blog-qa-topics",
        params: searchParams(args),
      }),
      providesTags: ["blogQaTopics"],
    }),
    createBlogQaTopic: builder.mutation<
      TSuccessResponse<TBlogQATopic>,
      Partial<TBlogQATopic>
    >({
      query: (data) => ({
        url: "/blog-qa-topics",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogQaTopics"],
    }),
    updateBlogQaTopic: builder.mutation<
      TSuccessResponse<TBlogQATopic>,
      TMutationArgs<Partial<TBlogQATopic>>
    >({
      query: ({ id, data }) => ({
        url: `/blog-qa-topics/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blogQaTopics"],
    }),
    deleteBlogQaTopic: builder.mutation<TSuccessResponse, string>({
      query: (id) => ({
        url: `/blog-qa-topics/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogQaTopics"],
    }),
  }),
});

export const {
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useCreateBlogPostMutation,
  useUpdateBlogPostMutation,
  useDeleteBlogPostMutation,
  useGetQnAListQuery,
  useGetQnAQuery,
  useCreateQnAMutation,
  useUpdateQnAMutation,
  useDeleteQnAMutation,
  useGetBlogQaCategoriesQuery,
  useCreateBlogQaCategoryMutation,
  useUpdateBlogQaCategoryMutation,
  useDeleteBlogQaCategoryMutation,
  useGetBlogQaTagsQuery,
  useCreateBlogQaTagMutation,
  useUpdateBlogQaTagMutation,
  useDeleteBlogQaTagMutation,
  useGetBlogQaTopicsQuery,
  useCreateBlogQaTopicMutation,
  useUpdateBlogQaTopicMutation,
  useDeleteBlogQaTopicMutation,
} = blogQnaApi;
