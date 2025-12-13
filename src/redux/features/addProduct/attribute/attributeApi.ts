import baseApi from "@/redux/baseApi/baseApi";

const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttributes: builder.query({
      query: () => ({
        url: `/attributes`,
      }),
    }),
  }),
});

export const { useGetAttributesQuery } = attributeApi;
