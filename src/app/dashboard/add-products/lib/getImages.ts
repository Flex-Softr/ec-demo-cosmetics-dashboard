import config from "@/config/config";

const getImages = async () => {
  const res = await fetch(`${config.api_base_url}/server-api/v1/images`);
  const images = await res.json();
  if (!res.ok) {
    throw new Error("Error when fetching post!");
  }
  return images;
};

export default getImages;
