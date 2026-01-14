"use client";
import { TAttribute } from "@/app/dashboard/attribute/lib/attribute.interface";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { PRODUCT_STATUS, PRODUCT_TYPE, STOCK_STATUS } from "@/const/products";
import { useGetAttributesQuery } from "@/redux/features/attributes/attributesApi";
import {
  setDeleteImage,
  setGallery,
  setThumbnail,
} from "@/redux/features/imageSelector/imageSelectorSlice";
import {
  useCreateProductMutation,
  useGetAProductQuery,
  useUpdateProductMutation,
} from "@/redux/features/products/productsApi";
import { useAppDispatch } from "@/redux/hooks";
import { revalidateTag } from "@/utilities/revalidate";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ProductSchema, { ProductFormValues } from "../lib/productValidation";
// import AdditionalInfo from "./AdditionalInfo";
import BrandInput from "./BrandInput";
import CategoryInput from "./CategoryInput";
import CollectionInput from "./CollectionInput";
import DescriptionInput from "./DescriptionInput";
import Featured from "./Featured";
import ProductDataTabs from "./productData/ProductDataTabs";
import ProductResetter from "./ProductResetter";
import Published from "./Published";
import RelatedProducts from "./RelatedProduct";
import ShortDescriptionInput from "./ShortDescriptionInput";
import TitleInput from "./TitleInput";

