import baseApi from "@/redux/baseApi/baseApi";
import searchParams from "@/utilities/searchParams";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: (args) => ({
        url: "/categories",
        params: searchParams(args),
      }),
    }),
    deleteCategory: builder.mutation({
      query: (data) => ({
        url: `/categories`,
        method: "DELETE",
        body: {
          categoryIds: data,
        },
      }),
    }),
    addCategory: builder.mutation({
      query: (data) => ({
        url: `/categories`,
        method: "POST",
        body: data,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
} = categoryApi;
