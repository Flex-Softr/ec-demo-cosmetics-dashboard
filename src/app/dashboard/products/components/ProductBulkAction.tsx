"use client";
import CommonSelect from "@/components/commonSelect/CommonSelect";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { PRODUCT_STATUS } from "@/const/products";
import { useUpdateProductStatusMutation } from "@/redux/features/products/productsApi";
import { useAppSelector } from "@/redux/hooks";
import { revalidateTag, TTags } from "@/utilities/revalidate";
import { useState } from "react";

const ProductBulkAction = () => {
  const [action, setAction] = useState("");

  const [updateProductStatus, { isLoading: isUpdateLoading }] =
    useUpdateProductStatusMutation();

  const { productIds, productSlugs } = useAppSelector(
    ({ products }) => products.bulkProducts
  );

  const bulkOptions = [
    { label: "Bulk Actions", value: "bulk" },
    { label: "Published", value: PRODUCT_STATUS.PUBLISHED },
    { label: "Private", value: PRODUCT_STATUS.PRIVATE },
  ];

  const handleRevalidate = async () => {
    const productTags: TTags[] =
      productSlugs?.flatMap((slug: string) => [
        `product-${slug}` as TTags,
        `relatedProducts-${slug}` as TTags,
        `collectionProducts-${slug}` as TTags,
      ]) || [];
    await revalidateTag([
      ...productTags,
      "featuredProducts",
      "bestSellingProducts",
      "categories",
      "homepageIndividualSection",
    ]);
  };

  const handleSubmit = async () => {
    if (!action || action === "bulk") {
      toast({
        variant: "destructive",
        title: "Please select an action!",
      });
      return;
    }
    try {
      if (productIds.length > 0) {
        await updateProductStatus({
          productIds,
          publishedStatus: action,
        }).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: "Products status updated successfully!",
        });
        handleRevalidate();
      } else {
        toast({
          variant: "destructive",
          title: "No products selected!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update products status!",
      });
    }
  };

  return (
    <div className={"flex gap-2 items-center"}>
      <CommonSelect
        options={bulkOptions}
        value={action}
        onChange={(value) => setAction(value)}
        placeholder="Bulk Actions"
        className="border-primary"
      />
      <Button onClick={handleSubmit} disabled={isUpdateLoading}>
        Apply
      </Button>
    </div>
  );
};

export default ProductBulkAction;
