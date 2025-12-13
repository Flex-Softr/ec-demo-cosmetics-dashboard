import fetchData from "@/utilities/fetchData";
import AddAttribute from "./components/AddAttributes";
import AddedAttributes from "./components/AddedAttributes";

const Attributes = async () => {
  const { data } = await fetchData({
    endPoint: "/attributes",
    tags: ["attributes"],
  });

  return (
    <div className="h-screen">
      <div className="flex justify-between gap-5 px-3 pt-3">
        <div className="flex-1">
          <AddAttribute />
        </div>
        <div className="flex-1">
          <AddedAttributes attributes={data} />
        </div>
      </div>
    </div>
  );
};

export default Attributes;
