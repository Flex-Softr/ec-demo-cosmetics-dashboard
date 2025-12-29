import baseApi from "@/redux/baseApi/baseApi";

const subcategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: (params) => ({
        url: "/sub-categories",
        params,
      }),
      providesTags: ["subcategories"],
    }),
    addSubCategory: builder.mutation({
      query: (data) => ({
        url: `/sub-categories/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["subcategories", "categories"],
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sub-categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["subcategories", "categories"],
    }),
    deleteSubCategory: builder.mutation({
      query: (data) => ({
        url: `/sub-categories`,
        method: "DELETE",
        body: {
          subCategoryIds: data,
        },
      }),
      invalidatesTags: ["subcategories", "categories"],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useAddSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryMutation,
} = subcategoryApi;
