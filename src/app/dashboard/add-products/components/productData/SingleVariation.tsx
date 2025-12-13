import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { useState } from "react";
import Inventory from "./Inventory";
// import Media from "./Media";
// import Offer from "./Offer";
import Price from "./Price";
import { Button } from "@/components/ui/button";
// import { Trash2Icon } from "lucide-react";
// import { useAppDispatch } from "@/redux/hooks";
// import { setRemoveSingleVariation } from "@/redux/features/addProduct/variation/variationSlice";
// import { refetchData } from "@/utilities/fetchData";
// import { toast } from "@/components/ui/use-toast";
// import { useDeleteVariationMutation } from "@/redux/features/addProduct/variation/variationApi";

type TProps = {
  _id?: string;
  item: {
    [key: string]: string;
  };
  index: number;
  isDelete?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SingleVariation = ({ _id, item, index, isDelete }: TProps) => {
  // const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("price");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // const removeSingleVariation = (index: number) => {
  //   dispatch(setRemoveSingleVariation(index));
  // };
  // const [deleteVariation] = useDeleteVariationMutation();

  // const handleDeleteVariation = async (id: string) => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to delete this variation?"
  //   );
  //   if (!confirmDelete) return;

  //   try {
  //     const res = await deleteVariation(id).unwrap();
  //     if (res?.success) {
  //       refetchData("singleProduct");
  //       toast({
  //         className: "bg-success text-white text-2xl",
  //         title: res?.message,
  //       });
  //     }
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     toast({
  //       className: "bg-danger text-white text-2xl",
  //       title: error?.data?.message || "Failed to delete variation.",
  //     });
  //   }
  // };

  return (
    <div className="relative w-full">
      <div className="text-black flex items-center absolute top-2 z-10 gap-5 left-10">
        {/* Map over the keys of each item */}
        {Object.keys(item).map((key) => (
          <span className="py-2" key={key}>
            {key === "_id" ? null : item[key]}
          </span>
        ))}
        {/* {_id ? (
          <button onClick={() => handleDeleteVariation(_id)} title="Remove">
            <Trash2Icon size={20} className="text-red-500" />
          </button>
        ) : (
          <button onClick={() => removeSingleVariation(index)} title="Remove">
            <Trash2Icon size={20} className="text-red-500" />
          </button>
        )} */}
      </div>
      <SectionContentWrapper collapse={true}>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleTabClick("price")}
            className={`${
              activeTab === "price"
                ? "bg-primary text-white  hover:bg-secondary"
                : "border border-primary bg-inherit text-inherit hover:bg-inherit"
            }`}
          >
            Price
          </Button>
          <Button
            onClick={() => handleTabClick("inventory")}
            className={`${
              activeTab === "inventory"
                ? "bg-primary text-white  hover:bg-secondary"
                : "border border-primary bg-inherit text-inherit hover:bg-inherit"
            }`}
          >
            Inventory
          </Button>
        </div>
        <div>
          {activeTab === "price" && <Price isVariation={true} index={index} />}
          {activeTab === "inventory" && (
            <Inventory isVariation={true} index={index} />
          )}
        </div>
      </SectionContentWrapper>
    </div>
  );
};

export default SingleVariation;
