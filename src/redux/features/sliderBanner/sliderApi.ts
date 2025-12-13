import baseApi from "@/redux/baseApi/baseApi";

const sliderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteSlider: builder.mutation({
      query: (data) => ({
        url: `/slider-banner`,
        method: "DELETE",
        body: {
          sliderSectionIds: [data],
        },
      }),
    }),
    addSlider: builder.mutation({
      query: (data) => ({
        url: `/slider-banner`,
        method: "POST",
        body: data,
      }),
    }),
    updateSlider: builder.mutation({
      query: ({ isActive, id }) => ({
        url: `/slider-banner/${id}`,
        method: "PATCH",
        body: {
          isActive: isActive,
        },
      }),
    }),
  }),
});

export const {
  useDeleteSliderMutation,
  useAddSliderMutation,
  useUpdateSliderMutation,
} = sliderApi;
