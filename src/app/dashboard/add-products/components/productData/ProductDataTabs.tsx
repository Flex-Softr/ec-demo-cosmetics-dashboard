"use client";
import Media from "./Media";
// import Offer from "./Offer";
import { TAttribute } from "@/app/dashboard/attribute/lib/attribute.interface";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Button } from "@/components/ui/button";
import { TSelectedAttribute } from "@/redux/features/addProduct/variation/interface";
import { useGetAttributesQuery } from "@/redux/features/attributes/attributesApi";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import Advanced from "./Advanced";
import Attributes from "./Attributes";
import Inventory from "./Inventory";
import Price from "./Price";
import Variations from "./Variations";

const ProductDataTabs = () => {
  const { data, isLoading } = useGetAttributesQuery({ isActive: true });
  const attributes: TSelectedAttribute[] =
    data?.data?.map((attr: TAttribute) => ({
      label: attr.name,
      value: attr._id,
      child:
        attr.values?.map((val: { name: string; _id: string }) => ({
          label: val.name,
          value: val._id,
        })) || [],
    })) || [];
  // const productType = useAppSelector((state) => state.addProduct.type);
  const { watch, register } = useFormContext();
  const type = watch("type");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [activeTab, setActiveTab] = useState<string>("media");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Sync active tab when product type changes
  useEffect(() => {
    if (type === "simple") {
      if (activeTab === "variations" || activeTab === "attributes") {
        setActiveTab("media");
      }
    } else if (type === "variable") {
      if (activeTab === "price" || activeTab === "inventory") {
        setActiveTab("media");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, activeTab]);

  const {
    formState: { errors, submitCount },
  } = useFormContext();

  // Define fields maps for each tab
  const tabFields: Record<string, string[]> = {
    media: ["image.thumbnail", "image.gallery"],
    price: ["price.regularPrice", "price.salePrice"],
    inventory: ["inventory.sku", "inventory.stockQuantity"],
    attributes: ["attributes", "attributeValues"],
    variations: ["variations"],
    advanced: ["warrantyInfo.duration.quantity", "warrantyInfo.duration.unit"],
  };

  const hasError = (tab: string) => {
    if (submitCount === 0) return false;
    const fields = tabFields[tab] || [];
    return fields.some((field) => {
      const parts = field.split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = errors;
      for (const p of parts) {
        if (current?.[p]) current = current[p];
        else return false;
      }
      return !!current;
    });
  };

  // Switch to first tab with error on failed submit
  useEffect(() => {
    if (submitCount > 0) {
      const tabs = [
        "media",
        "price",
        "inventory",
        "attributes",
        "variations",
        "advanced",
      ];
      const firstTabWithError = tabs.find((tab) => {
        // Only check tabs relevant to current type
        if (type === "variable" && (tab === "price" || tab === "inventory"))
          return false;
        if (type === "simple" && tab === "variations") return false;
        return hasError(tab);
      });

      if (firstTabWithError && firstTabWithError !== activeTab) {
        setActiveTab(firstTabWithError);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount, errors]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <SectionContentWrapper heading={"Product Data"}>
      <div className="flex items-center gap-4 py-3 border-b border-gray-100 mb-4">
        <label className="font-medium text-gray-700 text-nowrap">
          Product Type:
        </label>
        <select
          value={type}
          {...register("type")}
          className="h-9 border border-primary focus:outline focus:outline-primary rounded-md px-2 w-full"
        >
          <option value="simple">Simple Product</option>
          <option value="variable">Variable Product</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 py-2">
        <Button
          onClick={() => handleTabClick("media")}
          variant={activeTab === "media" ? "default" : "outline"}
          type="button"
          className="h-9 px-4 relative"
        >
          Media
          {hasError("media") && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>

        {type === "simple" && (
          <>
            <Button
              onClick={() => handleTabClick("price")}
              variant={activeTab === "price" ? "default" : "outline"}
              type="button"
              className="h-9 px-4 relative"
            >
              Price
              {hasError("price") && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </Button>
            <Button
              onClick={() => handleTabClick("inventory")}
              variant={activeTab === "inventory" ? "default" : "outline"}
              type="button"
              className="h-9 px-4 relative"
            >
              Inventory
              {hasError("inventory") && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </Button>
          </>
        )}

        {type === "variable" && (
          <Button
            onClick={() => handleTabClick("attributes")}
            variant={activeTab === "attributes" ? "default" : "outline"}
            type="button"
            className="h-9 px-4 relative"
          >
            Attributes
            {hasError("attributes") && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </Button>
        )}

        {type === "variable" && (
          <>
            <Button
              onClick={() => handleTabClick("variations")}
              variant={activeTab === "variations" ? "default" : "outline"}
              type="button"
              className="h-9 px-4 relative"
            >
              Variations
              {hasError("variations") && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </Button>
          </>
        )}

        <Button
          onClick={() => handleTabClick("advanced")}
          variant={activeTab === "advanced" ? "default" : "outline"}
          type="button"
          className="h-9 px-4 relative"
        >
          Advanced
          {hasError("advanced") && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </div>

      <div className="mt-4">
        {activeTab === "media" && <Media />}
        {activeTab === "inventory" && type === "simple" && <Inventory />}
        {activeTab === "price" && type === "simple" && <Price />}
        {activeTab === "attributes" &&
          type === "variable" &&
          (isLoading ? (
            <p className="p-4 text-center text-gray-500 italic">
              Loading attributes...
            </p>
          ) : (
            <Attributes attributes={attributes} />
          ))}
        {activeTab === "variations" && type === "variable" && <Variations />}
        {activeTab === "advanced" && <Advanced />}
      </div>
    </SectionContentWrapper>
  );
};

export default ProductDataTabs;
