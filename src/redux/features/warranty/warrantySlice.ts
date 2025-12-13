import baseApi from "@/redux/baseApi/baseApi";

const WarrantySlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    AddWarrantyCode: builder.mutation({
      query: (payload) => ({
        url: `/warranty`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["processingOrders"],
    }),
    updateWarrantyCode: builder.mutation({
      query: (payload) => ({
        url: `/warranty`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["processingOrders", "monitorDelivery"],
    }),
  }),
});

export const { useAddWarrantyCodeMutation, useUpdateWarrantyCodeMutation } =
  WarrantySlice;
