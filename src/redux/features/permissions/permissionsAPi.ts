import baseApi from "@/redux/baseApi/baseApi";

const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPermissions: builder.query({
      query: () => ({ url: "/permissions" }),
    }),
    addOrRemovePermissionFromUser: builder.mutation({
      query: (data) => ({
        url: `/permissions/add-permission-to-user/${data.useId}`,
        method: "POST",
        body: { permissions: data.permissions },
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetAllPermissionsQuery,
  useAddOrRemovePermissionFromUserMutation,
} = permissionApi;
