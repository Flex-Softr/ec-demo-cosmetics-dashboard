"use client";
import CommonAlertDialog from "@/components/common/CommonAlertDialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { PRODUCT_STATUS } from "@/const/products";
import {
  useDeleteProductsMutation,
  useUpdateProductStatusMutation,
} from "@/redux/features/products/productsApi";
import { useAppSelector } from "@/redux/hooks";
import { revalidateTag, TTags } from "@/utilities/revalidate";
import { useState } from "react";

const ProductBulkAction = () => {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");

  const [deleteProducts, { isLoading }] = useDeleteProductsMutation();
  const [updateProductStatus, { isLoading: isUpdateLoading }] =
    useUpdateProductStatusMutation();

  const { productIds, productSlugs } = useAppSelector(
    ({ products }) => products.bulkProducts
  );

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

  const handleDelete = async () => {
    try {
      if (productIds.length > 0) {
        await deleteProducts(productIds).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: "Products successfully deleted!",
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
        title: "Failed to delete products!",
      });
    } finally {
      setOpen(false);
    }
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
      if (action === "delete") {
        setOpen(true);
      } else if (productIds.length > 0) {
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
      <CommonAlertDialog
        open={open}
        onOpenChange={setOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete the selected products from the server."
        onConfirm={handleDelete}
        loading={isLoading}
      />
      <Select onValueChange={(value) => setAction(value)}>
        <SelectTrigger className="border-primary focus:ring-primary focus:ring-1">
          <SelectValue placeholder="Bulk Actions" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className="capitalize">
            <SelectItem value="bulk">Bulk Actions</SelectItem>
            {/* <SelectItem value="delete">Delete</SelectItem> */}
            <SelectItem value={PRODUCT_STATUS.PUBLISHED}>Published</SelectItem>
            <SelectItem value={PRODUCT_STATUS.PRIVATE}>Private</SelectItem>
            {/* <SelectItem value="On courier">Courier Entry</SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={handleSubmit} disabled={isLoading || isUpdateLoading}>
        Apply
      </Button>
    </div>
  );
};

export default ProductBulkAction;
