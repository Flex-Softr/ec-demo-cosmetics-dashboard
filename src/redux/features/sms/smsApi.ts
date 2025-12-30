import baseApi from "@/redux/baseApi/baseApi";
import { TQuery } from "@/types/order.interface";
import searchParams from "@/utilities/searchParams";

const smsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrderSMS: builder.mutation({
      query: (payload: { notificationData: Record<string, unknown>[] }) => ({
        url: "/order-sms-notification",
        method: "POST",
        body: payload,
      }),
    }),
    updateOrderSMS: builder.mutation({
      query: ({
        payload,
        _id,
      }: {
        payload: Record<string, unknown>;
        _id: string;
      }) => ({
        url: `/order-sms-notification/${_id}`,
        method: "PATCH",
        body: payload,
      }),
    }),
    getMobilesForSMS: builder.query({
      query: (args: TQuery) => ({
        url: "/orders/get-phone-numbers",
        params: searchParams(args),
      }),
    }),
    sendBulkSMS: builder.mutation({
      query: (payload: { mobileNumbers: string[]; messageBody: string }) => ({
        url: "/sms/bulk-sms",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateOrderSMSMutation,
  useUpdateOrderSMSMutation,
  useGetMobilesForSMSQuery,
  useLazyGetMobilesForSMSQuery,
  useSendBulkSMSMutation,
} = smsApi;
