import baseApi from "@/redux/baseApi/baseApi";
import {
  TPaymentMethodPayload,
  TPaymentMethodResponse,
  TSinglePaymentMethodResponse,
} from "./paymentMethodInterface";

const paymentMethodAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethod: builder.query<TPaymentMethodResponse, void>({
      query: () => ({
        url: "/payment-method",
        method: "GET",
      }),
      providesTags: ["paymentMethod"],
    }),
    addPaymentMethod: builder.mutation<
      TSinglePaymentMethodResponse,
      Partial<TPaymentMethodPayload>
    >({
      query: (payload) => ({
        url: "/payment-method",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["paymentMethod"],
    }),
    updatePaymentMethod: builder.mutation<
      TSinglePaymentMethodResponse,
      { id: string; payload: Partial<TPaymentMethodPayload> }
    >({
      query: ({ id, payload }) => ({
        url: `/payment-method/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["paymentMethod"],
    }),
    deletePaymentMethod: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/payment-method/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["paymentMethod"],
    }),
  }),
});

export const {
  useGetPaymentMethodQuery,
  useAddPaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
} = paymentMethodAPI;
