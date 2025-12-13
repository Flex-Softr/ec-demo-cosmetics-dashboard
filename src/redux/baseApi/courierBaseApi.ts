import config from "@/config/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const courierBaseQuery = fetchBaseQuery({
  baseUrl: "https://portal.steadfast.com.bd/api/v1",
  // credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Api-Key", `${config.courier_api_key}`);
    headers.set("Secret-Key", `${config.courier_secret_key}`);
    return headers;
  },
});

// const tags = [];

const courierBaseApi = createApi({
  reducerPath: "courierBaseApi",
  baseQuery: courierBaseQuery,
  // tagTypes: tags,
  endpoints: () => ({}),
});

export default courierBaseApi;
