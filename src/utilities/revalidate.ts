import config from "@/config/config";

export type TTags =
  | "products"
  | `product-${string}`
  | `relatedProducts-${string}`
  | `collectionProducts-${string}`
  | "bestSellingProducts"
  | "featuredProducts"
  | "priceRange"
  | "allCategories"
  | "parentCategory"
  | "paymentMethod"
  | "shippingCharge"
  | "sliderBanner"
  | `homepageSections`
  | `homepageSections-${string}`
  | "homepageIndividualSection";

export const revalidateTag = async (tag: TTags | TTags[]) => {
  let tags: string;
  if (Array.isArray(tag)) {
    tags = tag.map((t) => decodeURIComponent(t)).join(",");
  } else {
    tags = decodeURIComponent(tag);
  }

  const url = `${config.client_base_url}/api/revalidate?key=${encodeURI(
    tags
  )}&secret=${config.revalidate_secret}`;

  await fetch(url);
};
