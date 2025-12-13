import baseApi from "@/redux/baseApi/baseApi";

const subcategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSubCategory: builder.mutation({
      query: (data) => ({
        url: `/sub-categories/`,
        method: "POST",
        body: data,
      }),
    }),
    updateSubCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/sub-categories/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteSubCategory: builder.mutation({
      query: (data) => ({
        url: `/sub-categories`,
        method: "DELETE",
        body: {
          subCategoryIds: data,
        },
      }),
    }),
  }),
});

export const {
  useAddSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useUpdateSubCategoryMutation,
} = subcategoryApi;
