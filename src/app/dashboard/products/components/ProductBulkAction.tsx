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
  useUpdateProductMutation,
} from "@/redux/features/products/productsApi";
import { useAppSelector } from "@/redux/hooks";
import { TProductPayload } from "@/types/products";
import { useState } from "react";

const ProductBulkAction = () => {
  const [action, setAction] = useState("");
  const [deleteProducts, { isLoading }] = useDeleteProductsMutation();
  const [updateProduct, { isLoading: isUpdateLoading }] =
    useUpdateProductMutation();
  const { productsIds } = useAppSelector(
    ({ products }) => products.bulkProducts
  );
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      if (productsIds.length > 0) {
        await deleteProducts(productsIds).unwrap();
        toast({
          className: "bg-success text-white text-2xl",
          title: "Products successfully deleted!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "No products selected!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed!",
      });
    } finally {
      setOpen(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (action === "delete") {
        setOpen(true);
      } else if (
        Object.values(PRODUCT_STATUS).includes(
          action as (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS]
        )
      ) {
        const updatePromises = productsIds.map((id) => {
          const payload: Partial<TProductPayload> = {
            publishedStatus: action,
          };
          return updateProduct({
            id,
            payload,
          }).unwrap();
        });

        await Promise.all(updatePromises);
        toast({
          className: "bg-success text-white text-2xl",
          title: "Products status updated successfully!",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed!",
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
            <SelectItem value="delete">Delete</SelectItem>
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
