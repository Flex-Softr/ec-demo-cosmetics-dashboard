import baseApi from "@/redux/baseApi/baseApi";
import searchParams from "@/utilities/searchParams";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: (args) => ({
        url: "/coupons",
        params: searchParams(args),
      }),
      providesTags: ["coupons"],
    }),
    getAllCouponTags: builder.query({
      query: (args) => ({
        url: "/coupons/tags",
        params: searchParams(args),
      }),
      providesTags: ["coupons"],
    }),
    createCoupon: builder.mutation({
      query: (body) => ({
        url: `/coupons`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["coupons"],
    }),
    updateCoupons: builder.mutation({
      query: (body) => ({
        url: `/coupons/${body.id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["coupons"],
    }),
  }),
});

export const {
  useCreateCouponMutation,
  useGetAllCouponTagsQuery,
  useGetAllCouponsQuery,
  useUpdateCouponsMutation,
} = couponApi;
