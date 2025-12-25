"use client";
import {
  setAdvanced,
  setBrand,
  setCategory,
  setProduct,
  setSubcategory,
} from "@/redux/features/addProduct/addProductSlice";
import {
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch } from "@/redux/hooks";
// import fetchData from "@/utilities/fetchData";
import { useEffect } from "react";
import {
  setDefaultSelectedAttributeValue,
  setDefaultVariation,
  setGeneratedVariations,
  setSelectedAttribute,
} from "@/redux/features/addProduct/variation/variationSlice";
import getAttributes from "@/app/dashboard/add-products/lib/getAttributes";
import { useGetAProductQuery } from "@/redux/features/allProducts/allProductsApi";

const SetProduct = ({ productId }: { productId: string }) => {
  const dispatch = useAppDispatch();
  const { data } = useGetAProductQuery(productId);

  useEffect(() => {
    const setProductData = async () => {
      // const { data: { thumbnail, gallery, featured, warranty, warrantyInfo, category, brand, attributes = [], variations, ...data } } = await fetchData({
      //     endPoint: `/products/${productId}`,
      //     tags: ["singleProduct"],
      // });
      const {
        thumbnail = {},
        gallery = [],
        featured,
        warranty,
        warrantyInfo = {},
        category = {},
        brand,
        attributes = [],
        variations = [],
        ...restProductData
      } = data || {};
      const galleryData = gallery?.map(({ _id }: { _id: string }) => _id);
      const { _id, subCategory } = category;
      dispatch(setCategory(_id));
      if (subCategory) {
        dispatch(setSubcategory(subCategory._id));
      }
      if (warranty) {
        const { duration, terms } = warrantyInfo;
        const { quantity, unit } = duration || {};
        dispatch(
          setAdvanced({ featured, warranty, quantity, unit: unit, terms })
        );
      }
      if (brand) {
        dispatch(setBrand(brand._id));
      }
      dispatch(setThumbnail(thumbnail._id));
      dispatch(setGallery(galleryData));
      dispatch(setProduct(restProductData));
      const allAttribute = await getAttributes();
      const selectedAttributes = allAttribute.filter(({ value }) => {
        return attributes.some(({ _id }: { _id: string }) => _id === value);
      });

      dispatch(setSelectedAttribute(selectedAttributes));
      const renamedAttributes = attributes?.map(
        ({
          _id,
          name,
          values,
        }: {
          _id: string;
          name: string;
          values: { _id: string; name: string }[];
        }) => ({
          value: _id,
          label: name,
          child: values?.map(({ _id, name }) => ({
            value: _id,
            label: name,
          })),
        })
      );
      dispatch(setDefaultSelectedAttributeValue(renamedAttributes));

      const generatedVariations = variations?.map(
        ({
          _id,
          attributes,
        }: {
          _id: string;
          attributes: { [x: string]: string };
        }) => ({
          _id,
          attributes: { ...attributes },
        })
      );

      dispatch(setGeneratedVariations(generatedVariations));
      dispatch(setDefaultVariation(variations));
    };
    setProductData();
  }, [data, dispatch]);

  return <></>;
};

export default SetProduct;
