import { TSelectValue } from "@/redux/features/addProduct/variation/interface";
import fetchData from "@/utilities/fetchData";

const getBrands = async () => {
  const { data = [] } = await fetchData({
    endPoint: "/brands",
    tags: ["brands"],
  });
  const brands: TSelectValue[] = data?.map(
    ({ _id, name }: { _id: string; name: string }) => ({
      label: name,
      value: _id,
    })
  );

  return brands;
};

export default getBrands;
