import baseApi from "@/redux/baseApi/baseApi";
import searchParams from "@/utilities/searchParams";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStaffOrAdmin: builder.mutation({
      query: (userInfo) => ({
        url: "/users/create-staff-or-admin",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["users"],
    }),
    updateStaffOrAdmin: builder.mutation({
      query: (userInfo) => ({
        url: `/users/update-admin-or-staff/${userInfo.id}`,
        method: "PATCH",
        body: userInfo.body,
      }),
      invalidatesTags: ["users"],
    }),

    getAllUsers: builder.query({
      query: (args) => ({
        url: "/users/all-admin-staff",
        params: searchParams(args),
      }),
      providesTags: ["users"],
    }),
  }),
});

export const {
  useCreateStaffOrAdminMutation,
  useGetAllUsersQuery,
  useUpdateStaffOrAdminMutation,
} = userApi;
