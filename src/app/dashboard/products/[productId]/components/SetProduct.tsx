"use client";
import {
  resetProduct,
  setAdvanced,
  setBrand,
  setCategory,
  setProduct,
  setSubcategory,
} from "@/redux/features/addProduct/addProductSlice";
import {
  setDeleteImage,
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";
import { useAppDispatch } from "@/redux/hooks";
// import fetchData from "@/utilities/fetchData";
import getAttributes from "@/app/dashboard/add-products/lib/getAttributes";
import {
  resetVariation,
  setDefaultSelectedAttributeValue,
  setDefaultVariation,
  setGeneratedVariations,
  setSelectedAttribute,
} from "@/redux/features/addProduct/variation/variationSlice";
import { useGetAProductQuery } from "@/redux/features/allProducts/allProductsApi";
import { useEffect } from "react";

const SetProduct = ({ productId }: { productId: string }) => {
  const dispatch = useAppDispatch();
  const { data, isSuccess } = useGetAProductQuery(productId);

  useEffect(() => {
    if (isSuccess && data) {
      const setProductData = async () => {
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
        } = data;

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
          return attributes.some((attr: { _id: string }) => attr._id === value);
        });

        dispatch(setSelectedAttribute(selectedAttributes));

        const renamedAttributes = attributes?.map(
          (attr: {
            _id: string;
            name: string;
            values: { _id: string; name: string }[];
          }) => ({
            value: attr._id,
            label: attr.name,
            child: attr.values?.map((val) => ({
              value: val._id,
              label: val.name,
            })),
          })
        );
        dispatch(setDefaultSelectedAttributeValue(renamedAttributes));

        const generatedVariations = variations?.map(
          (variation: {
            _id: string;
            attributes: { [x: string]: string };
          }) => ({
            _id: variation._id,
            attributes: { ...variation.attributes },
          })
        );

        dispatch(setGeneratedVariations(generatedVariations));
        dispatch(setDefaultVariation(variations));
      };
      setProductData();
    }
  }, [data, isSuccess, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetProduct());
      dispatch(resetVariation());
      dispatch(setThumbnail(""));
      dispatch(setGallery([]));
      dispatch(setDeleteImage([]));
    };
  }, [dispatch]);

  return <></>;
};

export default SetProduct;
