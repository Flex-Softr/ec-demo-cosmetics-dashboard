import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { useState } from "react";
import Inventory from "./Inventory";
// import Media from "./Media";
// import Offer from "./Offer";
import { Button } from "@/components/ui/button";
import Price from "./Price";

type TProps = {
  item: {
    [key: string]: string;
  };
  index: number;
};

const SingleVariation = ({ item, index }: TProps) => {
  const [activeTab, setActiveTab] = useState<string>("price");
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Need to handle remove from parent (Variations.tsx)

  return (
    <div className="relative w-full">
      <div className="text-black flex items-center absolute top-2 z-10 gap-5 left-10">
        {item &&
          Object.keys(item).map((key) => (
            <span className="py-2" key={key}>
              {item[key]}
            </span>
          ))}
      </div>
      <SectionContentWrapper collapse={true}>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
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
            type="button"
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
          {activeTab === "price" && (
            <Price prefix={`variations.${index}.price`} />
          )}
          {activeTab === "inventory" && (
            <Inventory
              prefix={`variations.${index}.inventory`}
              isVariation={true}
            />
          )}
        </div>
      </SectionContentWrapper>
    </div>
  );
};

export default SingleVariation;
