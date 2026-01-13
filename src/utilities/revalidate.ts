import config from "@/config/config";

type TTags =
  | "products"
  | `product-${string}`
  | `relatedProducts-${string}`
  | `collectionProducts-${string}`
  | "bestSellingProducts"
  | "featuredProducts"
  | "allCategories"
  | "parentCategory"
  | "paymentMethod"
  | "shippingCharge"
  | "sliderBanner";

export const revalidateTag = async (tag: TTags | TTags[]) => {
  let tags: string;
  if (Array.isArray(tag)) {
    tags = tag.join(",");
  } else {
    tags = tag;
  }
  await fetch(
    `${config.client_base_url}/api/revalidate?key=${tags}&secret=${config.revalidate_secret}`
  );
};
