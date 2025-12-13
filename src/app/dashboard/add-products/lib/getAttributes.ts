import {
  TSelectValue,
  TSelectedAttribute,
} from "@/redux/features/addProduct/variation/interface";
import fetchData from "@/utilities/fetchData";

type TVlues = {
  _id: string;
  name: string;
  values: { _id: string; name: string }[];
};

const getAttributes = async () => {
  const { data = [] } = await fetchData({
    endPoint: "/attributes",
    tags: ["attributes"],
  });
  const attributes: TSelectedAttribute[] = data?.map(
    ({ _id, name, values }: TVlues) => ({
      label: name,
      value: _id,
      child: values?.map(
        ({ _id, name }) => ({ label: String(name), value: _id }) as TSelectValue
      ),
    })
  );

  return attributes;
};

export default getAttributes;
