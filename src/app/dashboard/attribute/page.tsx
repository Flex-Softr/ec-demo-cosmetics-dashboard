import AddAttribute from "./components/AddAttributes";
import AddedAttributes from "./components/AddedAttributes";

const Attributes = async () => {
  return (
    <div className="h-screen text-gray-900">
      <div className="flex justify-between gap-5 px-4 pt-4">
        <div className="flex-1">
          <AddAttribute />
        </div>
        <div className="flex-1">
          <AddedAttributes />
        </div>
      </div>
    </div>
  );
};

export default Attributes;
