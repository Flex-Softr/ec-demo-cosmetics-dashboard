"use client";
import { resetProduct } from "@/redux/features/addProduct/addProductSlice";
import { resetVariation } from "@/redux/features/addProduct/variation/variationSlice";
import {
  setDeleteImage,
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useEffect } from "react";

const ProductResetter = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetProduct());
    dispatch(resetVariation());
    dispatch(setThumbnail(""));
    dispatch(setGallery([]));
    dispatch(setDeleteImage([]));
  }, [dispatch]);

  return <></>;
};

export default ProductResetter;