const ProductForm = ({ productId }: { productId?: string }) => {
  const dispatch = useAppDispatch();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: productData, isLoading: isFetching } = useGetAProductQuery(
    productId as string,
    { skip: !productId }
  );
  const { data: attributesData } = useGetAttributesQuery({ isActive: true });

  const defaultValues = useMemo(() => {
    return {
      title: "",
      slug: "",
      description: "",
      shortDescription: "",
      type: PRODUCT_TYPE.SIMPLE,
      image: {
        thumbnail: "",
        gallery: [],
      },
      price: {
        regularPrice: undefined,
        salePrice: undefined,
        discountPercent: undefined,
        priceSave: undefined,
      },
      inventory: {
        sku: "",
        stockStatus: STOCK_STATUS.IN_STOCK,
        stockQuantity: undefined,
        stockAvailable: undefined,
        preStockQuantity: undefined,
        manageStock: false,
        lowStockWarning: undefined,
        hideStock: false,
      },
      attributes: [],
      variations: [],
      brand: undefined,
      category: {
        name: "",
        subCategory: undefined,
      },
      productCollection: "",
      relatedProducts: [],
      featured: false,
      warranty: false,
      warrantyInfo: {
        duration: { quantity: "", unit: "" },
        terms: "",
      },
      publishedStatus: PRODUCT_STATUS.PUBLISHED,
    };
  }, []);

  const methods = useForm<ProductFormValues>({
    resolver: yupResolver(ProductSchema),
    defaultValues,
    mode: "all",
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (productId && productData && attributesData?.data) {
      const {
        thumbnail = {},
        gallery = [],
        featured,
        warranty,
        warrantyInfo = {},
        category = {},
        brand,
        attributes = [],
        type,
        relatedProducts = [],
        ...restProductData
      } = productData;

      const galleryData = gallery?.map(({ _id }: { _id: string }) => _id);
      const { _id: categoryId, subCategory } = category;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const brandId = (brand as any)?._id || brand;

      // Transform Attributes for Form State
      // 1. Map available attributes to the format used in dropdown
      const availableAttributesMap = new Map();
      attributesData.data.forEach((attr: TAttribute) => {
        availableAttributesMap.set(attr._id, {
          label: attr.name,
          value: attr._id,
          child:
            attr.values?.map((val: { name: string; _id: string }) => ({
              label: val.name,
              value: val._id,
            })) || [],
        });
      });

      // 2. Reconstruct selected attributes with full details (including child options)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedAttributes: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedAttributeValues: any[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attributes.forEach((prodAttr: any) => {
        // Try to find by ID (value) or Label (name)
        let matchedAttr = availableAttributesMap.get(prodAttr._id);
        if (!matchedAttr) {
          // Fallback: search by name
          for (const val of availableAttributesMap.values()) {
            if (val.label === prodAttr.name) {
              matchedAttr = val;
              break;
            }
          }
        }

        if (matchedAttr) {
          transformedAttributes.push(matchedAttr);
          // Map values
          const values =
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prodAttr.values?.map((v: any) => ({
              label: v.name,
              value: v._id,
            })) || [];
          transformedAttributeValues.push(values);
        } else {
          // Keep original if not found? Might break UI if no child options.
          // But helpful for preservation.
          transformedAttributes.push({
            label: prodAttr.name,
            value: prodAttr._id,
            child: [], // Unable to provide options if not found
          });
          transformedAttributeValues.push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prodAttr.values?.map((v: any) => ({
              label: v.name,
              value: v._id,
            })) || []
          );
        }
      });

      const formData = {
        ...defaultValues,
        ...restProductData,
        image: {
          thumbnail: thumbnail?._id || "",
          gallery: galleryData || [],
        },
        category: {
          name: categoryId,
          subCategory: subCategory?._id || "",
        },
        productCollection:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (productData.productCollection as any)?._id ||
          productData.productCollection ||
          "",
        brand: brandId,
        attributes: transformedAttributes,
        attributeValues: transformedAttributeValues,
        relatedProducts: relatedProducts,
        featured,
        warranty,
        warrantyInfo: {
          duration: {
            quantity: warrantyInfo?.duration?.quantity || "",
            unit: warrantyInfo?.duration?.unit || "",
          },
          terms: warrantyInfo?.terms || "",
        },
        type: type || PRODUCT_TYPE.SIMPLE,
      };

      reset(formData);

      // Dispatch image data to Redux to keep "SetProduct" style logic for Media component synchronization
      dispatch(setThumbnail(thumbnail._id));
      dispatch(setGallery(galleryData));
    }
  }, [
    productId,
    productData,
    reset,
    defaultValues,
    dispatch,
    attributesData?.data,
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      // Transformation for submission
      // Combine attributes and attributeValues to matching backend payload
      const uiAttributes = data.attributes || [];
      const uiAttributeValues = data.attributeValues || [];

      const payloadAttributes = uiAttributes.map(
        (attr: { label: string; value: string }, index: number) => {
          const values =
            uiAttributeValues[index]?.map(
              (v: { label: string; value: string }) => v.value
            ) || [];
          // Backend likely expects values as strings (names) or Ids?
          return {
            name: attr.value,
            values: values,
          };
        }
      );

      const payload = {
        ...data,
        attributes: payloadAttributes,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        relatedProducts: data.relatedProducts?.map((p: any) => p.value) || [],
      };
      // Remove temporary UI field
      delete payload.attributeValues;

      // Clean up price/inventory based on type
      if (data.type === PRODUCT_TYPE.VARIABLE) {
        delete payload.price;
        delete payload.inventory;
      } else {
        delete payload.variations;
      }

      // Clean up optional fields that might be empty strings
      if (!payload.brand) delete payload.brand;
      if (!payload.productCollection) delete payload.productCollection;
      if (!payload.category.subCategory) delete payload.category.subCategory;

      let res;
      if (productId) {
        res = await updateProduct({
          id: productId,
          payload: payload,
        }).unwrap();
      } else {
        res = await createProduct(payload).unwrap();
      }

      toast({
        className: "bg-success text-white text-2xl",
        title: res.message,
      });

      if (!productId) {
        reset(undefined, { keepSubmitCount: false });
        dispatch(setThumbnail(""));
        dispatch(setGallery([]));
        dispatch(setDeleteImage([]));
      }
      if (productId) {
        await revalidateTag([`product-${productData?.slug}`]);
      }
      await revalidateTag([
        `relatedProducts-${productData?.slug}`,
        `collectionProducts-${productData?.slug}`,
        "featuredProducts",
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errors: string[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any).errors) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errors = (err as any).errors;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } else if ((err as any).data?.errorMessages) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        errors = (err as any).data.errorMessages.map((e: any) => e.message);
      } else {
        errors.push(err.message || "Something went wrong");
      }
      toast({
        className: "bg-red-600 text-white text-2xl",
        title: errors[0],
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInvalid = (errors: any) => {
    // eslint-disable-next-line no-console
    // console.error("Validation Errors:", errors);

    // Extract the first error message to show in toast
    let firstErrorMessage = "Please check the form for errors.";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getFirstError = (obj: any): string | null => {
      for (const key in obj) {
        if (obj[key]?.message) return obj[key].message;
        if (typeof obj[key] === "object") {
          const nested = getFirstError(obj[key]);
          if (nested) return nested;
        }
      }
      return null;
    };

    const extracted = getFirstError(errors);
    if (extracted) firstErrorMessage = extracted;

    toast({
      className: "bg-red-600 text-white",
      title: firstErrorMessage,
    });
  };

  if (isFetching) return <p>Loading...</p>;

  return (
    <div className="mb-10">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          {!productId && <ProductResetter />}
          <Card className="flex gap-3 justify-between items-center m-4">
            <h1 className="text-2xl font-bold">
              {productId ? "Edit Product" : "Add Product"}
            </h1>
            <Link href={"/dashboard/products"} passHref>
              <Button type="button">View All</Button>
            </Link>
          </Card>

          {/* product data section started */}
          <div className="flex justify-between items-start gap-4 w-full px-4">
            <div className="w-[65%] space-y-3">
              {/* products title */}
              <TitleInput />
              <ShortDescriptionInput />
              {/* product data */}
              <ProductDataTabs />
              {/* products description */}
              <DescriptionInput />
              {/* <AdditionalInfo /> */}
            </div>
            {/* right Sidebar of add products */}
            <div className="w-2/6 space-y-3">
              <Published
                productId={productId as string}
                isLoading={isCreating || isUpdating}
              />
              <CategoryInput />
              <CollectionInput />
              <Featured />
              <BrandInput />
              <RelatedProducts />
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ProductForm;
