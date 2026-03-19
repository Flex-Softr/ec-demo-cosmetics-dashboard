import baseApi from "@/redux/baseApi/baseApi";

export const searchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSearchData: builder.query({
      query: ({
        endPoint,
        searchParams,
      }: {
        endPoint: string;
        searchParams: Record<string, unknown>;
      }) => ({
        url: endPoint,
        method: "GET",
        params: searchParams,
      }),
    }),
  }),
});

export const { useGetSearchDataQuery } = searchApi;
