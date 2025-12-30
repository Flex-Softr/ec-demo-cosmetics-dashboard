import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order.interface";
import searchParams from "@/utilities/searchParams";

const warrantyClaimReq = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWarrantyClaimRequests: builder.query({
      query: (args: Partial<TQuery>) => ({
        url: "/warranty-claim",
        params: searchParams(args),
      }),
      providesTags: ["warrantyClaimRequests"],
    }),
    updateWarrantyClamReq: builder.mutation({
      query: (orderData) => ({
        url: `/warranty-claim/update-request/${orderData.id}`,
        method: "PATCH",
        body: orderData,
      }),
      invalidatesTags: ["warrantyClaimRequests"],
    }),
    createWarrantyClamOrder: builder.mutation({
      query: (orderData) => ({
        url: `/warranty-claim/create-order/${orderData.id}`,
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["warrantyClaimRequests"],
    }),
    updateVariation: builder.mutation({
      query: (orderData) => ({
        url: `/warranty-claim/update-variation/${orderData.id}`,
        method: "PATCH",
        body: { id: undefined, ...orderData },
      }),
      invalidatesTags: ["warrantyClaimRequests"],
    }),
  }),
});

export const {
  useGetWarrantyClaimRequestsQuery,
  useUpdateWarrantyClamReqMutation,
  useCreateWarrantyClamOrderMutation,
  useUpdateVariationMutation,
} = warrantyClaimReq;
