import config from "@/config/config";

const getCategories = async () => {
  const res = await fetch(`${config.base_url}/api/v1/categories`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Error when fetching category!");
  }
  return data.data;
};

export default getCategories;
