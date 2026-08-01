"use client";
import Media from "./Media";
import { TAttribute } from "@/app/dashboard/attribute/lib/attribute.interface";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_TYPE } from "@/const/products";
import { TSelectedAttribute } from "@/redux/features/addProduct/variation/interface";
import { useGetAttributesQuery } from "@/redux/features/attributes/attributesApi";
import { useEffect, useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Attributes from "./Attributes";
import Inventory from "./Inventory";
import Price from "./Price";
import Variations from "./Variations";

const ProductDataTabs = () => {
  const {
    watch,
    control,
    formState: { errors, submitCount },
  } = useFormContext();

  const type = watch("type");

  const { data, isLoading } = useGetAttributesQuery(
    { isActive: true },
    { skip: type === PRODUCT_TYPE.SIMPLE }
  );

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
          <p className="p-4 text-center italic text-muted-foreground">
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
    ];
    return allTabs.filter((tab) => tab.isVisible);
  }, [type, attributes, isLoading]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const isTabVisible = tabs.some((tab) => tab.id === activeTab);
    if (!isTabVisible && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [type, activeTab, tabs]);

  const hasError = (tabId: string) => {
    if (submitCount === 0) return false;

    const tabConfig = tabs.find((t) => t.id === tabId);
    if (!tabConfig) return false;

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

  useEffect(() => {
    if (submitCount > 0) {
      const firstTabWithError = tabs.find((tab) => hasError(tab.id));
      if (firstTabWithError && firstTabWithError.id !== activeTab) {
        setActiveTab(firstTabWithError.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitCount, errors, tabs]);

  if (isLoading) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-border bg-muted/20 text-sm text-muted-foreground">
        Loading product data…
      </div>
    );
  }

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || null;

  return (
    <SectionContentWrapper heading={"Product Data"}>
      <div className="mb-4 flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:gap-4">
        <label className="whitespace-nowrap text-sm font-medium text-foreground">
          Product Type
        </label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-10 w-full rounded-lg">
                <SelectValue placeholder="Select product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PRODUCT_TYPE.SIMPLE}>
                  Simple Product
                </SelectItem>
                <SelectItem value={PRODUCT_TYPE.VARIABLE}>
                  Variable Product
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
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
              size="sm"
              className="relative h-9 rounded-lg px-4"
            >
              {tab.label}
              {isError && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-destructive"></span>
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
