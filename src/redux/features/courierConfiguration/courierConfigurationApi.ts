import baseApi from "@/redux/baseApi/baseApi";
import { TCourierConfig } from "./courierConfigurationInterface";

const courierConfigurationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCouriers: builder.query<{ data: TCourierConfig[] }, void>({
      query: () => ({
        url: "/courier-config",
        method: "GET",
      }),
      providesTags: ["courierConfig"],
    }),
    addCourier: builder.mutation<{ message: string }, Partial<TCourierConfig>>({
      query: (payload) => ({
        url: "/courier-config",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["courierConfig"],
    }),
    updateCourier: builder.mutation<
      { message: string },
      { id: string; payload: Partial<TCourierConfig> }
    >({
      query: ({ id, payload }) => ({
        url: `/courier-config/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["courierConfig"],
    }),
    deleteCourier: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/courier-config/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["courierConfig"],
    }),
  }),
});

export const {
  useGetAllCouriersQuery,
  useAddCourierMutation,
  useUpdateCourierMutation,
  useDeleteCourierMutation,
} = courierConfigurationApi;
