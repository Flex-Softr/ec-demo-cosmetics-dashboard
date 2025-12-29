"use client";
import { TAttribute } from "@/app/dashboard/attribute/lib/attribute.interface";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { TSelectedAttribute } from "@/redux/features/addProduct/variation/interface";
import { useEffect, useState } from "react";

import Inventory from "./Inventory";
import Media from "./Media";
// import Offer from "./Offer";
import { Button } from "@/components/ui/button";
import { useGetAttributesQuery } from "@/redux/features/addAttributes/attributesApi";
import { setProductType } from "@/redux/features/addProduct/addProductSlice";
import {
  setDeleteImage,
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Advanced from "./Advanced";
import Attributes from "./Attributes";
import Price from "./Price";
import Variations from "./Variations";

const ProductData = ({ productId }: { productId: string }) => {
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
  const dispatch = useAppDispatch();
  const productType = useAppSelector((state) => state.addProduct.type);
  const [activeTab, setActiveTab] = useState<string>("media");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    dispatch(setThumbnail(""));
    dispatch(setGallery([]));
    dispatch(setDeleteImage([]));
  }, [dispatch]);

  // Sync active tab when product type changes
  useEffect(() => {
    if (productType === "simple") {
      if (activeTab === "variations") {
        setActiveTab("media");
      }
    } else if (productType === "variable") {
      if (activeTab === "price" || activeTab === "inventory") {
        setActiveTab("media");
      }
    }
  }, [productType, activeTab]);

  return (
    <SectionContentWrapper heading={"Product Data"}>
      <div className="flex items-center gap-4 py-3 border-b border-gray-100 mb-4">
        <label className="font-medium text-gray-700 text-nowrap">
          Product Type:
        </label>
        <select
          value={productType}
          onChange={(e) =>
            dispatch(setProductType(e.target.value as "simple" | "variable"))
          }
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
          className="h-9 px-4"
        >
          Media
        </Button>

        {productType === "simple" && (
          <>
            <Button
              onClick={() => handleTabClick("price")}
              variant={activeTab === "price" ? "default" : "outline"}
              type="button"
              className="h-9 px-4"
            >
              Price
            </Button>
            <Button
              onClick={() => handleTabClick("inventory")}
              variant={activeTab === "inventory" ? "default" : "outline"}
              type="button"
              className="h-9 px-4"
            >
              Inventory
            </Button>
          </>
        )}

        {(productType === "simple" || productType === "variable") && (
          <Button
            onClick={() => handleTabClick("attributes")}
            variant={activeTab === "attributes" ? "default" : "outline"}
            type="button"
            className="h-9 px-4"
          >
            Attributes
          </Button>
        )}

        {productType === "variable" && (
          <>
            <Button
              onClick={() => handleTabClick("variations")}
              variant={activeTab === "variations" ? "default" : "outline"}
              type="button"
              className="h-9 px-4"
            >
              Variations
            </Button>
          </>
        )}

        <Button
          onClick={() => handleTabClick("advanced")}
          variant={activeTab === "advanced" ? "default" : "outline"}
          type="button"
          className="h-9 px-4"
        >
          Advanced
        </Button>
      </div>

      <div className="mt-4 min-h-[300px]">
        {activeTab === "media" && <Media />}
        {activeTab === "inventory" && productType === "simple" && (
          <Inventory productId={productId} />
        )}
        {activeTab === "price" && productType === "simple" && <Price />}
        {activeTab === "attributes" &&
          (isLoading ? (
            <p className="p-4 text-center text-gray-500 italic">
              Loading attributes...
            </p>
          ) : (
            <Attributes attributes={attributes} />
          ))}
        {activeTab === "variations" && productType === "variable" && (
          <Variations />
        )}
        {activeTab === "advanced" && <Advanced />}
      </div>
    </SectionContentWrapper>
  );
};

export default ProductData;
