import { TSelectValue } from "@/redux/features/addProduct/variation/interface";
import fetchData from "@/utilities/fetchData";

const getTags = async () => {
  const { data = [] } = await fetchData({
    endPoint: "/tags",
    tags: ["tags"],
  });
  const tags: TSelectValue[] = data?.map(
    ({ _id, name }: { _id: string; name: string }) => ({
      label: name,
      value: _id,
    })
  );

  return tags;
};

export default getTags;
