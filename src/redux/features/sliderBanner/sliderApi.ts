import baseApi from "@/redux/baseApi/baseApi";

const sliderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSliders: builder.query({
      query: () => ({
        url: `/slider-banner/`,
        method: "GET",
      }),
      providesTags: ["slider"],
    }),
    deleteSlider: builder.mutation({
      query: (data) => ({
        url: `/slider-banner`,
        method: "DELETE",
        body: {
          sliderSectionIds: [data],
        },
      }),
      invalidatesTags: ["slider"],
    }),
    addSlider: builder.mutation({
      query: (data) => ({
        url: `/slider-banner`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["slider"],
    }),
    updateSlider: builder.mutation({
      query: ({ id, data }) => ({
        url: `/slider-banner/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["slider"],
    }),
  }),
});

export const {
  useDeleteSliderMutation,
  useAddSliderMutation,
  useUpdateSliderMutation,
  useGetSlidersQuery,
} = sliderApi;
