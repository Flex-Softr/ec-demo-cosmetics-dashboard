import baseApi from "@/redux/baseApi/baseApi";
import { THomePageInput, THomePageSection } from "@/types/homepageSection";
import { TResponseMeta } from "@/types/response";
import searchParams from "@/utilities/searchParams";

const homepageSectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHomepageSections: builder.query<
      {
        success: boolean;
        data: { meta: TResponseMeta; data: THomePageSection[] };
      },
      Record<string, unknown>
    >({
      query: (args) => ({
        url: "/homepage-sections",
        params: searchParams(args),
      }),
      providesTags: ["homepage-sections"],
    }),
    getHomepageSection: builder.query<
      { success: boolean; data: THomePageSection },
      string
    >({
      query: (id) => ({
        url: `/homepage-sections/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "homepage-sections", id }],
    }),
    createHomepageSection: builder.mutation<
      { success: boolean; message: string; data: THomePageSection },
      THomePageInput
    >({
      query: (data) => ({
        url: `/homepage-sections`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["homepage-sections"],
    }),
    updateHomepageSection: builder.mutation<
      { success: boolean; message: string; data: THomePageSection },
      { id: string; data: Partial<THomePageInput> }
    >({
      query: ({ id, data }) => ({
        url: `/homepage-sections/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["homepage-sections"],
    }),
    deleteHomepageSection: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/homepage-sections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["homepage-sections"],
    }),
  }),
});

export const {
  useGetHomepageSectionsQuery,
  useGetHomepageSectionQuery,
  useCreateHomepageSectionMutation,
  useUpdateHomepageSectionMutation,
  useDeleteHomepageSectionMutation,
} = homepageSectionApi;
