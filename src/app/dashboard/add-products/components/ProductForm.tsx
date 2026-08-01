"use client";
import { TAttribute } from "@/app/dashboard/attribute/lib/attribute.interface";
import DeleteProductBtn from "@/components/DeleteProductBtn";
import PageHeader from "@/components/pageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { PRODUCT_STATUS, PRODUCT_TYPE, STOCK_STATUS } from "@/const/products";
import { useGetAttributesQuery } from "@/redux/features/attributes/attributesApi";
import { useGetCollectionsQuery } from "@/redux/features/collection/collectionApi";
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
import { ArrowLeft, Package, PackagePlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ProductSchema, { ProductFormValues } from "../lib/productValidation";
import DescriptionInput from "./DescriptionInput";
import PreviewLinkInput from "./PreviewLinkInput";
import ProductDataTabs from "./productData/ProductDataTabs";
import ProductOrganizationPanel from "./ProductOrganizationPanel";
import ProductResetter from "./ProductResetter";
import Published from "./Published";
import RelatedProducts from "./RelatedProduct";
import Seo from "./Seo";
import ShortDescriptionInput from "./ShortDescriptionInput";
import TitleInput from "./TitleInput";

const ProductForm = ({ productId }: { productId?: string }) => {
  const dispatch = useAppDispatch();
  const isEdit = Boolean(productId);

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const { data: productData, isLoading: isFetching } = useGetAProductQuery(
    productId as string,
    { skip: !productId }
  );
  const { data: attributesData } = useGetAttributesQuery({ isActive: true });
  const { data: collectionsResponse, isLoading: collectionLoading } =
    useGetCollectionsQuery({
      isActive: true,
    });

  const defaultValues = useMemo(() => {
    return {
      title: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      canonicalUrl: "",
      schemaMarkup: "",
      description: "",
      previewLink: "",
      shortDescription: "",
      type: PRODUCT_TYPE.SIMPLE,
      featured: false,
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
        sku: undefined,
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
      category: [],
      productCollection: [],
      relatedProducts: [],
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
        warrantyInfo = {},
        category = [],
        brand,
        attributes = [],
        relatedProducts = [],
        productCollection = [],
        seo = {},
        ...restProductData
      } = productData;

      const galleryData = gallery?.map(({ _id }: { _id: string }) => _id);

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedAttributes: any[] = [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedAttributeValues: any[] = [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attributes.forEach((prodAttr: any) => {
        let matchedAttr = availableAttributesMap.get(prodAttr._id);
        if (!matchedAttr) {
          for (const val of availableAttributesMap.values()) {
            if (val.label === prodAttr.name) {
              matchedAttr = val;
              break;
            }
          }
        }

        if (matchedAttr) {
          transformedAttributes.push(matchedAttr);
          transformedAttributeValues.push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prodAttr.values?.map((v: any) => ({
              label: v.name,
              value: v._id,
            })) || []
          );
        } else {
          transformedAttributes.push({
            label: prodAttr.name,
            value: prodAttr._id,
            child: [],
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
        metaTitle: seo?.metaTitle || "",
        metaDescription: seo?.metaDescription || "",
        keywords: Array.isArray(seo?.keywords)
          ? seo.keywords.join(", ")
          : seo?.keywords || "",
        canonicalUrl: seo?.canonicalUrl || "",
        schemaMarkup: seo?.schemaMarkup || "",
        image: {
          thumbnail: thumbnail?._id || "",
          gallery: galleryData || [],
        },
        inventory: {
          ...defaultValues.inventory,
          ...restProductData.inventory,
          sku: restProductData.inventory?.sku || undefined,
        },
        category: category?.map((c: { _id: string }) => c._id),
        previewLink: restProductData.previewLink || "",
        productCollection: productCollection?.map(
          (pc: { _id: string }) => pc._id
        ),
        brand: brand?._id,
        attributes: transformedAttributes,
        attributeValues: transformedAttributeValues,
        relatedProducts: relatedProducts,
        warrantyInfo: {
          duration: {
            quantity: warrantyInfo?.duration?.quantity || "",
            unit: warrantyInfo?.duration?.unit || "",
          },
          terms: warrantyInfo?.terms || "",
        },
      };

      reset(formData);
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
      const uiAttributes = data.attributes || [];
      const uiAttributeValues = data.attributeValues || [];

      const payloadAttributes = uiAttributes.map(
        (attr: { label: string; value: string }, index: number) => {
          const values =
            uiAttributeValues[index]?.map(
              (v: { label: string; value: string }) => v.value
            ) || [];
          return {
            name: attr.value,
            values: values,
          };
        }
      );

      const {
        metaTitle,
        metaDescription,
        keywords,
        canonicalUrl,
        schemaMarkup,
        ...restData
      } = data;

      const buildSeoData = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const obj: any = {};
        if (metaTitle) obj.metaTitle = metaTitle;
        if (metaDescription) obj.metaDescription = metaDescription;
        const kws = keywords
          ? String(keywords)
              .split(",")
              .map((k) => k.trim())
              .filter(Boolean)
          : [];
        if (kws.length) obj.keywords = kws;
        if (canonicalUrl) obj.canonicalUrl = canonicalUrl;
        if (schemaMarkup) obj.schemaMarkup = schemaMarkup;
        return Object.keys(obj).length ? obj : undefined;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = {
        ...restData,
        attributes: payloadAttributes,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        relatedProducts: data.relatedProducts?.map((p: any) => p.value) || [],
        ...(buildSeoData() ? { seo: buildSeoData() } : {}),
      };

      if (!payload.inventory?.sku) {
        delete payload.inventory.sku;
      }

      if (payload.variations) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payload.variations.forEach((v: any) => {
          if (v.inventory && !v.inventory.sku) {
            delete v.inventory.sku;
          }
        });
      }

      delete payload.attributeValues;

      if (data.type === PRODUCT_TYPE.VARIABLE) {
        delete payload.price;
        delete payload.inventory;
      } else {
        delete payload.variations;
      }

      if (!payload.brand) delete payload.brand;
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
        "bestSellingProducts",
        "categories",
        "homepageIndividualSection",
        "priceRange",
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

  if (isFetching) {
    return (
      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground">
          Loading product…
        </div>
      </div>
    );
  }

  const submitLabel =
    isCreating || isUpdating
      ? isEdit
        ? "Updating…"
        : "Saving…"
      : isEdit
        ? "Update Product"
        : "Save Product";

  return (
    <div className="mb-10 space-y-5 p-4 sm:p-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="space-y-5"
        >
          {!productId && <ProductResetter />}

          <PageHeader
            title={isEdit ? "Edit Product" : "Add Product"}
            subtitle={
              isEdit
                ? "Update product details, media, and organization"
                : "Create a new product for your catalog"
            }
            icon={isEdit ? Package : PackagePlus}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  asChild
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg gap-1.5"
                >
                  <Link href="/dashboard/products">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back</span>
                  </Link>
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-lg"
                  disabled={isCreating || isUpdating}
                >
                  {submitLabel}
                </Button>
              </div>
            }
          />

          <div className="flex w-full flex-col justify-between gap-5 lg:flex-row">
            <div className="w-full min-w-0 space-y-4 lg:w-[70%]">
              <TitleInput />
              <PreviewLinkInput />
              <ShortDescriptionInput />
              <ProductDataTabs />
              <DescriptionInput />
              <Seo />
              {productData?.createdAt && (
                <div className="flex flex-wrap gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">
                      Created At:
                    </span>{" "}
                    {new Date(productData.createdAt).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "2-digit" }
                    )}
                    ,{" "}
                    {new Date(productData.createdAt).toLocaleTimeString(
                      "en-US",
                      { hour: "numeric", minute: "numeric", hour12: true }
                    )}
                  </p>
                  {productData.updatedAt && (
                    <p>
                      <span className="font-semibold text-foreground">
                        Updated At:
                      </span>{" "}
                      {new Date(productData.updatedAt).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "2-digit" }
                      )}
                      ,{" "}
                      {new Date(productData.updatedAt).toLocaleTimeString(
                        "en-US",
                        { hour: "numeric", minute: "numeric", hour12: true }
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex w-full shrink-0 flex-col space-y-4 lg:w-[30%]">
              <Published />
              <ProductOrganizationPanel
                collectionsData={collectionsResponse?.data?.data}
                isLoading={collectionLoading}
              />
              <RelatedProducts />
              <div className="sticky bottom-4 z-10 space-y-2 rounded-xl border border-border bg-card p-3 shadow-none">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isCreating || isUpdating}
                  className="w-full rounded-lg"
                >
                  {submitLabel}
                </Button>
                {productId && (
                  <DeleteProductBtn
                    id={productId}
                    slug={productData?.slug}
                    variant="destructive"
                    size="sm"
                    className="w-full rounded-lg"
                  >
                    Delete Product
                  </DeleteProductBtn>
                )}
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ProductForm;
