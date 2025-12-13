"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { useEffect, useState } from "react";
import Inventory from "./Inventory";
import Media from "./Media";
// import Offer from "./Offer";
import Price from "./Price";
import Variations from "./Variations";
import Attributes from "./attribute/Attributes";
import { TSelectedAttribute } from "@/redux/features/addProduct/variation/interface";
import Advanced from "./Advanced";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import {
  setDeleteImage,
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";

const ProductData = ({
  attributes,
  productId,
}: {
  attributes: TSelectedAttribute[];
  productId: string;
}) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>("media");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    dispatch(setThumbnail(""));
    dispatch(setGallery([]));
    dispatch(setDeleteImage([]));
  }, [dispatch]);

  // const [bulkAction, setBulkAction] = useState("");

  return (
    <SectionContentWrapper heading={"Product Data"}>
      {/* <div className="absolute top-0 left-[45%]">
        <select
         defaultValue={bulkAction}
         onChange={(e) => setBulkAction(e.target.value)}
         className="w-[100px] h-9 border border-primary focus:outline focus:outline-primary rounded-sm"
        >
          <option value="simple">Simple</option>
          <option value="variable">Variable</option>
        </select>
      </div> */}
      <div className="flex flex-wrap gap-3 py-2">
        <Button
          onClick={() => handleTabClick("media")}
          className={`${
            activeTab === "media"
              ? "bg-primary text-white  hover:bg-secondary"
              : "border border-primary bg-inherit text-inherit hover:bg-inherit"
          }`}
        >
          Media
        </Button>
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
          onClick={() => handleTabClick("attributes")}
          className={`${
            activeTab === "attributes"
              ? "bg-primary text-white  hover:bg-secondary"
              : "border border-primary bg-inherit text-inherit hover:bg-inherit"
          }`}
        >
          Attributes
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
        <Button
          onClick={() => handleTabClick("variations")}
          className={`${
            activeTab === "variations"
              ? "bg-primary text-white  hover:bg-secondary"
              : "border border-primary bg-inherit text-inherit hover:bg-inherit"
          }`}
        >
          Variations
        </Button>
        {/* <Button
          onClick={() => handleTabClick("offer")}
          className={`${
            activeTab === "offer"
              ? "bg-primary text-white  hover:bg-secondary"
              : "border border-primary bg-inherit text-inherit hover:bg-inherit"
          }`}
        >
          Offer
        </Button> */}
        <Button
          onClick={() => handleTabClick("advanced")}
          className={`${
            activeTab === "advanced"
              ? "bg-primary text-white  hover:bg-secondary"
              : "border border-primary bg-inherit text-inherit hover:bg-inherit"
          }`}
        >
          Advanced
        </Button>
      </div>
      <div>
        {activeTab === "media" && <Media />}
        {activeTab === "inventory" && <Inventory productId={productId} />}
        {activeTab === "price" && <Price />}
        {activeTab === "attributes" && <Attributes attributes={attributes} />}
        {activeTab === "variations" && <Variations />}
        {/* {activeTab === "offer" && <Offer />} */}
        {activeTab === "advanced" && <Advanced />}
      </div>
    </SectionContentWrapper>
  );
};

export default ProductData;
