import baseApi from "@/redux/baseApi/baseApi";
import {
  ICollection,
  ICreateCollectionPayload,
  IUpdateCollectionPayload,
} from "@/types/collection";
import { TListResponse } from "@/types/response";
import searchParams from "@/utilities/searchParams";

const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ...

    getCollections: builder.query<
      TListResponse<ICollection>,
      Record<string, unknown>
    >({
      query: (args) => ({
        url: "/collections",
        params: searchParams(args),
      }),
      providesTags: ["collections"],
    }),
    getCollection: builder.query<
      { success: boolean; data: ICollection },
      string
    >({
      query: (slug) => ({
        url: `/collections/${slug}`,
      }),
      providesTags: (result, error, slug) => [
        { type: "collections", id: slug },
      ],
    }),
    createCollection: builder.mutation<
      { success: boolean; message: string; data: ICollection },
      ICreateCollectionPayload
    >({
      query: (data) => ({
        url: `/collections`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["collections"],
    }),
    updateCollection: builder.mutation<
      { success: boolean; message: string; data: ICollection },
      { id: string; data: IUpdateCollectionPayload }
    >({
      query: ({ id, data }) => ({
        url: `/collections/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["collections"],
    }),
    deleteCollection: builder.mutation<
      { success: boolean; message: string },
      string // Changed from string[] to string
    >({
      query: (id) => ({
        url: `/collections/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["collections"],
    }),
  }),
});

export const {
  useGetCollectionsQuery,
  useGetCollectionQuery,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionApi;
