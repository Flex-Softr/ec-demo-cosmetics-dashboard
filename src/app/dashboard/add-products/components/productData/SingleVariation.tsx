import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { useState } from "react";
import Inventory from "./Inventory";
// import Media from "./Media";
// import Offer from "./Offer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";
import Price from "./Price";

type TProps = {
  item: {
    [key: string]: string;
  };
  index: number;
};

const SingleVariation = ({ item, index }: TProps) => {
  const [activeTab, setActiveTab] = useState<string>("price");
  const { control } = useFormContext();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Need to handle remove from parent (Variations.tsx)

  return (
    <div className="relative w-full">
      <div className="flex items-center absolute top-3.5 left-5 z-10 gap-2 pointer-events-none">
        {item &&
          Object.keys(item).map((key) => (
            <Badge
              className="bg-slate-100 border border-slate-200 text-muted-foreground text-sm"
              variant="outline"
              key={key}
            >
              <span className="capitalize mr-1">{key}:</span>
              {item[key]}
            </Badge>
          ))}
      </div>
      <SectionContentWrapper collapse={true}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex gap-3">
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

          <div className="flex items-center space-x-2 mr-20">
            <Controller
              control={control}
              name={`variations.${index}.isActive`}
              defaultValue={true}
              render={({ field }) => (
                <Switch
                  id={`variations.${index}.isActive`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor={`variations.${index}.isActive`}>Active</Label>
          </div>
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
