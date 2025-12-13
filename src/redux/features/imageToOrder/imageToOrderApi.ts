import baseApi from "@/redux/baseApi/baseApi";

const imageToOrder = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getImageToOrderReq: builder.query({
      query: () => ({
        url: "/image-to-order",
      }),
      providesTags: ["imageToOrderReq"],
    }),
    getSingleImageToOrderReq: builder.query({
      query: (params) => ({
        url: `/image-to-order/${params.id}`,
      }),
      providesTags: ["imageToOrderReq"],
    }),
    updateImageToOrderReq: builder.mutation({
      query: (reqData) => ({
        url: `/image-to-order/${reqData.id}`,
        method: "PATCH",
        body: reqData,
      }),
      invalidatesTags: ["imageToOrderReq"],
    }),
    createNewOrderFromImageToOrder: builder.mutation({
      query: (reqData) => ({
        url: `/image-to-order/create-order/${reqData.id}`,
        method: "POST",
        body: reqData,
      }),
      invalidatesTags: ["imageToOrderReq"],
    }),
  }),
});

export const {
  useGetImageToOrderReqQuery,
  useGetSingleImageToOrderReqQuery,
  useUpdateImageToOrderReqMutation,
  useCreateNewOrderFromImageToOrderMutation,
} = imageToOrder;
