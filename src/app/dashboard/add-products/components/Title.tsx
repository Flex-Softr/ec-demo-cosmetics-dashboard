"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Input } from "@/components/ui/input";
import {
  resetProduct,
  setSlug,
  setTitle,
} from "@/redux/features/addProduct/addProductSlice";
import {
  setDefaultSelectedAttributeValue,
  setDefaultVariation,
  setGeneratedVariations,
  setSelectedAttribute,
} from "@/redux/features/addProduct/variation/variationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

const Title = () => {
  const dispatch = useAppDispatch();
  const slug = useAppSelector(({ addProduct }) => addProduct.slug);
  const title = useAppSelector(({ addProduct }) => addProduct.title);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  useEffect(() => {
    dispatch(resetProduct());
    dispatch(setDefaultSelectedAttributeValue([]));
    dispatch(setDefaultVariation([]));
    dispatch(setGeneratedVariations([]));
    dispatch(setSelectedAttribute([]));
  }, [dispatch]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: { target: { value: string } }) => {
    const newTitle = e.target.value;
    dispatch(setTitle(newTitle));
    if (!isSlugManuallyEdited) {
      dispatch(setSlug(generateSlug(newTitle)));
    }
  };

  const handleSlugChange = (e: { target: { value: string } }) => {
    dispatch(setSlug(e.target.value));
    setIsSlugManuallyEdited(true);
  };

  return (
    <SectionContentWrapper heading={"Product Title and Slug"}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Title</label>
          <Input
            placeholder="Product Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Slug</label>
          <Input
            placeholder="product-slug"
            value={slug}
            onChange={handleSlugChange}
          />
        </div>
      </div>
    </SectionContentWrapper>
  );
};

export default Title;
