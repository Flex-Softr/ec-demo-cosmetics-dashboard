"use client";
import Media from "./Media";
// import Offer from "./Offer";
import { TAttribute } from "@/app/dashboard/attribute/lib/attribute.interface";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Button } from "@/components/ui/button";
import { TSelectedAttribute } from "@/redux/features/addProduct/variation/interface";
import { useGetAttributesQuery } from "@/redux/features/attributes/attributesApi";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
// import Advanced from "./Advanced";
import Attributes from "./Attributes";
import Inventory from "./Inventory";
import Price from "./Price";
import Variations from "./Variations";
import { PRODUCT_TYPE } from "@/const/products";

const ProductDataTabs = () => {
  const {
    watch,
    register,
    formState: { errors, submitCount },
  } = useFormContext();

  const type = watch("type");

  const { data, isLoading } = useGetAttributesQuery(
    { isActive: true },
    { skip: type === PRODUCT_TYPE.SIMPLE }
  );
  // Memoize attributes transformation to prevent unnecessary recalculations
  const attributes: TSelectedAttribute[] = useMemo(() => {
    return (
      data?.data?.map((attr: TAttribute) => ({
        label: attr.name,
        value: attr._id,
        child:
          attr.values?.map((val: { name: string; _id: string }) => ({
            label: val.name,
            value: val._id,
          })) || [],
      })) || []
    );
  }, [data]);

  const [activeTab, setActiveTab] = useState<string>("media");

  // Centralized Tab Configuration
  const tabs = useMemo(() => {
    const allTabs = [
      {
        id: "media",
        label: "Media",
        component: <Media />,
        fields: ["image.thumbnail", "image.gallery"],
        isVisible: true,
      },
      {
        id: "price",
        label: "Price",
        component: <Price />,
        fields: ["price.regularPrice", "price.salePrice"],
        isVisible: type === PRODUCT_TYPE.SIMPLE,
      },
      {
        id: "inventory",
        label: "Inventory",
        component: <Inventory />,
        fields: ["inventory.sku", "inventory.stockQuantity"],
        isVisible: type === PRODUCT_TYPE.SIMPLE,
      },
      {
        id: "attributes",
        label: "Attributes",
        component: isLoading ? (
          <p className="p-4 text-center text-gray-500 italic">
            Loading attributes...
          </p>
        ) : (
          <Attributes attributes={attributes} />
        ),
        fields: ["attributes", "attributeValues"],
        isVisible: type === PRODUCT_TYPE.VARIABLE,
      },
      {
        id: "variations",
        label: "Variations",
        component: <Variations />,
        fields: ["variations"],
        isVisible: type === PRODUCT_TYPE.VARIABLE,
      },
      // {
      //   id: "advanced",
      //   label: "Advanced",
      //   component: <Advanced />,
      //   fields: [
      //     "warrantyInfo.duration.quantity",
      //     "warrantyInfo.duration.unit",
      //   ],
      //   isVisible: true,
      // },
    ];
    return allTabs.filter((tab) => tab.isVisible);
  }, [type, attributes, isLoading]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Sync active tab when product type changes
  useEffect(() => {
    // Check if current active tab is present in the visible tabs
    const isTabVisible = tabs.some((tab) => tab.id === activeTab);

    // If not visible, switch to the first visible tab (usually 'media')
    if (!isTabVisible && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [type, activeTab, tabs]);

  const hasError = (tabId: string) => {
    if (submitCount === 0) return false;

    const tabConfig = tabs.find((t) => t.id === tabId);
    if (!tabConfig) return false;

    // Use find for early exit instead of some (optimization)
    return tabConfig.fields.some((field) => {
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
      const firstTabWithError = tabs.find((tab) => hasError(tab.id));
      if (firstTabWithError && firstTabWithError.id !== activeTab) {
        setActiveTab(firstTabWithError.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount, errors, tabs]); // Added tabs to dependency for correctness

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Find the active component to render
  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || null;

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
          <option value={PRODUCT_TYPE.SIMPLE}>Simple Product</option>
          <option value={PRODUCT_TYPE.VARIABLE}>Variable Product</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 py-2">
        {tabs.map((tab) => {
          const isError = hasError(tab.id);
          return (
            <Button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              type="button"
              className="h-9 px-4 relative"
            >
              {tab.label}
              {isError && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </Button>
          );
        })}
      </div>

      <div className="mt-4">{ActiveComponent}</div>
    </SectionContentWrapper>
  );
};

export default ProductDataTabs;
