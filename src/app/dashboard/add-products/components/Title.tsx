"use client";
import SectionContentWrapper from "@/components/section-content-wrapper/SectionContentWrapper";
import { Input } from "@/components/ui/input";
import {
  resetProduct,
  setTitle,
} from "@/redux/features/addProduct/addProductSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setDefaultSelectedAttributeValue,
  setDefaultVariation,
  setGeneratedVariations,
  setSelectedAttribute,
} from "@/redux/features/addProduct/variation/variationSlice";
import { useEffect } from "react";

const Title = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetProduct());
    dispatch(setDefaultSelectedAttributeValue([]));
    dispatch(setDefaultVariation([]));
    dispatch(setGeneratedVariations([]));
    dispatch(setSelectedAttribute([]));
  }, [dispatch]);

  const title = useAppSelector(({ addProduct }) => addProduct.title);

  const handleTitleChange = (e: { target: { value: string } }) => {
    dispatch(setTitle(e.target.value));
  };

  return (
    <SectionContentWrapper heading={"Product Title"}>
      <Input
        placeholder="Product Title"
        value={title}
        onChange={handleTitleChange}
      />
    </SectionContentWrapper>
  );
};

export default Title;
