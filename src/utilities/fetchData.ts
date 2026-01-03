"use server";
import config from "@/config/config";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import objectToSearchParams from "./searchParams";

type TTags =
  | "products"
  | "singleProduct"
  | "ProductsName"
  | "paymentMethod"
  | "shippingCharge"
  | "allOrders"
  | "processingOrders"
  | "processingDoneOrders"
  | "monitorDeliveryOrders"
  | "singleOrder"
  | "singleImage"
  | "orderStatusCount"
  | "customerOrderHistory"
  | "categories"
  | "subcategories"
  | "attributes"
  | "fraudCheck"
  | "brands"
  | "tags"
  | "order-sms-notification"
  | "sliders";

type TProps = {
  endPoint: string;
  tags?: TTags[];
  revalidate?: number;
  searchParams?: Record<string, unknown>;
  cache?: RequestCache;
};

const fetchData = async ({
  endPoint,
  tags = [],
  searchParams,
  cache,
  revalidate,
}: TProps) => {
  let url = `${config.api_base_url}/api/v1${endPoint}`;
  const accessToken = cookies().get("__app.ec.at")?.value;
  const reqConfig = {
    headers: { authorization: `Bearer ${accessToken}` },
    cache: cache || "force-cache", // ✅ "force-cache" caches forever
    next: { tags, revalidate },
  };

  if (Object.keys(searchParams || {}).length) {
    const modifiedSearchParams = objectToSearchParams(
      searchParams as Record<string, string>
    );
    url = url.concat("?", modifiedSearchParams);
  }

  const res = await fetch(url, reqConfig);

  if (!res.ok) {
    // Attempt to extract error message from the response body
    const errorData = await res.json().catch(() => null); // Prevent JSON parse errors
    const errorMessage =
      errorData?.message ||
      errorData?.error ||
      `Request failed with status ${res.status}`;

    throw new Error(errorMessage);
  }

  const data = await res.json();

  return data;
};

export default fetchData;

export async function refetchData(tag: TTags) {
  revalidateTag(tag);
}
