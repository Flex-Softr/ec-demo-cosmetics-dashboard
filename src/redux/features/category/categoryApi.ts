import baseApi from "@/redux/baseApi/baseApi";
import searchParams from "@/utilities/searchParams";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: `/categories`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories", "singleCategory"],
    }),
    getCategories: builder.query({
      query: (args) => ({
        url: "/categories",
        params: searchParams(args),
      }),
      providesTags: ["categories"],
    }),
    getSingleCategory: builder.query({
      query: (id) => ({
        url: `/categories/${id}`,
      }),
      providesTags: ["singleCategory"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["categories", "singleCategory"],
    }),
    deleteCategory: builder.mutation({
      query: (data) => ({
        url: `/categories`,
        method: "DELETE",
        body: {
          categoryIds: data,
        },
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useGetSingleCategoryQuery,
} = categoryApi;
